import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

const app = express();

// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Base Test Route (Deployment test karne ke liye)
app.get('/api', (req, res) => {
  res.json({ message: "Backend API is running on Vercel!" });
});

// Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/workers', skillRoutes);
app.use('/api/worker', skillRoutes);

// MongoDB Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Database Connect Ho Gaya Hai!'))
    .catch((err) => console.error('DB Connection Error:', err));
}

// Local Development Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server port ${PORT} par chal raha hai`);
});

// VERCEL REQUIREMENT: ES Module Export
export default app;