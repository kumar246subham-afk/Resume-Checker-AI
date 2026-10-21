const mongoose = require('mongoose');

/**
 * Reusable MongoDB connection module with production pooling,
 * reconnect handlers, and graceful error handling.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_checker_ai';

  // Sanitize URI for safe logging (mask password)
  const safeUri = uri.replace(/:\/\/(.*?):(.*?)@/, '://$1:****@');

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    autoIndex: process.env.NODE_ENV !== 'production' // Avoid build index overhead in production
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB (${safeUri}): ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Database Warning] Running in production without a verified database connection. Check MONGODB_URI in Render dashboard.');
    }
    // In test environment, throw so tests can assert or handle
    if (process.env.NODE_ENV === 'test') {
      throw error;
    }
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection lost. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Connection error: ${err.message}`);
});

module.exports = connectDB;
