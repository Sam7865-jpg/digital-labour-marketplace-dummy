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

// Lazy database connection
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
      }
    } catch (err) {
      console.error("MongoDB connection warning:", err.message);
    }
  }
  next();
});

// Root API Health Route
app.get('/', (req, res) => {
  res.status(200).json({ status: "Online", message: "Digital Labour Marketplace API is active and running!" });
});

// Load routes with absolute backend resolution
try {
  app.use('/api/auth', require('../backend/routes/authRoutes'));
  app.use('/api/worker', require('../backend/routes/workerRoutes'));
} catch (err) {
  console.error("Error loading routes:", err.message);
}

module.exports = app;
