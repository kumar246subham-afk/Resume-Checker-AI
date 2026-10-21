const { PDFDocument, StandardFonts } = require('pdf-lib');
const DocumentParserService = require('../src/services/documentParserService');
const OCRService = require('../src/services/ocrService');
const ATSScoringService = require('../src/services/atsScoringService');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

// Helper to create valid test PDFs using pdf-lib
async function createTestPdfBuffer(lines) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let y = 740;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 11, font });
    y -= 22;
  }
  return Buffer.from(await doc.save());
}

describe('Universal Document Parser & Extraction Pipeline Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_checker_ai_test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('1. File Signature / Magic Bytes Detection', () => {
    test('Detects PDF file signature correctly', () => {
      const buffer = Buffer.from('%PDF-1.7\nSample text');
      const detected = DocumentParserService.detectFileType(buffer);
      expect(detected).toBe('pdf');
    });

    test('Detects JPEG file signature correctly', () => {
      const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
      const detected = DocumentParserService.detectFileType(buffer);
      expect(detected).toBe('jpeg');
    });

    test('Detects PNG file signature correctly', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const detected = DocumentParserService.detectFileType(buffer);
      expect(detected).toBe('png');
    });

    test('Detects DOCX / Zip signature correctly', () => {
      const buffer = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x00, 0x00]);
      const detected = DocumentParserService.detectFileType(buffer);
      expect(detected).toBe('docx');
    });

    test('Detects plain text files accurately', () => {
      const buffer = Buffer.from('Alex Morgan\nSoftware Engineer\nSummary of skills', 'utf-8');
      const detected = DocumentParserService.detectFileType(buffer, 'text/plain', 'resume.txt');
      expect(detected).toBe('txt');
    });
  });

  describe('2. Standard Selectable PDF Parsing', () => {
    test('Extracts text, preserves line structure, and returns metadata for valid PDF', async () => {
      const buffer = await createTestPdfBuffer([
        'Taylor Swift',
        'taylor@example.com | (555) 019-2834 | New York, NY',
        'PROFESSIONAL SUMMARY',
        'Dynamic Full Stack Developer with 4 years of experience building React and Node applications.',
        'TECHNICAL SKILLS',
        'JavaScript, TypeScript, React, Node.js, Express, MongoDB, Docker, Git',
        'EXPERIENCE',
        'Software Engineer | Acme Corp | 2021 - Present',
        '- Designed and implemented RESTful microservices processing 200k daily requests.',
        '- Optimized React UI rendering, improving Core Web Vitals LCP by 32%.',
        'EDUCATION',
        'Bachelor of Science in Computer Science | State University | 2020'
      ]);

      const result = await DocumentParserService.extractText({
        buffer,
        originalname: 'taylor_resume.pdf',
        mimetype: 'application/pdf'
      });

      expect(result.text).toBeDefined();
      expect(result.text).toContain('Taylor Swift');
      expect(result.text).toContain('taylor@example.com');
      expect(result.text).toContain('React and Node applications');
      expect(result.method).toBe('selectable-text');
      expect(result.isScanned).toBe(false);
      expect(result.numPages).toBe(1);
    });
  });

  describe('3. Text File (.txt) Parsing', () => {
    test('Extracts UTF-8 plain text documents accurately', async () => {
      const plainText = `
        Jordan Lee
        jordan.lee@domain.com | (555) 321-9876
        
        Summary:
        Talented Front End Engineer specializing in React, Next.js, and accessible web standards.
        
        Skills:
        React, JavaScript, HTML5, CSS3, Tailwind CSS, Jest
      `;

      const result = await DocumentParserService.extractText({
        buffer: Buffer.from(plainText, 'utf-8'),
        originalname: 'resume.txt',
        mimetype: 'text/plain'
      });

      expect(result.text).toContain('Jordan Lee');
      expect(result.text).toContain('Front End Engineer');
      expect(result.method).toBe('text-raw');
    });
  });

  describe('4. Error Handling & Security Validation', () => {
    test('Rejects empty file buffer with descriptive error', async () => {
      await expect(
        DocumentParserService.extractText({
          buffer: Buffer.alloc(0),
          originalname: 'empty.pdf',
          mimetype: 'application/pdf'
        })
      ).rejects.toThrow();
    });

    test('Rejects unsupported file types gracefully', async () => {
      await expect(
        DocumentParserService.extractText({
          buffer: Buffer.from([0x00, 0x01, 0x02, 0x03]),
          originalname: 'resume.exe',
          mimetype: 'application/x-msdownload'
        })
      ).rejects.toThrow(/Unsupported document format/);
    });

    test('Safely handles corrupted PDF document without hanging', async () => {
      const corruptedBuffer = Buffer.from('%PDF-1.5\nMalformed trailer << /Root invalid >>\n%%EOF');
      await expect(
        DocumentParserService.extractText({
          buffer: corruptedBuffer,
          originalname: 'corrupted.pdf',
          mimetype: 'application/pdf'
        })
      ).rejects.toThrow();
    });

    test('Safely handles corrupted DOCX document with actionable error message', async () => {
      const corruptedDocx = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0xDE, 0xAD, 0xBE, 0xEF]);
      await expect(
        DocumentParserService.extractText({
          buffer: corruptedDocx,
          originalname: 'resume.docx',
          mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
      ).rejects.toThrow(/corrupted or invalid/);
    });

    test('Rejects documents with insufficient text (blank pages)', async () => {
      const blankDoc = await PDFDocument.create();
      blankDoc.addPage([600, 800]);
      const blankBuffer = Buffer.from(await blankDoc.save());

      await expect(
        DocumentParserService.extractText({
          buffer: blankBuffer,
          originalname: 'blank.pdf',
          mimetype: 'application/pdf'
        })
      ).rejects.toThrow(/Unable to extract readable text/);
    });
  });

  describe('5. Student / Fresher Resume Assessment', () => {
    test('Identifies Student / Entry Level career profile and evaluates fairly without failure', () => {
      const studentResume = `
        Alex Rivera
        alex.rivera@university.edu | (555) 777-8899 | Austin, TX
        github.com/alexrivera | linkedin.com/in/alexrivera
        
        EDUCATION
        Bachelor of Science in Computer Science
        University of Texas at Austin | Expected Graduation: May 2025
        GPA: 3.82 / 4.0 | Dean's Honor Roll
        Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management, Web Development
        
        PROJECTS
        Campus Event Finder | Full Stack Web App
        - Built an interactive campus event dashboard using React, Node.js, and MongoDB.
        - Integrated Google Maps API to visualize event locations for 2,500+ student users.
        - Implemented user authentication with JWT and password hashing via bcrypt.
        
        Automated Resume Keyword Extractor | Python CLI Tool
        - Developed a Python script parsing PDF resumes to extract keywords and compute term frequency.
        - Utilized regular expressions and natural language processing to benchmark resumes against job descriptions.
        
        TECHNICAL SKILLS
        Languages: Python, JavaScript, Java, C++, SQL
        Frameworks & Libraries: React, Node.js, Express, Tailwind CSS
        Developer Tools: Git, GitHub, VS Code, Postman, MongoDB Compass
        
        LEADERSHIP & ACTIVITIES
        Member, Association for Computing Machinery (ACM)
        Peer Tutor, Computer Science Department | Assisted 30+ students in introductory programming
      `;

      const result = ATSScoringService.evaluate(studentResume, {
        targetJobTitle: 'Junior Software Engineer'
      });

      expect(result.detectedCareerLevel).toBe('Student / Entry Level');
      // Must not penalize heavily for lack of 5+ years experience
      expect(result.scores.overall).toBeGreaterThanOrEqual(65);
      expect(result.scores.atsReadability).toBeGreaterThanOrEqual(80);
      expect(result.contactDetection.emailFound).toBe(true);
      expect(result.contactDetection.phoneFound).toBe(true);
      // Constructive expansion recommendations should be present instead of failures
      expect(result.strengths.length).toBeGreaterThan(0);
    });
  });

  describe('6. Text Sanitization and OCR Cleaner', () => {
    test('Normalizes messy spacing, repeated blank lines, and OCR artifacts', () => {
      const rawText = `
        Jane    Doe   
        
        
        
        Software   Engineer    
        • Designed    APIs.  
        |  |  |  
        ~ ~ ~
        • Reduced latency   by   30%.  
      `;

      const cleaned = OCRService.cleanOcrText(rawText);
      expect(cleaned).toContain('Jane Doe');
      expect(cleaned).toContain('Software Engineer');
      expect(cleaned).toContain('• Designed APIs.');
      expect(cleaned).toContain('• Reduced latency by 30%.');
      expect(cleaned).not.toContain('   ');
      expect(cleaned).not.toContain('|  |  |');
    });
  });

  describe('7. Universal Upload API Endpoint Integration (Guest & Authenticated)', () => {
    test('POST /api/analysis/upload supports unauthenticated guest upload and returns real analysis', async () => {
      const pdfBuffer = await createTestPdfBuffer([
        'Morgan Vance',
        'morgan.vance@example.com | (555) 888-9999 | Seattle, WA',
        'PROFESSIONAL SUMMARY',
        'Experienced Cloud Solutions Architect with deep experience designing AWS enterprise environments.',
        'TECHNICAL SKILLS',
        'AWS, Terraform, Kubernetes, Docker, Python, Go, CI/CD, Microservices',
        'WORK EXPERIENCE',
        'Cloud Solutions Architect | Cloud Corp | 2018 - Present',
        '- Architected multi-region AWS infrastructure reducing downtime by 99.9%.',
        '- Automated infrastructure deployments using Terraform and GitHub Actions.',
        'EDUCATION',
        'B.S. in Computer Engineering | University of Washington | 2016'
      ]);

      const res = await request(app)
        .post('/api/analysis/upload')
        .field('targetJobTitle', 'Cloud Architect')
        .attach('resumeFile', pdfBuffer, { filename: 'morgan_resume.pdf', contentType: 'application/pdf' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.scores.overall).toBeGreaterThanOrEqual(65);
      expect(res.body.data.extractionMetadata.method).toBe('selectable-text');
      // Privacy verification: extractedText should NOT be returned or persisted
      expect(res.body.data.extractedText).toBeUndefined();
    });

    test('POST /api/analysis/upload rejects unsupported file extension properly', async () => {
      const res = await request(app)
        .post('/api/analysis/upload')
        .attach('resumeFile', Buffer.from('dummy binary content'), { filename: 'resume.exe', contentType: 'application/octet-stream' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unsupported document format/);
    });
  });
});
