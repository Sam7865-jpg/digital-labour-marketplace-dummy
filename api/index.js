const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Handle CORS
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

// Safely invoke MongoDB Connection per request
app.use(async (req, res, next) => {
  try {
    const connectDB = require('../backend/config/db');
    await connectDB();
  } catch (err) {
    console.error("DB Connection Error:", err.message);
  }
  next();
});

// Load Routes using absolute resolution
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/worker', require('../backend/routes/workerRoutes'));

app.get('/', (req, res) => {
  res.status(200).send("Digital Labour Marketplace API is active!");
});

module.exports = app;
