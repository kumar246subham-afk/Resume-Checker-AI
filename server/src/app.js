const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const jobMatchRoutes = require('./routes/jobMatchRoutes');
const careerAssistantRoutes = require('./routes/careerAssistantRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Trust reverse proxy (Render, Heroku, etc.) so express-rate-limit and IP detection work correctly
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// Clean & normalize allowed CORS origins
const rawClientUrls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
const normalizedAllowedOrigins = rawClientUrls
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Always permit local development URLs when not strictly production
const localOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow configured origins
    if (normalizedAllowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // In development or test, allow local origins
    if (process.env.NODE_ENV !== 'production' && localOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Support Vercel preview deployments if explicitly allowed or matching vercel.app
    if (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Block unknown origins in production
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[CORS Blocked] Request origin not permitted: ${cleanOrigin}`);
      return callback(new Error('CORS request blocked by origin policy.'), false);
    }

    // Default development fallback
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parser with safe limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General API rate limiting (300 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api/', apiLimiter);

// Stricter rate limiter for sensitive authentication endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  }
});

// Stricter rate limiter for document parsing/uploads (prevent memory exhaustion)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // 60 uploads per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload rate limit reached. Please wait a few minutes before analyzing more resumes.'
  }
});

// Health check handler (mount at both /api/health and /health for Render)
const healthCheckHandler = (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    status: 'healthy',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'Resume Checker AI API',
    database: dbState,
    environment: process.env.NODE_ENV || 'development'
  });
};

app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

// Mount routers with rate limits
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth', authRoutes);

app.use('/api/analysis/upload', uploadLimiter);
app.use('/api/analysis', analysisRoutes);

app.use('/api/resumes', resumeRoutes);
app.use('/api/job-matches', jobMatchRoutes);
app.use('/api/career-assistant', careerAssistantRoutes);
app.use('/api/settings', settingsRoutes);

// Central error handler
app.use(errorHandler);

module.exports = app;
