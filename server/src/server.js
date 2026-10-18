require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Fatal Uncaught Exception] ${err.message}`);
  console.error(err.stack);
});

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[Server] Resume Checker AI Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Promise Rejection] ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`[Startup Error] ${err.message}`);
    process.exit(1);
  }
};

startServer();
