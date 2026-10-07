const blogService = require('./blog.service');

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Private (Admin)
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required fields',
      });
    }

    const blog = await blogService.createBlog(req.body);

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
const getBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getBlogs(req.query);

    return res.status(200).json({
      success: true,
      message: 'Blogs retrieved successfully',
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Blog retrieved successfully',
      data: blog,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Update a blog by ID
 * @route   PUT /api/blogs/:id
 * @access  Private (Admin)
 */
const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete a blog by ID
 * @route   DELETE /api/blogs/:id
 * @access  Private (Admin)
 */
const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
