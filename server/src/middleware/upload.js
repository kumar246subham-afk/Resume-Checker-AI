const multer = require('multer');

// Store file in memory buffer for immediate processing and security (no permanent disk storage)
const storage = multer.memoryStorage();

const maxFileSizeMB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10', 10);

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.txt'];
  const ext = (file.originalname || '').toLowerCase();
  const hasValidExt = allowedExtensions.some(e => ext.endsWith(e));

  if (allowedMimeTypes.includes(file.mimetype) || hasValidExt) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported document format. Please upload a PDF, DOCX, PNG, or JPEG file.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024 // e.g. 10MB
  },
  fileFilter
});

module.exports = upload;
