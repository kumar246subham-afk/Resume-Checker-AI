const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const OCRService = require('./ocrService');

/**
 * Universal Document Parser & Text Extraction Pipeline
 * Supports: Text PDFs, Scanned PDFs (with OCR), DOCX, JPEG, PNG, TXT
 */
class DocumentParserService {
  /**
   * Detect actual document format using file magic bytes / signature
   * @param {Buffer} buffer 
   * @param {string} declaredMime 
   * @param {string} originalName 
   * @returns {'pdf' | 'docx' | 'jpeg' | 'png' | 'txt' | 'unknown'}
   */
  static detectFileType(buffer, declaredMime = '', originalName = '') {
    if (!buffer || buffer.length < 4) {
      return 'unknown';
    }

    // Check Magic Bytes / Signatures
    // PDF: %PDF (0x25 0x50 0x44 0x46)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return 'pdf';
    }

    // PNG: \x89PNG (0x89 0x50 0x4E 0x47)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'png';
    }

    // JPEG: 0xFF 0xD8 0xFF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'jpeg';
    }

    // DOCX (Zip archive): PK\x03\x04 (0x50 0x4B 0x03 0x04)
    if (buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
      return 'docx';
    }

    // Fall back to filename and MIME
    const nameLower = (originalName || '').toLowerCase();
    const mimeLower = (declaredMime || '').toLowerCase();

    if (nameLower.endsWith('.pdf') || mimeLower.includes('pdf')) return 'pdf';
    if (nameLower.endsWith('.docx') || mimeLower.includes('wordprocessingml') || mimeLower.includes('officedocument')) return 'docx';
    if (nameLower.endsWith('.png') || mimeLower.includes('png')) return 'png';
    if (nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg') || mimeLower.includes('jpeg') || mimeLower.includes('jpg')) return 'jpeg';
    if (nameLower.endsWith('.txt') || mimeLower.includes('text/plain')) return 'txt';

    // Verify if it looks like plain text (ASCII/UTF-8 without binary control characters)
    let isAscii = true;
    for (let i = 0; i < Math.min(buffer.length, 512); i++) {
      const b = buffer[i];
      if (b === 0 || (b < 7 && b !== 9 && b !== 10 && b !== 13)) {
        isAscii = false;
        break;
      }
    }
    if (isAscii) return 'txt';

    return 'unknown';
  }

  /**
   * Custom layout-preserving page renderer for PDF.js
   * Groups text items into visual lines and sorts by coordinates
   */
  static _enhancedPageRender(pageData) {
    return pageData.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false
    }).then(textContent => {
      if (!textContent || !textContent.items || textContent.items.length === 0) {
        return '';
      }

      const items = textContent.items.filter(item => item && typeof item.str === 'string');
      if (items.length === 0) return '';

      // Group into lines based on Y coordinate with tolerance
      const lineBuckets = [];
      const sortedByY = [...items].sort((a, b) => b.transform[5] - a.transform[5]);

      for (const item of sortedByY) {
        const y = item.transform[5];
        let bucket = lineBuckets.find(b => Math.abs(b.y - y) <= 4);
        if (!bucket) {
          bucket = { y, items: [] };
          lineBuckets.push(bucket);
        }
        bucket.items.push(item);
      }

      // Sort lines top-to-bottom
      lineBuckets.sort((a, b) => b.y - a.y);

      // Within each line, sort items left-to-right
      const lines = lineBuckets.map(bucket => {
        bucket.items.sort((a, b) => a.transform[4] - b.transform[4]);

        let lineText = '';
        let prevRight = null;

        for (const item of bucket.items) {
          const itemText = item.str;
          if (!itemText) continue;

          const itemLeft = item.transform[4];
          const itemWidth = item.width || 0;

          if (prevRight !== null) {
            const gap = itemLeft - prevRight;
            if (gap > 2 && !lineText.endsWith(' ') && !itemText.startsWith(' ')) {
              lineText += ' ';
            }
          }

          lineText += itemText;
          prevRight = itemLeft + itemWidth;
        }

        return lineText.trim();
      }).filter(l => l.length > 0);

      return lines.join('\n');
    });
  }

  /**
   * Extract embedded image streams from a PDF buffer (for scanned PDFs)
   * @param {Buffer} buffer 
   * @returns {Promise<Buffer[]>}
   */
  static async extractPdfImages(buffer) {
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const images = [];

      for (const [, obj] of pdfDoc.context.enumerateIndirectObjects()) {
        if (obj instanceof PDFRawStream) {
          const dict = obj.dict;
          const subtype = dict.get(PDFName.of('Subtype'));
          if (subtype && subtype.toString() === '/Image') {
            const filter = dict.get(PDFName.of('Filter'));
            // DCTDecode is standard JPEG
            if (filter && filter.toString() === '/DCTDecode') {
              images.push(Buffer.from(obj.contents));
            }
          }
        }
      }

      return images;
    } catch (err) {
      console.warn(`[DocumentParser] PDF image stream extraction warning: ${err.message}`);
      return [];
    }
  }

  /**
   * Parse PDF buffer into text with OCR fallback
   */
  static async parsePDF(buffer) {
    if (!buffer || buffer.length === 0) {
      throw new Error('PDF file buffer is empty');
    }

    // Check for password protection in pdf-lib first
    try {
      await PDFDocument.load(buffer);
    } catch (err) {
      const errMsg = (err.message || '').toLowerCase();
      if (errMsg.includes('encrypted') || errMsg.includes('password')) {
        throw new Error('This PDF is password-protected. Please remove the password and upload it again.');
      }
    }

    let parsed = null;
    let selectableText = '';

    try {
      const pdfInput = { data: new Uint8Array(buffer) };
      try {
        parsed = await pdfParse(pdfInput, {
          pagerender: this._enhancedPageRender
        });
      } catch (layoutErr) {
        console.warn(`[DocumentParser] Enhanced layout renderer warning: ${layoutErr.message}. Falling back to standard parser.`);
        parsed = await pdfParse(pdfInput);
      }
      selectableText = this.normalizeExtractedText(parsed?.text || '');
    } catch (err) {
      const errMsg = (err.message || '').toLowerCase();
      if (errMsg.includes('password') || err.name === 'PasswordException') {
        throw new Error('This PDF is password-protected. Please remove the password and upload it again.');
      }
      console.warn(`[DocumentParser] Selectable text extraction warning: ${err.message}`);
    }

    const numPages = parsed?.numpages || 1;

    // Check if selectable text has sufficient substance
    const alphanumericChars = (selectableText.match(/[a-zA-Z0-9]/g) || []).length;

    if (alphanumericChars >= 40) {
      return {
        text: selectableText,
        numPages,
        method: 'selectable-text',
        isScanned: false
      };
    }

    // Selectable text is empty or sparse: Trigger OCR Fallback
    console.log('[DocumentParser] Sparse or zero selectable text detected. Attempting OCR on scanned PDF pages...');

    const embeddedImages = await this.extractPdfImages(buffer);

    if (embeddedImages.length > 0) {
      const ocrResult = await OCRService.recognizeMultipleImages(embeddedImages);
      const cleanedOcrText = this.normalizeExtractedText(OCRService.cleanOcrText(ocrResult.text));
      const ocrAlphaChars = (cleanedOcrText.match(/[a-zA-Z0-9]/g) || []).length;

      if (ocrAlphaChars >= 25) {
        return {
          text: cleanedOcrText,
          numPages: Math.max(numPages, embeddedImages.length),
          method: 'ocr-scanned-pdf',
          isScanned: true,
          ocrConfidence: ocrResult.avgConfidence
        };
      }
    }

    // If both ordinary text extraction and image OCR failed to find readable text:
    if (alphanumericChars > 0) {
      // Return whatever short text was found (e.g. minimal student resume) rather than failing
      return {
        text: selectableText,
        numPages,
        method: 'selectable-text-minimal',
        isScanned: false,
        warning: 'The document contains minimal text. Recommendations will help you expand missing sections.'
      };
    }

    throw new Error('Unable to extract readable text from this PDF. The document appears to be blank, corrupted, or contains unreadable low-resolution scans.');
  }

  /**
   * Parse DOCX Microsoft Word documents
   */
  static async parseDOCX(buffer) {
    if (!buffer || buffer.length === 0) {
      throw new Error('DOCX document buffer is empty');
    }

    try {
      // 1. Try markdown conversion to preserve lists, headings, and tables
      const mdResult = await mammoth.convertToMarkdown({ buffer });
      let text = (mdResult.value || '').trim();

      // 2. If markdown extraction yielded minimal text, try raw text
      if (!text || text.length < 20) {
        const rawResult = await mammoth.extractRawText({ buffer });
        text = (rawResult.value || '').trim();
      }

      text = this.normalizeExtractedText(text);

      if (!text || (text.match(/[a-zA-Z0-9]/g) || []).length < 20) {
        throw new Error('The DOCX document contains no readable text. Please check that the file is not empty or corrupted.');
      }

      return {
        text,
        numPages: 1,
        method: 'docx-parser',
        isScanned: false
      };
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('corrupted') || msg.includes('zip') || msg.includes('end of central directory')) {
        throw new Error('The uploaded DOCX file appears to be corrupted or invalid. Please open and re-save the document in Word before uploading.');
      }
      throw new Error(`Failed to parse DOCX file: ${err.message}`);
    }
  }

  /**
   * Parse Image Resumes (JPG, JPEG, PNG) using OCR
   */
  static async parseImage(buffer, format = 'image') {
    if (!buffer || buffer.length === 0) {
      throw new Error('Image file buffer is empty');
    }

    console.log(`[DocumentParser] Running OCR on uploaded ${format.toUpperCase()} image resume...`);

    const result = await OCRService.recognizeImage(buffer, { timeoutMs: 30000 });
    const cleanedText = this.normalizeExtractedText(OCRService.cleanOcrText(result.text));
    const alphaCount = (cleanedText.match(/[a-zA-Z0-9]/g) || []).length;

    if (alphaCount < 25) {
      throw new Error('OCR was unable to detect legible text on this resume image. Please ensure the image is clear, right-side up, and high resolution.');
    }

    return {
      text: cleanedText,
      numPages: 1,
      method: `ocr-${format}`,
      isScanned: true,
      ocrConfidence: result.confidence
    };
  }

  /**
   * Universal Extraction router for any uploaded file
   * @param {object} file - Multer file object with buffer, mimetype, originalname
   */
  static async extractText(file) {
    if (!file || !file.buffer) {
      throw new Error('No document file buffer provided');
    }

    const detectedType = this.detectFileType(file.buffer, file.mimetype, file.originalname);

    switch (detectedType) {
      case 'pdf':
        return await this.parsePDF(file.buffer);

      case 'docx':
        return await this.parseDOCX(file.buffer);

      case 'jpeg':
      case 'png':
        return await this.parseImage(file.buffer, detectedType);

      case 'txt': {
        const text = this.normalizeExtractedText(file.buffer.toString('utf-8'));
        if (!text || (text.match(/[a-zA-Z0-9]/g) || []).length < 20) {
          throw new Error('The text file contains insufficient content.');
        }
        return { text, numPages: 1, method: 'text-raw', isScanned: false };
      }

      default:
        throw new Error('Unsupported document format. Please upload a PDF, Word DOCX, PNG, or JPEG file.');
    }
  }

  /**
   * Normalize whitespace, remove repeated empty lines, and preserve formatting
   */
  static normalizeExtractedText(rawText) {
    if (!rawText) return '';

    return rawText
      // Standardize Windows and Mac line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove non-printable control characters (except tab and newline)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Standardize horizontal whitespace
      .replace(/[\t\f\v ]+/g, ' ')
      // Standardize bullet points
      .replace(/^[•*·▪▫►o°~-]\s*/gm, '• ')
      // Remove excess empty lines (max 2 consecutive newlines)
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

module.exports = DocumentParserService;
