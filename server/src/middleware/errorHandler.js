const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error message safely without logging any document contents
  console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `An account with that ${field} already exists.`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const maxMb = process.env.MAX_UPLOAD_SIZE_MB || '10';
    return res.status(400).json({
      success: false,
      message: `File size exceeds the ${maxMb}MB limit. Please upload a smaller document.`
    });
  }

  // Document parsing, unsupported format, password protection, or corruption errors
  const lowerMsg = (err.message || '').toLowerCase();
  if (
    lowerMsg.includes('unsupported document format') ||
    lowerMsg.includes('password-protected') ||
    lowerMsg.includes('corrupted') ||
    lowerMsg.includes('unable to extract readable text') ||
    lowerMsg.includes('ocr was unable') ||
    lowerMsg.includes('insufficient content')
  ) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
