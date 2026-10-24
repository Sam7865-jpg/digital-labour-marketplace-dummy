import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Middleware to guarantee DB Connection before any API route executes
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable missing!");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
    next();
  } catch (err) {
    console.error('DB Connection Error:', err);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
};

app.use('/api', connectDB);

// Base Health Check Route
app.get(['/', '/api'], (req, res) => {
  res.json({ message: "Backend API is running on Vercel!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/workers', skillRoutes);
app.use('/api/worker', skillRoutes);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
}

export default app;
