import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  FileText, 
  ArrowRight,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch live products
    fetch('http://localhost:5001/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      })
      .catch(() => {});

    // Fetch live blogs
    fetch('http://localhost:5001/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    { title: 'Total Equipment & Products', value: products.length || 0, icon: Package, color: '#0a5c36' },
    { title: 'Published Blog Guides', value: blogs.length || 0, icon: FileText, color: '#b91c1c' },
  ];

  // Get top 5 recent items
  const recentProducts = [...products].reverse().slice(0, 5);
  const recentBlogs = [...blogs].reverse().slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card premium-stat-card">
              <div className="stat-card-content" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div className="stat-info">
                  <span className="stat-card-title" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</span>
                  <h3 className="stat-value" style={{ fontSize: '3rem', margin: '0.5rem 0 0 0', color: '#0f172a', fontWeight: '800', lineHeight: '1' }}>{stat.value}</h3>
                </div>
                <div className="stat-icon-badge" style={{ backgroundColor: stat.color, color: '#ffffff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${stat.color}40` }}>
                  <Icon size={26} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Data Tables */}
      <div className="dashboard-grid-two" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Products */}
        <div className="content-card premium-card">
          <div className="content-card-header" style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', margin: 0 }}>Recently Added</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>Latest machinery in catalog</p>
            </div>
            <button className="outline-pill-btn" onClick={() => navigate('/admin/products')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '50px', border: 'none', background: '#0a5c36', color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(10, 92, 54, 0.2)' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive" style={{ overflowX: 'hidden' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Name</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.length > 0 ? recentProducts.map((prod) => (
                  <tr key={prod._id || prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#0f172a' }}>{prod.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>{prod.category || 'General'}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '50px', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: '700' }}>
                        Active
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <Package size={32} strokeWidth={1.5} />
                        </div>
                        <span style={{ color: '#64748b', fontWeight: '500' }}>No products found. Start adding some!</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="content-card premium-card">
          <div className="content-card-header" style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '700', margin: 0 }}>Latest Blogs</h3>
            </div>
            <button className="outline-pill-btn" onClick={() => navigate('/admin/blogs')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '50px', border: 'none', background: '#0a5c36', color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 10px rgba(10, 92, 54, 0.2)' }}>
              <span>Manage</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="recent-list" style={{ padding: '1rem 1.5rem' }}>
            {recentBlogs.length > 0 ? recentBlogs.map((blog, index) => (
              <div key={blog._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: index !== recentBlogs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{blog.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <FileText size={28} strokeWidth={1.5} />
                  </div>
                  <span style={{ color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>No blogs written yet.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

