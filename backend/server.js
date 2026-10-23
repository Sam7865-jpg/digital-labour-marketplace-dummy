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

// Routes Registration (Dono singular/plural paths allow kar diye hain)
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/workers', skillRoutes);
app.use('/api/worker', skillRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Database Connect Ho Gaya Hai!');
    app.listen(PORT, () => console.log(`Backend server port ${PORT} par chal raha hai`));
  })
  .catch((err) => console.error('DB Connection Error:', err));