const express = require('express');
const router = express.Router();
const blogController = require('./blog.controller');
const { protect } = require('../../middleware/auth.middleware');

// Public routes
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);

// Admin protected routes
router.post('/', protect, blogController.createBlog);
router.put('/:id', protect, blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);

module.exports = router;
