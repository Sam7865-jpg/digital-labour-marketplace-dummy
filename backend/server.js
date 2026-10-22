import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

const app = express();

// CORS configuration (Codespaces ke dynamic URLs aur credentials ke liye)
app.use(cors({
  origin: true, // Kisi bhi dynamic origin/codespace ko allow karega
  credentials: true
}));

app.use(express.json());

// Routes register karein (Frontend requests ke sath match karne ke liye 'workers' use kiya hai)
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/workers', skillRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Database Connect Ho Gaya Hai!');
    app.listen(PORT, () => console.log(`Backend server port ${PORT} par chal raha hai`));
  })
  .catch((err) => console.error('DB Connection Error:', err));