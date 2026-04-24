import 'dotenv/config';
import express, { Request, Response } from 'express';
import { initializeDatabase } from './db/init';
import paymentRoutes from './routes/payments';
import { corsMiddleware, errorHandler } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);

// ===== ROUTES =====

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Học Chung Khối Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use(API_PREFIX, paymentRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

// ===== STARTUP =====
async function start() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📡 API endpoints at http://localhost:${PORT}${API_PREFIX}`);
      console.log(`🔗 Webhook URL: http://localhost:${PORT}${API_PREFIX}/webhooks/sepay`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
