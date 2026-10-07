import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar, 
  User, 
  Eye, 
  BookOpen,
  X,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { blogsAPI, uploadAPI } from '../../services/api';
import AlertToast from '../../components/AlertToast';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, blog: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Agriculture',
    excerpt: '',
    content: '',
    author: 'Admin',
    isPublished: true,
    coverImage: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Cloudinary image upload handler for blog cover
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlert({
        type: 'error',
        message: 'Please choose a valid image file (JPG, PNG, WEBP).',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadFile(file, 'parani_mill_stores/blogs');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          coverImage: res.data.url,
        }));
        setAlert({
          type: 'success',
          message: 'Cover image uploaded successfully!',
        });
      }
    } catch (err) {
      console.error('Blog cover upload failed:', err);
      setAlert({
        type: 'error',
        message: err.message || 'Image upload failed. Check connection.',
      });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Remove cover image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: '',
    }));
    setAlert({
      type: 'info',
      message: 'Cover image removed from article draft.',
    });
  };

  // Fetch blogs from backend
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        setBlogs(res.data);
      }
    } catch (err) {
      console.warn('Backend fetch blogs failed:', err.message);
      setBlogs([]);
      setAlert({
        type: 'error',
        message: 'Failed to fetch blogs from database.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedBlog(null);
    setFormData({
      title: '',
      category: 'Agriculture',
      excerpt: '',
      content: '',
      author: 'Admin',
      isPublished: true,
      coverImage: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (blog) => {
    setModalMode('edit');
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || '',
      category: blog.category || 'Agriculture',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || 'Admin',
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
      coverImage: blog.coverImage || '',
    });
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (blog) => {
    setModalMode('view');
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  // Form submit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || 'Admin',
        isPublished: formData.isPublished,
        coverImage: formData.coverImage || '',
      };

      if (modalMode === 'create') {
        const res = await blogsAPI.create(payload);
        if (res.success) {
          setAlert({
            type: 'success',
            message: `Article "${res.data.title}" published successfully!`,
          });
          setIsModalOpen(false);
          fetchBlogs();
        }
      } else if (modalMode === 'edit') {
        if (selectedBlog._id) {
          const res = await blogsAPI.update(selectedBlog._id, payload);
          if (res.success) {
            setAlert({
              type: 'success',
              message: `Article "${res.data.title}" updated successfully!`,
            });
            setIsModalOpen(false);
            fetchBlogs();
          }
        } else {
          setBlogs((prev) =>
            prev.map((b) => (b.title === selectedBlog.title ? { ...b, ...payload } : b))
          );
          setAlert({
            type: 'success',
            message: `Article "${payload.title}" updated!`,
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

  // Delete
  const handleDeleteClick = (blog) => {
    setDeleteDialog({ open: true, blog });
  };

  const confirmDelete = async () => {
    const blog = deleteDialog.blog;
    if (!blog) return;

    setIsSubmitting(true);
    try {
      if (blog._id) {
        await blogsAPI.delete(blog._id);
        setAlert({
          type: 'success',
          message: `Article "${blog.title}" deleted successfully!`,
        });
        fetchBlogs();
      } else {
        setBlogs((prev) => prev.filter((b) => b.title !== blog.title));
        setAlert({
          type: 'success',
          message: `Article "${blog.title}" deleted!`,
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Delete operation failed.',
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialog({ open: false, blog: null });
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    (b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.category && b.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Alert Toast Notification */}
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-deep)' }}>
            Equipment Guides & Blogs
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Publish guides, technical reviews, and farming tips
          </p>
        </div>

        <div className="page-actions-group">
          <button 
            className="outline-pill-btn" 
            onClick={fetchBlogs} 
            title="Refresh blogs"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spinning-icon' : ''} />
            <span>Refresh</span>
          </button>

          <button className="primary-red-btn" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="search-box-wrap" style={{ maxWidth: '340px' }}>
        <Search size={16} className="search-box-icon" />
        <input 
          type="text" 
          placeholder="Search articles by title or tag..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box-input"
          style={{ width: '100%' }}
        />
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader2 size={36} className="spinning-icon" style={{ color: 'var(--green-primary)', margin: '0 auto' }} />
          <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {filteredBlogs.map((blog, index) => {
            const isPub = blog.isPublished !== false;
            return (
              <article key={blog._id || index} className="blog-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {blog.coverImage && (
                  <div 
                    style={{ 
                      width: 'calc(100% + 3rem)', 
                      height: '160px', 
                      overflow: 'hidden', 
                      margin: '-1.5rem -1.5rem 1rem -1.5rem',
                      cursor: 'pointer',
                      background: '#f1f5f9'
                    }}
                    onClick={() => handleOpenView(blog)}
                  >
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div className="blog-card-header">
                  <span className="blog-category-badge">{blog.category || 'Article'}</span>
                  <span className={`status-badge status-${isPub ? 'published' : 'draft'}`}>
                    {isPub ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 
                  className="blog-card-title" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenView(blog)}
                >
                  {blog.title}
                </h3>
                
                <p className="blog-card-excerpt">
                  {blog.excerpt || (blog.content ? blog.content.substring(0, 110) + '...' : '')}
                </p>

                <div className="blog-card-meta">
                  <div className="meta-item">
                    <User size={14} />
                    <span>{blog.author || 'Admin'}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="meta-item">
                    <Eye size={14} />
                    <span>{blog.views || 100}+</span>
                  </div>
                </div>

                <div className="blog-card-footer" style={{ justifyContent: 'space-between' }}>
                  <button 
                    className="text-action-btn" 
                    style={{ color: 'var(--green-primary)' }}
                    onClick={() => handleOpenView(blog)}
                  >
                    <BookOpen size={14} />
                    <span>Read</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="text-action-btn edit" 
                      onClick={() => handleOpenEdit(blog)}
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="text-action-btn delete" 
                      onClick={() => handleDeleteClick(blog)}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredBlogs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <BookOpen size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 style={{ color: '#0f172a', fontSize: '1.2rem', marginBottom: '0.25rem' }}>No articles found</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {searchTerm ? `No results match "${searchTerm}".` : 'You haven\'t published any articles yet. Click "Write New Article" to get started!'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT / VIEW BLOG MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={22} color="var(--green-primary)" />
                <h3>
                  {modalMode === 'create' && 'Write New Article'}
                  {modalMode === 'edit' && 'Edit Article'}
                  {modalMode === 'view' && 'Article Preview'}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {modalMode === 'view' && selectedBlog ? (
              <div className="modal-view-body">
                {selectedBlog.coverImage && (
                  <div style={{ width: '100%', height: '220px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem', background: '#f1f5f9' }}>
                    <img 
                      src={selectedBlog.coverImage} 
                      alt={selectedBlog.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <span className="blog-category-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  {selectedBlog.category || 'Guide'}
                </span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--green-deep)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {selectedBlog.title}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                  <span>By {selectedBlog.author || 'Admin'}</span>
                  <span>•</span>
                  <span>{new Date(selectedBlog.createdAt || Date.now()).toLocaleDateString('en-GB')}</span>
                </div>

                <div style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-body)', background: '#f8faf9', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontWeight: 600, color: 'var(--green-deep)', marginBottom: '0.75rem' }}>
                    {selectedBlog.excerpt}
                  </p>
                  <p>{selectedBlog.content}</p>
                </div>

                <div className="modal-footer" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button className="outline-pill-btn" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="modal-form">
                <div className="form-group">
                  <label>Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Guide to Power Tillers and Crop Sprayers"
                    className="modal-input"
                  />
                </div>

                {/* Cloudinary Cover Image Uploader */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ margin: 0, fontWeight: 600 }}>Cover Image</label>
                    {formData.coverImage && (
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} /> Uploaded
                      </span>
                    )}
                  </div>

                  {formData.coverImage ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px'
                    }}>
                      <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                        <img 
                          src={formData.coverImage} 
                          alt="Cover preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#1e293b', fontWeight: 700 }}>
                          Image Preview
                        </p>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {formData.coverImage}
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
                            onChange={handleImageUpload} 
                            style={{ display: 'none' }} 
                            disabled={uploadingImage}
                          />
                        </label>
                        <button 
                          type="button" 
                          className="outline-pill-btn" 
                          style={{ borderColor: '#fca5a5', color: '#dc2626', padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          onClick={handleRemoveImage}
                          disabled={uploadingImage}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.25rem 1rem',
                      border: '2px dashed #94a3b8',
                      borderRadius: '10px',
                      cursor: uploadingImage ? 'not-allowed' : 'pointer',
                      background: '#f8fafc',
                      transition: 'all 0.2s',
                    }}>
                      {uploadingImage ? (
                        <>
                          <Loader2 size={24} className="spinning-icon" style={{ color: 'var(--green-primary)' }} />
                          <span style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                            Uploading cover image...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} style={{ color: 'var(--green-primary)', marginBottom: '0.35rem' }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                            Click to Upload Cover Image
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                            Supports JPG, PNG, WEBP
                          </span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                        disabled={uploadingImage}
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
                      <option value="Power Generators">Power Generators</option>
                      <option value="Pumps & Motors">Pumps & Motors</option>
                      <option value="Equipment Guide">Equipment Guide</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Admin"
                      className="modal-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Short Excerpt / Summary</label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the article..."
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label>Full Content *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article content here..."
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <span style={{ fontSize: '0.85rem' }}>Publish Immediately (Visible to public)</span>
                  </label>
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
                      <span>{modalMode === 'create' ? 'Publish Article' : 'Update Article'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL / ALERT */}
      {deleteDialog.open && (
        <div className="modal-overlay" onClick={() => setDeleteDialog({ open: false, blog: null })}>
          <div className="modal-card confirmation-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <AlertTriangle size={32} color="#dc2626" />
            </div>
            <h3>Delete Article?</h3>
            <p>
              Are you sure you want to delete <strong>"{deleteDialog.blog?.title}"</strong>? This action cannot be undone.
            </p>

            <div className="confirm-buttons-group">
              <button 
                className="outline-pill-btn" 
                onClick={() => setDeleteDialog({ open: false, blog: null })}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button 
                className="primary-red-btn" 
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
