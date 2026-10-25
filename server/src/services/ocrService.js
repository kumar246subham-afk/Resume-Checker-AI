const { createWorker, PSM } = require('tesseract.js');

/**
 * Universal OCR Service using Tesseract.js (WebAssembly / pure JS engine)
 * Optimized for low-resource cloud environments (Render Free Tier):
 * - Worker caching / warm-up to eliminate 10-15s cold worker spin-up penalty
 * - Parameter tuning to bypass unnecessary HOCR/TSV/box generation
 * - 45s safety timeout with clean worker termination on abort
 * - 5-minute idle auto-shutdown to conserve container memory
 */
class OCRService {
  static _workerInstance = null;
  static _workerBusy = false;
  static _idleTimer = null;

  /**
   * Check if OCR engine is available in current runtime
   */
  static isAvailable() {
    try {
      return typeof createWorker === 'function';
    } catch {
      return false;
    }
  }

  /**
   * Get or initialize a warm worker
   */
  static async _getWorker() {
    // Clear idle shutdown timer if pending
    if (this._idleTimer) {
      clearTimeout(this._idleTimer);
      this._idleTimer = null;
    }

    if (!this._workerInstance) {
      console.log('[OCR Service] Initializing warm Tesseract worker...');
      const worker = await createWorker('eng');
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
        tessjs_create_hocr: '0',
        tessjs_create_tsv: '0',
        tessjs_create_box: '0',
        tessjs_create_unlv: '0',
        tessjs_create_osd: '0'
      });
      this._workerInstance = worker;
      console.log('[OCR Service] Warm Tesseract worker ready.');
    }

    return this._workerInstance;
  }

  /**
   * Schedule worker termination after 5 minutes of inactivity to release memory
   */
  static _scheduleIdleShutdown() {
    if (this._idleTimer) {
      clearTimeout(this._idleTimer);
    }
    this._idleTimer = setTimeout(async () => {
      await this.terminateWorker();
    }, 5 * 60 * 1000);

    if (this._idleTimer.unref) {
      this._idleTimer.unref();
    }
  }

  /**
   * Force termination of current worker (e.g. after timeout or shutdown)
   */
  static async terminateWorker() {
    if (this._workerInstance) {
      try {
        console.log('[OCR Service] Terminating worker to free container memory...');
        await this._workerInstance.terminate();
      } catch (err) {
        // Silently handle termination error
      } finally {
        this._workerInstance = null;
        this._workerBusy = false;
      }
    }
  }

  /**
   * Run OCR on a single image buffer (PNG, JPEG, BMP, WebP)
   * @param {Buffer} imageBuffer - Buffer of the image
   * @param {object} options - Options including timeoutMs (default 45000ms)
   * @returns {Promise<{ text: string, confidence: number }>}
   */
  static async recognizeImage(imageBuffer, options = {}) {
    if (!imageBuffer || imageBuffer.length === 0) {
      return { text: '', confidence: 0 };
    }

    const timeoutMs = options.timeoutMs || 45000;
    let workerToUse = null;
    let isDedicatedWorker = false;

    // If active worker is busy with another concurrent request, spin up an ephemeral one
    if (this._workerBusy || !this._workerInstance) {
      if (this._workerBusy) {
        console.log('[OCR Service] Primary worker busy, creating ephemeral worker...');
        isDedicatedWorker = true;
        workerToUse = await createWorker('eng');
        await workerToUse.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
          tessjs_create_hocr: '0',
          tessjs_create_tsv: '0',
          tessjs_create_box: '0',
          tessjs_create_unlv: '0',
          tessjs_create_osd: '0'
        });
      } else {
        workerToUse = await this._getWorker();
        this._workerBusy = true;
      }
    } else {
      workerToUse = this._workerInstance;
      this._workerBusy = true;
    }

    let timeoutId = null;

    try {
      const ocrPromise = (async () => {
        const ret = await workerToUse.recognize(imageBuffer);
        const text = (ret?.data?.text || '').trim();
        const confidence = ret?.data?.confidence || 0;
        return { text, confidence };
      })();

      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`OCR processing timed out after ${timeoutMs / 1000} seconds. Please upload a PDF or a compressed image under 2MB for faster analysis.`));
        }, timeoutMs);
      });

      const result = await Promise.race([ocrPromise, timeoutPromise]);
      return result;
    } catch (err) {
      // If error or timeout occurred, destroy the worker so corrupted WASM state is not reused
      if (isDedicatedWorker) {
        try { await workerToUse.terminate(); } catch (_) {}
      } else {
        await this.terminateWorker();
      }
      throw err;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (isDedicatedWorker) {
        try { await workerToUse.terminate(); } catch (_) {}
      } else {
        this._workerBusy = false;
        this._scheduleIdleShutdown();
      }
    }
  }

  /**
   * Run OCR on multiple image buffers (e.g., pages of a scanned PDF)
   * @param {Buffer[]} imageBuffers - Array of image buffers in page order
   * @param {object} options - Options
   * @returns {Promise<{ text: string, pagesRecognized: number, avgConfidence: number }>}
   */
  static async recognizeMultipleImages(imageBuffers, options = {}) {
    if (!Array.isArray(imageBuffers) || imageBuffers.length === 0) {
      return { text: '', pagesRecognized: 0, avgConfidence: 0 };
    }

    // Safety limit to prevent memory exhaustion on massive scanned documents
    const maxPages = options.maxPages || 6;
    const pagesToProcess = imageBuffers.slice(0, maxPages);

    const pageResults = [];
    let totalConfidence = 0;

    for (let i = 0; i < pagesToProcess.length; i++) {
      try {
        const result = await this.recognizeImage(pagesToProcess[i], { timeoutMs: 30000 });
        if (result.text && result.text.length > 0) {
          pageResults.push(result.text);
          totalConfidence += result.confidence;
        }
      } catch (err) {
        console.warn(`[OCR Service] Page ${i + 1} OCR warning: ${err.message}`);
      }
    }

    const fullText = pageResults.join('\n\n--- Page Break ---\n\n').trim();
    const avgConfidence = pageResults.length > 0 ? Math.round(totalConfidence / pageResults.length) : 0;

    return {
      text: fullText,
      pagesRecognized: pageResults.length,
      avgConfidence
    };
  }

  /**
   * Post-process and sanitize raw OCR text
   */
  static cleanOcrText(text) {
    if (!text) return '';

    return text
      // Replace strange OCR nulls / control chars
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Remove solitary OCR noise characters on their own line (e.g. `|  |  |` or `~ ~ ~`)
      .replace(/^[|~_=+*#-]+(\s+[|~_=+*#-]+)*$/gm, '')
      // Fix common OCR artifact bullet points
      .replace(/^[•*·▪▫►o°~]\s*/gm, '• ')
      // Fix broken words split by hyphen at line end (e.g., "imple-\nmented" -> "implemented")
      .replace(/(\b[a-zA-Z]+)-\r?\n\s*([a-zA-Z]+\b)/g, '$1$2')
      // Normalize spaces
      .replace(/[ \t]{2,}/g, ' ')
      // Normalize multiple consecutive blank lines to double newline
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

module.exports = OCRService;
