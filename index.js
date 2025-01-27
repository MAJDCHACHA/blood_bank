import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import os from 'os';
import macaddress from 'node-macaddress';
import db from './config/index.js';
import auth from './routes/authRoute.js';
import personalRoute from './routes/personalRoute.js';
import sessionRoute from './routes/sessionRoute.js';
import morgan from 'morgan';
dotenv.config();
const app=express();
const port=process.env.PORT
// middleware
const corsOptions = {
  origin: 'http://127.0.0.1:5500/', // Allow your frontend origin
  credentials: true,              // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly list allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],   // Allowed headers in requests
};
app.use(cors()); // Use CORS middleware with the defined options

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));
app.use('/uploads', express.static('uploads')); // To serve static files

app.use(helmet());
// Use specific Helmet middlewares
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use(helmet.hsts({ maxAge: 31536000 }));    // Enforce HTTPS
app.use(helmet.xssFilter());                  // Add XSS protection
app.use(morgan('dev'));

// Disable a specific header
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP
app.use('/uploads', express.static('uploads')); // To serve static files

app.use(cookieParser());
app.use(express.json());
// route
app.use('/auth',auth);
app.use('/personal',personalRoute);
app.use('/session',sessionRoute);
app.get('/', async (req, res) => {
  try {
      // Get the hostname of the machine
      const hostname = os.hostname();
      // Get all MAC addresses of the machine
      const macs = await macaddress.all();
      // If no MAC addresses found, return an error
      if (!macs || Object.keys(macs).length === 0) {
          return res.status(500).json({ error: 'No MAC address found' });
      }
      // Send the system information in the response
    return  res.json({
          message: 'System info fetched successfully',
          hostname: hostname,
          macAddresses: macs
      });
  } catch (error) {
     return res.status(500).json({message:err.message});
  }
});

db.sequelize.sync({force:false}).then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  }).catch((err)=>{
    console.log(err);
  });