const { db } = require('../../config/firebase');

const generateSlug = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const formatDoc = (doc) => {
  const data = doc.data();
  return {
    _id: doc.id,
    id: doc.id,
    ...data,
  };
};

/**
 * Create a new blog post in Firestore
 */
const createBlog = async (blogData) => {
  const blogsRef = db.collection('blogs');
  const timestamp = new Date().toISOString();

  const newBlog = {
    title: blogData.title ? blogData.title.trim() : '',
    slug: blogData.slug || generateSlug(blogData.title),
    content: blogData.content ? blogData.content.trim() : '',
    excerpt: blogData.excerpt ? blogData.excerpt.trim() : '',
    coverImage: blogData.coverImage || blogData.image || '',
    author: blogData.author ? blogData.author.trim() : 'Admin',
    category: blogData.category ? blogData.category.trim() : 'Agriculture',
    isPublished: blogData.isPublished !== undefined ? Boolean(blogData.isPublished) : true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const docRef = await blogsRef.add(newBlog);
  return {
    _id: docRef.id,
    id: docRef.id,
    ...newBlog,
  };
};

/**
 * Get all blogs (with optional filter by isPublished or search)
 */
const getBlogs = async (query = {}) => {
  const blogsRef = db.collection('blogs');
  const snapshot = await blogsRef.get();

  let blogs = [];
  snapshot.forEach((doc) => {
    blogs.push(formatDoc(doc));
  });

  if (query.isPublished !== undefined) {
    const isTargetPublished = query.isPublished === 'true' || query.isPublished === true;
    blogs = blogs.filter((b) => Boolean(b.isPublished) === isTargetPublished);
  }

  if (query.category) {
    const targetCat = query.category.toLowerCase().trim();
    blogs = blogs.filter((b) => b.category && b.category.toLowerCase() === targetCat);
  }

  if (query.search) {
    const term = query.search.toLowerCase().trim();
    blogs = blogs.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(term)) ||
        (b.content && b.content.toLowerCase().includes(term)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(term)) ||
        (b.category && b.category.toLowerCase().includes(term))
    );
  }

  // Sort by createdAt descending
  blogs.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return blogs;
};

/**
 * Get single blog post by ID
 */
const getBlogById = async (id) => {
  if (!id) {
    const error = new Error('Blog ID is required');
    error.statusCode = 400;
    throw error;
  }

  const docRef = db.collection('blogs').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    const error = new Error('Blog post not found');
    error.statusCode = 404;
    throw error;
  }

  return formatDoc(doc);
};

/**
 * Update an existing blog post by ID
 */
const updateBlog = async (id, updateData) => {
  if (!id) {
    const error = new Error('Blog ID is required');
    error.statusCode = 400;
    throw error;
  }

  const docRef = db.collection('blogs').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    const error = new Error('Blog post not found');
    error.statusCode = 404;
    throw error;
  }

  const cleanUpdate = { ...updateData };
  delete cleanUpdate._id;
  delete cleanUpdate.id;

  if (cleanUpdate.title) {
    cleanUpdate.title = cleanUpdate.title.trim();
    if (!cleanUpdate.slug) {
      cleanUpdate.slug = generateSlug(cleanUpdate.title);
    }
  }

  if (cleanUpdate.isPublished !== undefined) {
    cleanUpdate.isPublished = Boolean(cleanUpdate.isPublished);
  }

  if (cleanUpdate.image !== undefined && cleanUpdate.coverImage === undefined) {
    cleanUpdate.coverImage = cleanUpdate.image;
    delete cleanUpdate.image;
  }

  cleanUpdate.updatedAt = new Date().toISOString();

  await docRef.update(cleanUpdate);
  const updatedDoc = await docRef.get();
  return formatDoc(updatedDoc);
};

/**
 * Delete a blog post by ID
 */
const deleteBlog = async (id) => {
  if (!id) {
    const error = new Error('Blog ID is required');
    error.statusCode = 400;
    throw error;
  }

  const docRef = db.collection('blogs').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    const error = new Error('Blog post not found');
    error.statusCode = 404;
    throw error;
  }

  const existingData = formatDoc(doc);
  await docRef.delete();
  return existingData;
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
