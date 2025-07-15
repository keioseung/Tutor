const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/user');
const learningRoutes = require('./routes/learning');
const communityRoutes = require('./routes/community');
const notificationRoutes = require('./routes/notification');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration (가장 먼저!)
const corsOptions = {
  origin: [
    'https://humble-spoon-5g5wrqwjq6xgf46gw-3000.app.github.dev', // Codespaces 프론트엔드 주소만 허용
    // 필요시 추가 origin 여기에 입력
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
// CORS 미들웨어: 반드시 모든 미들웨어보다 먼저 등록!
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight(OPTIONS) 허용

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: err.message 
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Unauthorized' 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
}); 