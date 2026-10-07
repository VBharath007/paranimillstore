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
 * Create a new product in Firestore
 */
const createProduct = async (productData) => {
  const productsRef = db.collection('products');
  const timestamp = new Date().toISOString();

  const newProduct = {
    name: productData.name ? productData.name.trim() : '',
    slug: productData.slug || generateSlug(productData.name),
    description: productData.description ? productData.description.trim() : '',
    price: Number(productData.price) || 0,
    category: productData.category ? productData.category.trim() : 'agri',
    thumbnail: productData.thumbnail ? productData.thumbnail.trim() : (Array.isArray(productData.images) && productData.images[0] ? productData.images[0] : ''),
    thumbnailUrl: productData.thumbnailUrl ? productData.thumbnailUrl.trim() : '',
    images: Array.isArray(productData.images) 
      ? productData.images 
      : (productData.image ? [productData.image] : []),
    imageUrls: Array.isArray(productData.imageUrls) ? productData.imageUrls : [],
    specs: productData.specs || {},
    stroke: productData.stroke ? String(productData.stroke).trim() : '',
    stock: productData.stock !== undefined ? Number(productData.stock) : 0,
    isActive: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const docRef = await productsRef.add(newProduct);
  return {
    _id: docRef.id,
    id: docRef.id,
    ...newProduct,
  };
};

/**
 * Get all products (with optional filtering by category, search, or active status)
 */
const getProducts = async (query = {}) => {
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();

  let products = [];
  snapshot.forEach((doc) => {
    products.push(formatDoc(doc));
  });

  // Filter in memory for maximum search flexibility
  if (query.category) {
    const targetCat = query.category.toLowerCase().trim();
    products = products.filter(
      (p) => p.category && p.category.toLowerCase() === targetCat
    );
  }

  if (query.isActive !== undefined) {
    const isTargetActive = query.isActive === 'true' || query.isActive === true;
    products = products.filter((p) => Boolean(p.isActive) === isTargetActive);
  }

  if (query.search) {
    const term = query.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
    );
  }

  // Sort by createdAt descending
  products.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return products;
};

/**
 * Get a single product by ID
 */
const getProductById = async (id) => {
  if (!id) {
    const error = new Error('Product ID is required');
    error.statusCode = 400;
    throw error;
  }

  const docRef = db.collection('products').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return formatDoc(doc);
};

/**
 * Update an existing product by ID
 */
const updateProduct = async (id, updateData) => {
  if (!id) {
    const error = new Error('Product ID is required');
    error.statusCode = 400;
    throw error;
  }

  const docRef = db.collection('products').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const cleanUpdate = { ...updateData };
  delete cleanUpdate._id;
  delete cleanUpdate.id;

  if (cleanUpdate.name) {
    cleanUpdate.name = cleanUpdate.name.trim();
    if (!cleanUpdate.slug) {
      cleanUpdate.slug = generateSlug(cleanUpdate.name);
    }
  }

  if (cleanUpdate.price !== undefined) {
    cleanUpdate.price = Number(cleanUpdate.price);
  }

  if (cleanUpdate.stock !== undefined) {
    cleanUpdate.stock = Number(cleanUpdate.stock);
  }

  if (cleanUpdate.thumbnail !== undefined) {
    cleanUpdate.thumbnail = typeof cleanUpdate.thumbnail === 'string' ? cleanUpdate.thumbnail.trim() : '';
  }

  if (cleanUpdate.thumbnailUrl !== undefined) {
    cleanUpdate.thumbnailUrl = typeof cleanUpdate.thumbnailUrl === 'string' ? cleanUpdate.thumbnailUrl.trim() : '';
  }

  if (cleanUpdate.images !== undefined) {
    cleanUpdate.images = Array.isArray(cleanUpdate.images)
      ? cleanUpdate.images
      : (cleanUpdate.images ? [cleanUpdate.images] : []);
  } else if (cleanUpdate.image !== undefined) {
    cleanUpdate.images = cleanUpdate.image ? [cleanUpdate.image] : [];
    delete cleanUpdate.image;
  }

  if (cleanUpdate.imageUrls !== undefined) {
    cleanUpdate.imageUrls = Array.isArray(cleanUpdate.imageUrls) ? cleanUpdate.imageUrls : [];
  }

  if (cleanUpdate.specs !== undefined) {
    cleanUpdate.specs = typeof cleanUpdate.specs === 'object' ? cleanUpdate.specs : {};
  }

  if (cleanUpdate.stroke !== undefined) {
    cleanUpdate.stroke = String(cleanUpdate.stroke).trim();
  }

  cleanUpdate.updatedAt = new Date().toISOString();

  await docRef.update(cleanUpdate);
  const updatedDoc = await docRef.get();
  return formatDoc(updatedDoc);
};

/**
 * Delete a product by ID
 */
const deleteProduct = async (id) => {
  if (!id) {
    const error = new Error('Product ID is required');
    error.statusCode = 400;
    throw error;
  }

  const docRef = db.collection('products').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const existingData = formatDoc(doc);
  await docRef.delete();
  return existingData;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
