const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

// Security & logging
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/v1', routes);

// 404 & error handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;