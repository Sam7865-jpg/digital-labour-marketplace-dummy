import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from '../backend/routes/authRoutes.js';
import workerRoutes from '../backend/routes/workerRoutes.js';

const app = express();

// Enable Dynamic CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json());

// Database connection middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      console.error("DB Connection Error:", err.message);
    }
  }
  next();
});

// Root API Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: "Online", message: "Digital Labour Marketplace API is active!" });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);

export default app;
