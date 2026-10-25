const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Explicit Global CORS Middleware for Vercel Preflight Requests
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://digital-labour-marketplace-dummy-6z.vercel.app',
    'https://digital-labour-marketplace-dummy-uk.vercel.app'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Database Connection Middleware
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

// Root API Check
app.get('/', (req, res) => {
  res.status(200).json({ status: "Online", message: "Digital Labour Marketplace API active!" });
});

try {
  app.use('/api/auth', require('../backend/routes/authRoutes'));
  app.use('/api/worker', require('../backend/routes/workerRoutes'));
} catch (err) {
  console.error("Error loading routes:", err.message);
}

module.exports = app;
