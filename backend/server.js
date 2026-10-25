const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Dynamic CORS Header Middleware
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

// Lazy-connect DB inside a request wrapper so Vercel doesn't crash on startup
app.use(async (req, res, next) => {
  try {
    const connectDB = require('./config/db');
    await connectDB();
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/worker', require('./routes/workerRoutes'));

app.get('/', (req, res) => {
  res.status(200).send('Digital Labour Marketplace API is running cleanly!');
});

module.exports = app;
