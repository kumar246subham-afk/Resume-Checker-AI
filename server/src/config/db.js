const mongoose = require('mongoose');

/**
 * Reusable MongoDB connection module with production pooling,
 * reconnect handlers, and graceful error handling.
 */
const connectDB = async () => {
  // Prevent duplicate connections during development reloads
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    if (isProduction) {
      const prodErr = new Error('MONGODB_URI environment variable is missing in production. Application startup aborted.');
      console.error(`[Database Fatal] ${prodErr.message}`);
      throw prodErr;
    }
    uri = 'mongodb://127.0.0.1:27017/resume_checker_ai';
  }

  // Sanitize URI for safe logging (mask username and password)
  const safeUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

  const options = {
    dbName: 'resume_checker_ai', // Explicitly target application database in Atlas
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    autoIndex: !isProduction // Avoid automatic index building overhead in production
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB (${safeUri}): ${error.message}`);
    if (isProduction || process.env.NODE_ENV === 'test') {
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
