const multer = require('multer');

// Store file in memory buffer for immediate processing and security
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const ext = (file.originalname || '').toLowerCase();
  const hasValidExt = allowedExtensions.some(e => ext.endsWith(e));

  if (allowedMimeTypes.includes(file.mimetype) || hasValidExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid document format. Only PDF, DOCX, and TXT files are supported.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

module.exports = upload;
