const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Dynamic CORS middleware
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
try {
  app.use('/api/auth', require('../backend/routes/authRoutes'));
  app.use('/api/worker', require('../backend/routes/workerRoutes'));
} catch (err) {
  console.error("Error loading backend routes:", err.message);
}

module.exports = app;
