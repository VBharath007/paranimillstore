import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  AlertTriangle,
  HelpCircle,
  Loader2,
  RefreshCw,
  Package,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Star,
  Images,
  PlusCircle,
  Minus
} from 'lucide-react';
import { productsAPI, uploadAPI } from '../../services/api';
import AlertToast from '../../components/AlertToast';

// Import Categorized Product Images
import knapsackSprayer from '../../assets/products/sprayers/knapsack-sprayer.png';
import portableBatterySprayer from '../../assets/products/sprayers/portable-battery-sprayer.png';
import powerWeeder700g from '../../assets/products/weeders/power-weeder-700g.png';
import miniTiller3800g from '../../assets/products/weeders/mini-tiller-3800g.png';
import brushCutter4s from '../../assets/products/brush-cutters/brush-cutter-4s.png';
import trolleyBrushCutter from '../../assets/products/brush-cutters/trolley-brush-cutter.png';
import petrolWaterPump from '../../assets/products/pumps/petrol-water-pump-wa30.png';
import waterPump30r from '../../assets/products/pumps/water-pump-30r.png';
import dieselGenerator from '../../assets/products/machinery/diesel-generator.jpg';
import woodChipper from '../../assets/products/machinery/wood-chipper-192g.png';
import earthAuger from '../../assets/products/machinery/earth-auger-6310.png';
import chaffCutter from '../../assets/products/machinery/chaff-cutter-9zp.png';

// Fallback images map for default catalog items
const defaultImagesMap = {
  'Diesel Generator 10 KVA': dieselGenerator,
  'Centrifugal Water Pump WA30': petrolWaterPump,
  'High-Performance Crop Sprayer': knapsackSprayer,
  'Heavy Duty Brush Cutter': brushCutter4s,
  'Industrial Earth Auger 63CC': earthAuger,
  'High Discharge Water Pump 30R': waterPump30r,
  'Power Weeder & Tiller Machine': powerWeeder700g,
  'Portable Battery Sprayer': portableBatterySprayer,
  'Heavy Wood Chipper Machine': woodChipper,
  'Commercial Chaff Cutter Machine': chaffCutter,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Alert Toast State
  const [alert, setAlert] = useState(null);

  // Modal States (Add / Edit / View)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewActiveImage, setViewActiveImage] = useState('');

  // Confirmation Popups: Edit & Delete
  const [editConfirmDialog, setEditConfirmDialog] = useState({ open: false, product: null });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, product: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Agricultural Products',
    price: '',
    stock: '',
    description: '',
    isActive: true,
    thumbnail: '',
    images: [],
  });

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Single Thumbnail Upload handler
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlert({
        type: 'error',
        message: 'Please choose a valid image file (JPG, PNG, WEBP).',
      });
      return;
    }

    setUploadingThumbnail(true);
    try {
      const res = await uploadAPI.uploadFile(file, 'parani_mill_stores/thumbnails');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: res.data.url,
        }));
        setAlert({
          type: 'success',
          message: 'Product thumbnail uploaded successfully!',
        });
      }
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      setAlert({
        type: 'error',
        message: err.message || 'Thumbnail upload failed. Check connection.',
      });
    } finally {
      setUploadingThumbnail(false);
      e.target.value = '';
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: '',
    }));
    setAlert({
      type: 'info',
      message: 'Product thumbnail removed.',
    });
  };

  // Multiple Gallery Images Upload handler
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (!validFiles.length) {
      setAlert({
        type: 'error',
        message: 'Please choose valid image files (JPG, PNG, WEBP).',
      });
      return;
    }

    setUploadingGallery(true);
    try {
      const res = await uploadAPI.uploadMultipleFiles(validFiles, 'parani_mill_stores/products');
      if (res.success && Array.isArray(res.data)) {
        const uploadedUrls = res.data.map((item) => item.url).filter(Boolean);
        setFormData((prev) => {
          const currentImages = prev.images || [];
          const combined = [...currentImages];
          uploadedUrls.forEach((url) => {
            if (!combined.includes(url)) combined.push(url);
          });
          return {
            ...prev,
            images: combined,
            // If user hasn't set a thumbnail yet, use the first image as thumbnail
            thumbnail: prev.thumbnail || combined[0] || '',
          };
        });
        setAlert({
          type: 'success',
          message: `${uploadedUrls.length} image(s) added to gallery!`,
        });
      }
    } catch (err) {
      console.error('Gallery images upload failed:', err);
      setAlert({
        type: 'error',
        message: err.message || 'Gallery upload failed. Check connection.',
      });
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Remove single image from gallery
  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => {
      const targetUrl = prev.images?.[indexToRemove];
      const filtered = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      let updatedThumbnail = prev.thumbnail;
      if (prev.thumbnail === targetUrl) {
        updatedThumbnail = filtered[0] || '';
      }
      return {
        ...prev,
        images: filtered,
        thumbnail: updatedThumbnail,
      };
    });
    setAlert({
      type: 'info',
      message: 'Gallery image removed.',
    });
  };

  // Set any gallery image as the primary thumbnail
  const handleSetAsThumbnail = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: imageUrl,
    }));
    setAlert({
      type: 'success',
      message: 'Selected image set as primary thumbnail!',
    });
  };

  // Fetch Products from Backend
  const fetchProducts = useCallback(async (showSuccessAlert = false) => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
        if (showSuccessAlert) {
          setAlert({
            type: 'success',
            message: `Refreshed successfully! Loaded ${res.data.length} products.`,
          });
        }
      }
    } catch (err) {
      console.warn('Backend fetch failed:', err.message);
      setAlert({
        type: 'error',
        message: `Failed to load products: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Prevent mouse wheel scrolling from accidentally changing number input values
  useEffect(() => {
    const preventNumberScroll = () => {
      if (document.activeElement && document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    };
    window.addEventListener('wheel', preventNumberScroll, { passive: true });
    return () => window.removeEventListener('wheel', preventNumberScroll);
  }, []);

  // Increase / Decrease Stepper handlers for Price and Stock
  const handlePriceStep = (delta) => {
    setFormData((prev) => {
      const current = Number(prev.price) || 0;
      return {
        ...prev,
        price: Math.max(0, current + delta),
      };
    });
  };

  const handleStockStep = (delta) => {
    setFormData((prev) => {
      const current = Number(prev.stock) || 0;
      return {
        ...prev,
        stock: Math.max(0, current + delta),
      };
    });
  };

  // 1. ADD PRODUCT FLOW
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setViewActiveImage('');
    setFormData({
      name: '',
      category: 'Agricultural Products',
      price: '',
      stock: '15',
      description: '',
      isActive: true,
      thumbnail: '',
      images: [],
    });
    setIsModalOpen(true);
  };

  // 2. EDIT PRODUCT FLOW (Step 1: Click  -> Ask Confirmation Popup)
  const handleEditClick = (product) => {
    setEditConfirmDialog({ open: true, product });
  };

  // Step 2: Confirm Edit -> Opens Edit Modal
  const proceedToEditModal = () => {
    const product = editConfirmDialog.product;
    setEditConfirmDialog({ open: false, product: null });
    if (!product) return;

    const existingThumbnail = product.thumbnail || (Array.isArray(product.images) && product.images[0]) || '';
    const existingImages = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);

    setModalMode('edit');
    setSelectedProduct(product);
    setViewActiveImage(existingThumbnail);
    setFormData({
      name: product.name || '',
      category: product.category || 'Agricultural Products',
      price: product.price !== undefined ? product.price : '',
      stock: product.stock !== undefined ? product.stock : '',
      description: product.description || '',
      isActive: product.isActive !== undefined ? product.isActive : true,
      thumbnail: existingThumbnail,
      images: existingImages,
    });
    setIsModalOpen(true);

    setAlert({
      type: 'info',
      message: `Editing product: "${product.name}"`,
    });
  };

  // 3. DELETE PRODUCT FLOW (Step 1: Click  -> Ask Confirmation Popup)
  const handleDeleteClick = (product) => {
    setDeleteConfirmDialog({ open: true, product });
  };

  // Step 2: Confirm Delete -> Executes DELETE API and shows Success Alert
  const confirmDelete = async () => {
    const product = deleteConfirmDialog.product;
    if (!product) return;

    setIsSubmitting(true);
    try {
      if (product._id) {
        await productsAPI.delete(product._id);
        setAlert({
          type: 'success',
          message: `Product "${product.name}" deleted successfully!`,
        });
        fetchProducts();
      } else {
        setProducts((prev) => prev.filter((p) => p.name !== product.name));
        setAlert({
          type: 'success',
          message: `Product "${product.name}" deleted!`,
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Delete operation failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmDialog({ open: false, product: null });
    }
  };

  // 4. VIEW PRODUCT DETAILS
  const handleOpenView = (product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setViewActiveImage(getProductImage(product));
    setIsModalOpen(true);
  };

  // 5. FORM SUBMISSION (Create or Update with Live Alerts)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const chosenThumbnail = formData.thumbnail || (formData.images && formData.images[0]) || '';
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        isActive: formData.isActive,
        thumbnail: chosenThumbnail,
        images: formData.images || [],
      };

      if (modalMode === 'create') {
        const res = await productsAPI.create(payload);
        if (res.success) {
          setAlert({
            type: 'success',
            message: `Product "${res.data.name}" added successfully!`,
          });
          setIsModalOpen(false);
          fetchProducts();
        }
      } else if (modalMode === 'edit') {
        if (selectedProduct._id) {
          const res = await productsAPI.update(selectedProduct._id, payload);
          if (res.success) {
            setAlert({
              type: 'success',
              message: `Product "${res.data.name}" updated successfully!`,
            });
            setIsModalOpen(false);
            fetchProducts();
          }
        } else {
          setProducts((prev) =>
            prev.map((p) => (p.name === selectedProduct.name ? { ...p, ...payload } : p))
          );
          setAlert({
            type: 'success',
            message: `Product "${payload.name}" updated successfully!`,
          });
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Operation failed. Check backend connection.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Pagination Calculations
  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + entriesPerPage);

  const getProductImage = (product) => {
    if (product?.thumbnail) {
      return product.thumbnail;
    }
    if (product?.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    return defaultImagesMap[product?.name] || knapsackSprayer;
  };

  const getStatus = (product) => {
    if (product.stock === 0 || product.isActive === false) return 'Out Of Stock';
    if (product.stock <= 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="page-container">
      {/* Alert Toast Notification (Slide-in) */}
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-deep)' }}>
            Products & Equipment Catalog
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Certified Parani Mill Stores equipment
          </p>
        </div>

        <div className="page-actions-group">
          <button 
            className="outline-pill-btn" 
            onClick={() => fetchProducts(true)} 
            title="Refresh products"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spinning-icon' : ''} />
            <span>Sync Data</span>
          </button>

          <button className="primary-red-btn" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Show Entries + Search */}
      <div className="table-controls-bar">
        <div className="entries-dropdown-wrap">
          <span>Show</span>
          <select 
            value={entriesPerPage} 
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="entries-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>

        <div className="search-box-wrap">
          <Search size={16} className="search-box-icon" />
          <input
            type="text"
            placeholder="Search by name, spec, category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-box-input"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="content-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No</th>
                <th style={{ width: '80px' }}>Image</th>
                <th>Product Details</th>
                <th>Category</th>
                <th>Units</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={32} className="spinning-icon" style={{ color: 'var(--green-primary)', margin: '0 auto' }} />
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading...</p>
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p, index) => {
                  const status = getStatus(p);
                  return (
                    <tr key={p._id || p.name || index}>
                      <td className="index-cell">{startIndex + index + 1}</td>
                      
                      {/* Product Thumbnail */}
                      <td>
                        <div className="product-thumbnail-box" style={{ position: 'relative' }}>
                          <img 
                            src={getProductImage(p)} 
                            alt={p.name} 
                            className="product-thumbnail-img" 
                            loading="lazy"
                          />
                          {p.images && p.images.length > 1 && (
                            <span 
                              className="product-photo-count-pill" 
                              title={`${p.images.length} photos available`}
                            >
                              <Images size={10} />
                              {p.images.length}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Details: Name + Spec */}
                      <td>
                        <div className="product-details-cell">
                          <span className="product-title">{p.name}</span>
                          <span className="product-spec">{p.description || p.spec || 'Certified Equipment'}</span>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td>
                        <span className="category-tag">{p.category}</span>
                      </td>

                      {/* Units */}
                      <td className="units-cell">{p.stock !== undefined ? `${p.stock} Units` : '0 Units'}</td>

                      {/* Store Price */}
                      <td className="text-price-red">₹ {Number(p.price || 0).toLocaleString('en-IN')}</td>

                      {/* Status Badge (Single Line) */}
                      <td className="status-cell">
                        <span className={`status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {status}
                        </span>
                      </td>

                      {/* Actions: View, Edit, Delete */}
                      <td>
                        <div className="action-buttons-group action-center">
                          <button 
                            className="icon-action-btn view" 
                            title="View Product"
                            onClick={() => handleOpenView(p)}
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            className="icon-action-btn edit" 
                            title="Edit Product"
                            onClick={() => handleEditClick(p)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            className="icon-action-btn delete" 
                            title="Delete Product"
                            onClick={() => handleDeleteClick(p)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && displayedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No products found matching "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="table-pagination-footer">
          <span className="pagination-info">
            Showing {filteredProducts.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredProducts.length)} of {filteredProducts.length} entries
          </span>

          <div className="pagination-nav">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`pagination-btn page-num ${currentPage === num ? 'active' : ''}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}

            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL 1: CONFIRM EDIT */}
      {editConfirmDialog.open && (
        <div className="modal-overlay" onClick={() => setEditConfirmDialog({ open: false, product: null })}>
          <div className="modal-card confirmation-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
              <HelpCircle size={32} color="#2563eb" />
            </div>
            <h3>Edit Product?</h3>
            <p>
              Do you want to edit <strong>"{editConfirmDialog.product?.name}"</strong>? Click proceed to modify pricing, stock, or specifications.
            </p>

            <div className="confirm-buttons-group">
              <button 
                className="outline-pill-btn" 
                onClick={() => setEditConfirmDialog({ open: false, product: null })}
              >
                Cancel
              </button>

              <button 
                className="primary-red-btn" 
                style={{ backgroundColor: '#2563eb' }}
                onClick={proceedToEditModal}
              >
                Yes, Proceed to Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL 2: CONFIRM DELETE */}
      {deleteConfirmDialog.open && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmDialog({ open: false, product: null })}>
          <div className="modal-card confirmation-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <AlertTriangle size={32} color="#dc2626" />
            </div>
            <h3>Delete Product?</h3>
            <p>
              Are you sure you want to permanently delete <strong>"{deleteConfirmDialog.product?.name}"</strong>? This action cannot be undone.
            </p>

            <div className="confirm-buttons-group">
              <button 
                className="outline-pill-btn" 
                onClick={() => setDeleteConfirmDialog({ open: false, product: null })}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button 
                className="primary-red-btn" 
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT / VIEW PRODUCT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Package size={22} color="var(--green-primary)" />
                <h3>
                  {modalMode === 'create' && 'Add New Product'}
                  {modalMode === 'edit' && `Edit Product: ${selectedProduct?.name}`}
                  {modalMode === 'view' && 'Product Specifications & Details'}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* View Mode */}
            {modalMode === 'view' && selectedProduct ? (
              <div className="modal-view-body">
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div className="thumbnail-preview-img-box" style={{ width: '88px', height: '88px', borderRadius: '10px' }}>
                    <img 
                      src={viewActiveImage || getProductImage(selectedProduct)} 
                      alt={selectedProduct.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', color: 'var(--green-deep)', fontWeight: 800, margin: 0 }}>
                      {selectedProduct.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="category-tag">{selectedProduct.category}</span>
                      {selectedProduct.thumbnail && (
                        <span className="badge-tag-primary" style={{ fontSize: '0.7rem' }}>
                          <Star size={11} /> Primary Thumbnail Set
                        </span>
                      )}
                      {selectedProduct.images && selectedProduct.images.length > 0 && (
                        <span className="badge-tag-count" style={{ fontSize: '0.7rem' }}>
                          <Images size={11} /> {selectedProduct.images.length} Gallery Photos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Gallery Strip */}
                {((selectedProduct.images && selectedProduct.images.length > 0) || selectedProduct.thumbnail) && (
                  <div style={{ marginBottom: '1.2rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span className="label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 700 }}>
                      All Product Photos (Click any photo to preview larger):
                    </span>
                    <div className="view-gallery-strip">
                      {selectedProduct.thumbnail && (
                        <div 
                          className={`view-gallery-strip-item ${viewActiveImage === selectedProduct.thumbnail ? 'active' : ''}`}
                          onClick={() => setViewActiveImage(selectedProduct.thumbnail)}
                          title="Primary Thumbnail"
                        >
                          <img src={selectedProduct.thumbnail} alt="Primary Thumbnail" />
                        </div>
                      )}
                      {selectedProduct.images && selectedProduct.images.map((imgUrl, i) => {
                        if (imgUrl === selectedProduct.thumbnail) return null;
                        return (
                          <div 
                            key={i} 
                            className={`view-gallery-strip-item ${viewActiveImage === imgUrl ? 'active' : ''}`}
                            onClick={() => setViewActiveImage(imgUrl)}
                            title={`Gallery Photo ${i + 1}`}
                          >
                            <img src={imgUrl} alt={`Photo ${i + 1}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="view-details-grid">
                  <div className="view-detail-item">
                    <span className="label">Store Price</span>
                    <span className="value text-price-red">₹ {Number(selectedProduct.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="view-detail-item">
                    <span className="label">Stock Level</span>
                    <span className="value">{selectedProduct.stock} Units</span>
                  </div>
                  <div className="view-detail-item">
                    <span className="label">Status</span>
                    <span className={`status-badge status-${getStatus(selectedProduct).toLowerCase().replace(/\s+/g, '-')}`}>
                      {getStatus(selectedProduct)}
                    </span>
                  </div>
                  <div className="view-detail-item">
                    <span className="label">Product ID (Firestore)</span>
                    <span className="value" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>{selectedProduct._id || 'Stored in DB'}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <span className="label" style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Specifications & Description</span>
                  <p style={{ fontSize: '0.88rem', background: '#f8faf9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155' }}>
                    {selectedProduct.description || 'No extra description.'}
                  </p>
                </div>

                <div className="modal-footer" style={{ marginTop: '1.5rem', justifyContent: 'flex-end', padding: '1rem 0 0 0' }}>
                  <button className="outline-pill-btn" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Create or Edit Mode Form */
              <form onSubmit={handleSubmitForm} className="modal-form">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Heavy Duty Brush Cutter 35CC"
                    className="modal-input"
                  />
                </div>

                {/* 1. SEPARATE THUMBNAIL UPLOAD SECTION */}
                <div className="image-section-container">
                  <div className="image-section-header">
                    <div>
                      <div className="image-section-title-wrap">
                        <Star size={16} color="#059669" />
                        <h4 className="image-section-title">Product Thumbnail (Cover Image)</h4>
                        {formData.thumbnail && (
                          <span className="badge-tag-primary">
                            <CheckCircle2 size={12} /> Thumbnail Set
                          </span>
                        )}
                      </div>
                      <p className="image-section-subtitle">
                        Upload 1 image to be used as the primary thumbnail across catalog lists and cards.
                      </p>
                    </div>
                  </div>

                  {formData.thumbnail ? (
                    <div className="thumbnail-preview-card">
                      <div className="thumbnail-preview-img-box">
                        <img 
                          src={formData.thumbnail} 
                          alt="Thumbnail preview" 
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="badge-tag-primary" style={{ padding: '0.15rem 0.45rem' }}>
                            <Star size={11} /> Primary Thumbnail
                          </span>
                        </div>
                        <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.72rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {formData.thumbnail}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <label 
                          className="outline-pill-btn" 
                          style={{ cursor: 'pointer', padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          <Edit2 size={13} />
                          <span>Change</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleThumbnailUpload} 
                            style={{ display: 'none' }} 
                            disabled={uploadingThumbnail}
                          />
                        </label>
                        <button 
                          type="button" 
                          className="outline-pill-btn" 
                          style={{ borderColor: '#fca5a5', color: '#dc2626', padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          onClick={handleRemoveThumbnail}
                          disabled={uploadingThumbnail}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="image-dropzone-box" style={{ cursor: uploadingThumbnail ? 'not-allowed' : 'pointer' }}>
                      {uploadingThumbnail ? (
                        <>
                          <Loader2 size={24} className="spinning-icon" style={{ color: 'var(--green-primary)' }} />
                          <span style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                            Uploading thumbnail...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} style={{ color: 'var(--green-primary)', marginBottom: '0.35rem' }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                            Click to Upload Thumbnail Image (1 File)
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                            Supported formats: JPG, PNG, WEBP, SVG
                          </span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleThumbnailUpload} 
                        style={{ display: 'none' }} 
                        disabled={uploadingThumbnail}
                      />
                    </label>
                  )}
                </div>

                {/* 2. MULTIPLE GALLERY IMAGES SECTION */}
                <div className="image-section-container">
                  <div className="image-section-header">
                    <div>
                      <div className="image-section-title-wrap">
                        <Images size={16} color="var(--green-primary)" />
                        <h4 className="image-section-title">Product Gallery / Additional Images</h4>
                        <span className="badge-tag-count">
                          {formData.images?.length || 0} {formData.images?.length === 1 ? 'image' : 'images'}
                        </span>
                      </div>
                      <p className="image-section-subtitle">
                        Add as many images as you like for multiple angles and product details.
                      </p>
                    </div>

                    <label 
                      className="outline-pill-btn" 
                      style={{ cursor: uploadingGallery ? 'not-allowed' : 'pointer', fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                    >
                      <PlusCircle size={14} color="var(--green-primary)" />
                      <span>{uploadingGallery ? 'Uploading...' : 'Add Images'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleGalleryUpload} 
                        style={{ display: 'none' }} 
                        disabled={uploadingGallery}
                      />
                    </label>
                  </div>

                  {uploadingGallery && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#ecfdf5', borderRadius: '8px', color: '#059669', fontSize: '0.82rem', fontWeight: 600 }}>
                      <Loader2 size={16} className="spinning-icon" />
                      <span>Uploading selected images to gallery...</span>
                    </div>
                  )}

                  {formData.images && formData.images.length > 0 ? (
                    <div className="gallery-grid">
                      {formData.images.map((imgUrl, idx) => {
                        const isThisThumbnail = formData.thumbnail === imgUrl;
                        return (
                          <div key={idx} className={`gallery-card ${isThisThumbnail ? 'is-thumbnail' : ''}`}>
                            <div className="gallery-card-thumb-wrap">
                              <span className="gallery-card-index">#{idx + 1}</span>
                              {isThisThumbnail && (
                                <span className="gallery-card-thumb-badge">
                                  <Star size={10} /> Thumbnail
                                </span>
                              )}
                              <img src={imgUrl} alt={`Product ${idx + 1}`} loading="lazy" />
                            </div>

                            <div className="gallery-card-actions">
                              {!isThisThumbnail ? (
                                <button
                                  type="button"
                                  className="gallery-action-btn set-thumb"
                                  onClick={() => handleSetAsThumbnail(imgUrl)}
                                  title="Use this image as the product thumbnail"
                                >
                                  <Star size={11} />
                                  <span>Use as Thumb</span>
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, padding: '0.2rem 0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <CheckCircle2 size={12} /> Active
                                </span>
                              )}

                              <button
                                type="button"
                                className="gallery-action-btn remove-img"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                title="Remove from gallery"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add more card in grid */}
                      <label className="gallery-add-card" style={{ cursor: uploadingGallery ? 'not-allowed' : 'pointer' }}>
                        <PlusCircle size={26} color="var(--green-primary)" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Add More</span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Multiple files</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleGalleryUpload} 
                          style={{ display: 'none' }} 
                          disabled={uploadingGallery}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="image-dropzone-box" style={{ cursor: uploadingGallery ? 'not-allowed' : 'pointer' }}>
                      <Images size={26} style={{ color: 'var(--green-primary)', marginBottom: '0.35rem' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                        Click to Upload Gallery Images
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                        You can select multiple photos at once (JPG, PNG, WEBP)
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleGalleryUpload} 
                        style={{ display: 'none' }} 
                        disabled={uploadingGallery}
                      />
                    </label>
                  )}
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="modal-input"
                    >
                      <option value="Agricultural Machinery">Agricultural Machinery</option>
                      <option value="Construction Equipment">Construction Equipment</option>
                      <option value="Power Generators">Power Generators</option>
                      <option value="Pumps & Motors">Pumps & Motors</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <div className="number-stepper-control">
                      <button
                        type="button"
                        className="stepper-action-btn stepper-dec"
                        onClick={(e) => handlePriceStep(e.shiftKey ? -100 : -1)}
                        title="Decrease price (-1, or Hold Shift for -100)"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        placeholder="12000"
                        className="modal-input stepper-input"
                      />
                      <button
                        type="button"
                        className="stepper-action-btn stepper-inc"
                        onClick={(e) => handlePriceStep(e.shiftKey ? 100 : 1)}
                        title="Increase price (+1, or Hold Shift for +100)"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label>Stock Quantity (Units) *</label>
                    <div className="number-stepper-control">
                      <button
                        type="button"
                        className="stepper-action-btn stepper-dec"
                        onClick={(e) => handleStockStep(e.shiftKey ? -10 : -1)}
                        title="Decrease stock (-1, or Hold Shift for -10)"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        placeholder="25"
                        className="modal-input stepper-input"
                      />
                      <button
                        type="button"
                        className="stepper-action-btn stepper-inc"
                        onClick={(e) => handleStockStep(e.shiftKey ? 10 : 1)}
                        title="Increase stock (+1, or Hold Shift for +10)"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label>Store Availability</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.35rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active & Available for Sale</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Specifications / Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter engine cc, power, tank capacity or spec details..."
                    className="modal-input"
                  />
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="outline-pill-btn" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button 
                    type="submit" 
                    className="primary-red-btn" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="spinning-icon" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{modalMode === 'create' ? 'Save Product' : 'Update Product'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
