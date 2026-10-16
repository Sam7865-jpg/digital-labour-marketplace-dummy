import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection Helper (Serverless & Local Friendly)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

// Har request se pehle check karein ke DB connect hai
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Digital Labour Marketplace API is Running Live!');
});

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);

// Local machine ke liye listen karein
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;