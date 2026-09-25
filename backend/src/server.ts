import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { registerRoutes } from './routes.loader.js';
import { initWebSocket } from './core/websocket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting — general API (200 req/min per IP)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' } },
});
app.use('/api', generalLimiter);

// Rate limiting — auth endpoints (10 attempts per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Try again in 15 minutes.' } },
});
app.use('/api/v1/auth/login', authLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NextHR Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Register feature routes
registerRoutes(app);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ServerError]', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.',
    },
  });
});

// Create HTTP server & attach WebSocket engine
const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 NextHR Backend API running on http://localhost:${PORT}`);
  console.log(`⚡ NextHR WebSocket running on ws://localhost:${PORT}/ws`);
});
