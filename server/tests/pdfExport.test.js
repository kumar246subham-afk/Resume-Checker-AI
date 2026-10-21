const { PDFDocument, StandardFonts } = require('pdf-lib');
const DocumentParserService = require('../src/services/documentParserService');

describe('PDF Export & A4 Pagination Engine', () => {
  // Test filename sanitization
  describe('PDF Filename Sanitization', () => {
    const sanitizePdfFilename = (name) => {
      if (!name || typeof name !== 'string') return 'Professional_Resume.pdf';
      const clean = name.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_');
      return clean ? `${clean}.pdf` : 'Professional_Resume.pdf';
    };

    test('sanitizes standard names with spaces into clean filenames', () => {
      expect(sanitizePdfFilename('Morgan Maxwell')).toBe('Morgan_Maxwell.pdf');
      expect(sanitizePdfFilename('Jane Doe Resume')).toBe('Jane_Doe_Resume.pdf');
    });

    test('strips unsafe characters, slashes, and path traversal tokens', () => {
      expect(sanitizePdfFilename('../../etc/passwd')).toBe('etcpasswd.pdf');
      expect(sanitizePdfFilename('Resume*?:<>"|')).toBe('Resume.pdf');
      expect(sanitizePdfFilename('Alex C++ Developer')).toBe('Alex_C_Developer.pdf');
    });

    test('handles empty, null, or undefined names with safe default', () => {
      expect(sanitizePdfFilename('')).toBe('Professional_Resume.pdf');
      expect(sanitizePdfFilename('   ')).toBe('Professional_Resume.pdf');
      expect(sanitizePdfFilename(null)).toBe('Professional_Resume.pdf');
      expect(sanitizePdfFilename(undefined)).toBe('Professional_Resume.pdf');
      expect(sanitizePdfFilename(12345)).toBe('Professional_Resume.pdf');
    });
  });

  // Test multi-page A4 canvas pagination formula
  describe('A4 Canvas Pagination Geometry', () => {
    const calculatePagination = (canvasWidth, canvasHeight) => {
      const a4Ratio = 297 / 210;
      const pageHeightInCanvasPx = Math.floor(canvasWidth * a4Ratio);
      const totalPages = Math.max(1, Math.ceil(canvasHeight / pageHeightInCanvasPx));
      const slices = [];

      for (let p = 0; p < totalPages; p++) {
        const srcY = p * pageHeightInCanvasPx;
        const srcHeight = Math.min(pageHeightInCanvasPx, canvasHeight - srcY);
        slices.push({ page: p + 1, srcY, srcHeight, pageHeightInCanvasPx });
      }

      return { totalPages, pageHeightInCanvasPx, slices };
    };

    test('single page resume fits in 1 A4 page with no blank pages', () => {
      // 794px width (approx 210mm at 96 DPI), 1000px height
      const result = calculatePagination(794, 1000);
      expect(result.totalPages).toBe(1);
      expect(result.slices.length).toBe(1);
      expect(result.slices[0].srcY).toBe(0);
      expect(result.slices[0].srcHeight).toBe(1000);
    });

    test('two page resume correctly splits across exactly 2 A4 pages', () => {
      // 794px width * (297/210) = 1122px page height
      // 1600px height should yield 2 pages
      const result = calculatePagination(794, 1600);
      expect(result.totalPages).toBe(2);
      expect(result.slices.length).toBe(2);
      expect(result.slices[0].srcY).toBe(0);
      expect(result.slices[0].srcHeight).toBe(result.pageHeightInCanvasPx);
      expect(result.slices[1].srcY).toBe(result.pageHeightInCanvasPx);
      expect(result.slices[1].srcHeight).toBe(1600 - result.pageHeightInCanvasPx);
    });

    test('three page resume splits across 3 pages without overflow', () => {
      const result = calculatePagination(794, 2800);
      expect(result.totalPages).toBe(3);
      expect(result.slices.length).toBe(3);
      expect(result.slices[2].srcY).toBe(result.pageHeightInCanvasPx * 2);
    });
  });

  // Test real PDF construction and validation
  describe('A4 PDF Document Generation & Integrity', () => {
    test('generates valid multi-page A4 PDF documents with standard dimensions', async () => {
      const doc = await PDFDocument.create();
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      
      // Standard A4 in PostScript points: 595.28 x 841.89 (equivalent to 210mm x 297mm)
      const page1 = doc.addPage([595.28, 841.89]);
      page1.drawText('Morgan Maxwell - Staff Software Engineer', { x: 50, y: 800, size: 16, font: helvetica });

      const page2 = doc.addPage([595.28, 841.89]);
      page2.drawText('Education & Certifications', { x: 50, y: 800, size: 14, font: helvetica });

      const pdfBytes = await doc.save({ useObjectStreams: false });

      expect(pdfBytes).toBeDefined();
      expect(pdfBytes.length).toBeGreaterThan(500);

      // Verify PDF header magic bytes "%PDF-"
      const header = Buffer.from(pdfBytes.slice(0, 5)).toString('utf-8');
      expect(header).toBe('%PDF-');

      // Verify document structure and page count using pdf-lib
      const loadedDoc = await PDFDocument.load(pdfBytes);
      expect(loadedDoc.getPageCount()).toBe(2);

      const [p1, p2] = loadedDoc.getPages();
      expect(Math.round(p1.getWidth())).toBe(595);
      expect(Math.round(p1.getHeight())).toBe(842);
      expect(Math.round(p2.getWidth())).toBe(595);
      expect(Math.round(p2.getHeight())).toBe(842);

      // Verify text extraction using DocumentParserService
      const parsed = await DocumentParserService.extractText({
        buffer: Buffer.from(pdfBytes),
        originalname: 'Morgan_Maxwell_Resume.pdf',
        mimetype: 'application/pdf'
      });
      expect(parsed.numPages).toBe(2);
      expect(parsed.text).toContain('Morgan Maxwell');
      expect(parsed.text).toContain('Education & Certifications');
    });
  });

  // Test 10 Premium Templates Schema Validation
  describe('10 Premium Templates Schema Registry', () => {
    const Resume = require('../src/models/Resume');
    const validTemplates = [
      'ats-classic',
      'modern-pro',
      'minimal-elegant',
      'tech-resume',
      'executive-profile',
      'executive-elite',
      'tech-innovator',
      'data-science-pro',
      'creative-portfolio',
      'fresh-graduate-pro'
    ];

    test('validates and accepts each of the 10 registered template IDs', () => {
      validTemplates.forEach((templateId) => {
        const resume = new Resume({
          userId: new (require('mongoose').Types.ObjectId)(),
          templateId
        });
        const err = resume.validateSync(['templateId']);
        expect(err).toBeUndefined();
      });
    });

    test('rejects unauthorized or unknown template IDs', () => {
      const resume = new Resume({
        userId: new (require('mongoose').Types.ObjectId)(),
        templateId: 'unsupported-random-theme'
      });
      const err = resume.validateSync(['templateId']);
      expect(err).toBeDefined();
      expect(err.errors.templateId).toBeDefined();
    });
  });
});
