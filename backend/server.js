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

// Base Health Check Route (handles both / and /api)
app.get(['/', '/api'], (req, res) => {
  res.json({ message: "Backend API is running on Vercel!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/workers', skillRoutes);
app.use('/api/worker', skillRoutes);

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Database connected successfully.'))
    .catch((err) => console.error('DB Connection Error:', err));
}

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
}

export default app;
