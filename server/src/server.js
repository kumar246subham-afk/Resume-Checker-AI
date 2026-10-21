require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const CleanupService = require('./utils/cleanup');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Fatal Uncaught Exception] ${err.name || 'Error'}: ${err.message}`);
  console.error(err.stack);
});

// Production environment secret check
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('super_secret_resume_checker')) {
    console.warn('[Security Warning] JWT_SECRET is not set to a unique production secret. Please configure JWT_SECRET in your hosting dashboard.');
  }
}

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0';

let server;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    CleanupService.initScheduledCleanup();
    server = app.listen(PORT, HOST, () => {
      console.log(`[Server] Resume Checker AI API listening on http://${HOST}:${PORT} (environment: ${process.env.NODE_ENV || 'development'})`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Promise Rejection] ${err.name || 'Error'}: ${err.message}`);
      if (server) {
        server.close(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });
  } catch (err) {
    console.error(`[Startup Error] ${err.message}`);
    process.exit(1);
  }
};

// Graceful shutdown handling for Render / Linux containers
const gracefulShutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        console.log('[Database] MongoDB connection closed.');
      } catch (err) {
        console.error(`[Database Error during shutdown] ${err.message}`);
      }
      process.exit(0);
    });

    // Force exit if shutdown takes longer than 10 seconds
    setTimeout(() => {
      console.error('[Server] Forcefully terminating after 10s timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
