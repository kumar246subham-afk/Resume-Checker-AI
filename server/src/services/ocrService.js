const { createWorker } = require('tesseract.js');

/**
 * Universal OCR Service using Tesseract.js (WebAssembly / pure JS engine)
 * Compatible with Node.js, Linux, Windows, Docker, and serverless environments.
 */
class OCRService {
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
   * Run OCR on a single image buffer (PNG, JPEG, BMP, WebP)
   * @param {Buffer} imageBuffer - Buffer of the image
   * @param {object} options - Options including timeoutMs (default 25000ms)
   * @returns {Promise<{ text: string, confidence: number }>}
   */
  static async recognizeImage(imageBuffer, options = {}) {
    if (!imageBuffer || imageBuffer.length === 0) {
      return { text: '', confidence: 0 };
    }

    const timeoutMs = options.timeoutMs || 25000;
    let worker = null;

    const ocrPromise = (async () => {
      try {
        worker = await createWorker('eng');
        const ret = await worker.recognize(imageBuffer);
        const text = (ret?.data?.text || '').trim();
        const confidence = ret?.data?.confidence || 0;
        return { text, confidence };
      } finally {
        if (worker) {
          try {
            await worker.terminate();
          } catch (err) {
            // Ignore worker termination cleanup errors
          }
        }
      }
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`OCR processing timed out after ${timeoutMs / 1000} seconds.`)), timeoutMs)
    );

    return Promise.race([ocrPromise, timeoutPromise]);
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
        const result = await this.recognizeImage(pagesToProcess[i], { timeoutMs: 20000 });
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
