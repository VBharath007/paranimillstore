const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/product.routes');
const blogRoutes = require('./modules/blogs/blog.routes');
const uploadRoutes = require('./modules/upload/upload.routes');

// Import middlewares
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Enable CORS
app.use(cors());

// Body parser middlewares
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Parani Mill Stores Admin API is running smoothly',
  });
});

// Mount modules API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
