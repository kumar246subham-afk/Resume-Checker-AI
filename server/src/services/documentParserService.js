const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Service to handle document text extraction and parsing
 */
class DocumentParserService {
  /**
   * Parse PDF buffer into raw text and metadata
   * @param {Buffer} buffer 
   * @returns {Promise<{ text: string, numPages: number, info: object }>}
   */
  static async parsePDF(buffer) {
    try {
      if (!buffer || buffer.length === 0) {
        throw new Error('PDF file buffer is empty');
      }

      const data = await pdfParse(buffer);
      const text = (data.text || '').trim();

      if (!text || text.length < 30) {
        return {
          text: text,
          numPages: data.numpages || 1,
          info: data.info || {},
          isScanned: true,
          warning: 'This document appears to contain scanned images or very little selectable text. An OCR tool or text-based PDF is recommended for full ATS compatibility.'
        };
      }

      return {
        text,
        numPages: data.numpages || 1,
        info: data.info || {},
        isScanned: false
      };
    } catch (err) {
      throw new Error(`Failed to parse PDF document: ${err.message}`);
    }
  }

  /**
   * Parse DOCX buffer into raw text
   * @param {Buffer} buffer 
   * @returns {Promise<{ text: string }>}
   */
  static async parseDOCX(buffer) {
    try {
      if (!buffer || buffer.length === 0) {
        throw new Error('DOCX file buffer is empty');
      }

      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value || '').trim();

      if (!text || text.length < 30) {
        return {
          text: text,
          warning: 'DOCX file extracted minimal text. Please verify the document formatting.'
        };
      }

      return { text };
    } catch (err) {
      throw new Error(`Failed to parse DOCX document: ${err.message}`);
    }
  }

  /**
   * Parse file depending on mime-type or file extension
   */
  static async extractText(file) {
    if (!file || !file.buffer) {
      throw new Error('No valid file buffer provided');
    }

    const mime = file.mimetype || '';
    const name = file.originalname || '';

    if (mime.includes('pdf') || name.toLowerCase().endsWith('.pdf')) {
      return await this.parsePDF(file.buffer);
    } else if (
      mime.includes('word') ||
      mime.includes('officedocument') ||
      name.toLowerCase().endsWith('.docx')
    ) {
      return await this.parseDOCX(file.buffer);
    } else if (name.toLowerCase().endsWith('.txt') || mime.includes('text/plain')) {
      return { text: file.buffer.toString('utf-8') };
    } else {
      throw new Error('Unsupported document format. Please upload a PDF or DOCX file.');
    }
  }

  /**
   * Extract basic heuristic sections from raw text
   */
  static extractStructureHints(text) {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);

    const hasEducation = /education|university|college|bachelor|master|degree|b\.s|m\.s|phd/i.test(text);
    const hasExperience = /experience|work history|employment|career|internship|roles/i.test(text);
    const hasSkills = /skills|technical skills|competencies|technologies|proficiencies/i.test(text);
    const hasProjects = /projects|portfolio|personal projects|open source/i.test(text);
    const hasSummary = /summary|profile|about me|objective|professional overview/i.test(text);

    return {
      contact: {
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0] : null,
        linkedin: linkedinMatch ? linkedinMatch[0] : null,
        github: githubMatch ? githubMatch[0] : null
      },
      sectionsDetected: {
        summary: hasSummary,
        experience: hasExperience,
        education: hasEducation,
        skills: hasSkills,
        projects: hasProjects
      }
    };
  }
}

module.exports = DocumentParserService;
