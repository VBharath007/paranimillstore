import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';
import fallbackBlogs from '../blogs.json';
import { API_BASE } from '../config/api';

// Empty export to preserve compatibility if imported elsewhere
export const blogPosts: any[] = [];

// Global in-memory cache to guarantee zero-flash instant rendering
let globalBlogsCache: any[] = (fallbackBlogs as any[]) || [];
let globalPotmCache: any = null;

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>(globalBlogsCache);
  const [isLoading, setIsLoading] = useState<boolean>(globalBlogsCache.length === 0);
  const [hasFetched, setHasFetched] = useState<boolean>(globalBlogsCache.length > 0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productOfTheMonth, setProductOfTheMonth] = useState<any>(globalPotmCache);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBackendBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          globalBlogsCache = data.data;
          setBlogs(data.data);
        } else if (globalBlogsCache.length > 0) {
          setBlogs(globalBlogsCache);
        }
      } catch (err) {
        console.error("Error fetching blogs from backend API:", err);
        if (globalBlogsCache.length > 0) setBlogs(globalBlogsCache);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };
    
    const fetchProductOfTheMonth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products?isActive=true`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          const featured = data.data.find((p: any) => p.isProductOfTheMonth);
          if (featured) {
            globalPotmCache = featured;
            setProductOfTheMonth(featured);
          } else {
            globalPotmCache = null;
            setProductOfTheMonth(null);
          }
        }
      } catch (err) {
        console.error("Error fetching products for Product of the Month:", err);
      }
    };

    fetchBackendBlogs();
    fetchProductOfTheMonth();
  }, []);

  const allBlogs = blogs.map(b => ({
    id: b._id || b.id,
    title: b.title,
    excerpt: b.excerpt || (b.content ? b.content.substring(0, 140) + '...' : ''),
    content: b.content,
    category: b.category || 'General',
    author: b.author || 'Admin',
    date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
    readTime: "4 min read",
    image: b.coverImage || b.image || '/Blogherodummy.webp',
    featured: Boolean(b.isFeatured)
  }));

  const displayBlogs = selectedCategory 
    ? allBlogs.filter(p => p.category === selectedCategory) 
    : allBlogs;

  const featuredPost = selectedCategory ? null : (displayBlogs.find(p => p.featured) || displayBlogs[0]);
  const regularPosts = selectedCategory ? displayBlogs : displayBlogs.filter(p => p.id !== featuredPost?.id);

  const categoryCounts = allBlogs.reduce((acc, post) => {
    const cat = post.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(categoryCounts)
    .sort()
    .map(name => [name, categoryCounts[name]] as [string, number]);

  const getProductImage = (prod: any) => {
    if (!prod) return '/Blogherodummy.webp';
    if (prod.thumbnailUrl && typeof prod.thumbnailUrl === 'string' && prod.thumbnailUrl.startsWith('http')) {
      return prod.thumbnailUrl;
    }
    if (prod.thumbnail && typeof prod.thumbnail === 'string' && prod.thumbnail.startsWith('http')) {
      return prod.thumbnail;
    }
    if (Array.isArray(prod.images)) {
      const httpImg = prod.images.find((img: any) => typeof img === 'string' && img.startsWith('http'));
      if (httpImg) return httpImg;
    }
    const rawFolder = prod.folder || '';
    const cleanFolder = rawFolder
      .replace(/MITSUYAMA\s+2S\s+52CC(?:\s+BRUSH\s+CUTTER)?/gi, 'MITSUYAMA  2S  52CC')
      .replace(/MITSUYAMA\s+4S\s+35CC(?:\s+BRUSH\s+CUTTER)?/gi, 'MITSUYAMA  4S  35CC')
      .replace(/REALLY\s+2S\s+52CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY  2S  52CC')
      .replace(/REALLY\s+4S\s+35\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY  4S  35 CC')
      .replace(/REALLY\s+2S\s+43\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY 2S 43 CC')
      .replace(/REALLY\s+4S\s+50CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY 4S 50CC')
      .replace(/REALLY\s+BACK\s*PACK\s+4S\s+35\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY BACK PACK 4S 35 CC')
      .replace(/REALLY\s+BACKPACK\s+2S\s+52\s*CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY BACKPACK 2S 52 CC')
      .replace(/REALLY\s+TROLLEY\s+2S\s+52CC(?:\s+BRUSH\s+CUTTER)?/gi, 'REALLY TROLLEY 2S 52CC')
      .trim();

    const rawImg = prod.thumbnail || (Array.isArray(prod.images) ? prod.images[0] : '');
    const cleanImg = typeof rawImg === 'string' ? (rawImg.startsWith('/') ? rawImg.slice(1) : rawImg) : '';

    if (cleanFolder && cleanImg) {
      return ('/' + cleanFolder + '/' + cleanImg).replace(/\/+/g, '/');
    }
    if (cleanImg) {
      return cleanImg.startsWith('/') ? cleanImg : ('/' + cleanImg);
    }
    return '/Blogherodummy.webp';
  };

  return (
    <div className="blog-page">
      <Helmet>
        <title>Blogs & Updates | Agricultural Guides & Maintenance | Parani Mill Stores</title>
        <meta name="description" content="Read the latest updates, buying guides, and maintenance tips for your agricultural sprayers, power weeders, petrol brush cutters, and engines from Parani Mill Stores." />
        <link rel="canonical" href="https://paranimill.com/blogs" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blogs & Updates | Parani Mill Stores" />
        <meta property="og:description" content="Read the latest updates, buying guides, and maintenance tips for agricultural machinery and engines." />
        <meta property="og:url" content="https://paranimill.com/blogs" />
        <meta property="og:image" content="https://paranimill.com/Blogherodummy.webp" />
      </Helmet>
      {/* Editorial Header */}
      <section className="blog-hero-image">
        <img loading="lazy" src="/Blogherodummy.webp" alt="Parani Journal" />
      </section>

      <div className="container blog-main-container">
        {isLoading && blogs.length === 0 ? (
          /* Luxury Shimmer Skeleton Feed - No crude spinner or flash */
          <div className="blog-skeleton-feed" style={{ padding: '20px 0' }}>
            
            {/* Featured Card Skeleton */}
            <div className="skeleton-featured-wrapper">
              <div className="blog-skeleton-bone" style={{ height: '360px' }}></div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                <div className="blog-skeleton-bone" style={{ width: '100px', height: '24px', borderRadius: '50px' }}></div>
                <div className="blog-skeleton-bone" style={{ width: '85%', height: '36px' }}></div>
                <div className="blog-skeleton-bone" style={{ width: '100%', height: '18px' }}></div>
                <div className="blog-skeleton-bone" style={{ width: '90%', height: '18px' }}></div>
                <div className="blog-skeleton-bone" style={{ width: '140px', height: '40px', marginTop: '0.5rem', borderRadius: '50px' }}></div>
              </div>
            </div>

            {/* Grid Skeletons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[1, 2].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="blog-skeleton-bone" style={{ height: '200px', borderRadius: '0' }}></div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="blog-skeleton-bone" style={{ width: '80px', height: '20px', borderRadius: '50px' }}></div>
                    <div className="blog-skeleton-bone" style={{ width: '90%', height: '24px' }}></div>
                    <div className="blog-skeleton-bone" style={{ width: '100%', height: '16px' }}></div>
                    <div className="blog-skeleton-bone" style={{ width: '75%', height: '16px' }}></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (!isLoading && hasFetched && allBlogs.length === 0) ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', margin: '40px 0' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>No articles published yet</h3>
            <p style={{ color: '#64748b' }}>Check back soon for new farming guides, machinery maintenance tips, and product insights!</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredPost && (
              <article className="featured-article" onClick={() => navigate(`/blog/${featuredPost.id}`)} style={{ cursor: 'pointer' }}>
                <div className="featured-image-wrapper">
                  <img loading="lazy" src={featuredPost.image} alt={featuredPost.title} className="featured-img" />
                </div>
                <div className="featured-content">
                  <div className="category-badge-inline">{featuredPost.category}</div>
                  <div className="meta-info">
                    <span className="meta-item"><User size={14} /> Author: {featuredPost.author}</span>
                    <span className="meta-item"><Calendar size={14} /> Published: {featuredPost.date}</span>
                  </div>
                  <h2 className="featured-title">{featuredPost.title}</h2>
                  <p className="featured-excerpt">{featuredPost.excerpt}</p>
                  <button className="read-more-btn">
                    Read Full Article <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            )}

            <div className="blog-grid-layout">
              {/* Latest Articles */}
              <div className="articles-feed">
                <div className="feed-header">
                  <h3 className="section-heading">
                    {selectedCategory ? `${selectedCategory} Articles` : 'Latest Articles'}
                  </h3>
                  <div className="heading-line"></div>
                </div>
                
                <div className="article-cards">
                  {regularPosts.length > 0 ? regularPosts.map(post => (
                    <article className="article-card" key={post.id} onClick={() => navigate(`/blog/${post.id}`)} style={{ cursor: 'pointer' }}>
                      <div className="card-image-box">
                        <img loading="lazy" src={post.image} alt={post.title} />
                        <span className="card-category">{post.category}</span>
                      </div>
                      <div className="card-content">
                        <h4 className="card-title">{post.title}</h4>
                        <p className="card-excerpt">{post.excerpt}</p>
                        <div className="card-footer">
                          <div className="card-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                            <span>Author: {post.author}</span>
                            <span>Published: {post.date}</span>
                          </div>
                          <span className="read-more-text">Read Article <ArrowRight size={16} /></span>
                        </div>
                      </div>
                    </article>
                  )) : (
                    <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
                      No extra articles found for this category.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="blog-sidebar">
                <div className="sidebar-widget about-widget">
                  <img loading="lazy" src="/officiallogo.png" alt="Parani Logo" className="widget-logo" />
                  <h4>Expert Advice Since 1960</h4>
                  <p>We share decades of mechanical expertise to help you choose, operate, and maintain your equipment perfectly.</p>
                </div>

                <div className="sidebar-widget categories-widget">
                  <h4>Topics</h4>
                  <ul className="category-list">
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setSelectedCategory(null); }}
                        className={!selectedCategory ? 'active-topic' : ''}
                      >
                        All Topics <span>({allBlogs.length})</span>
                      </a>
                    </li>
                    {categories.map(([name, count]) => (
                      <li key={name}>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setSelectedCategory(name); }}
                          className={selectedCategory === name ? 'active-topic' : ''}
                        >
                          {name} <span>({count})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product of the Month Widget (100% Dynamic - ONLY shown when selected in Admin Panel) */}
                {productOfTheMonth && (
                  <div className="sidebar-widget product-widget">
                    <div className="widget-badge">Product of the Month</div>
                    <img 
                      loading="lazy" 
                      src={getProductImage(productOfTheMonth)} 
                      alt={productOfTheMonth.name} 
                      className="widget-product-img" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== '/Blogherodummy.webp') {
                          target.src = '/Blogherodummy.webp';
                        }
                      }}
                    />
                    <h4 
                      className="widget-product-title" 
                      style={{ textTransform: 'uppercase', cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${productOfTheMonth.slug || productOfTheMonth.id || productOfTheMonth._id}`)}
                      title="Click to view product specifications"
                    >
                      {productOfTheMonth.name}
                    </h4>
                    <p className="widget-product-desc">{productOfTheMonth.description || "Discover our highly recommended equipment of the month, chosen for its exceptional durability and farm performance."}</p>
                    <button 
                      className="widget-cta-btn" 
                      onClick={() => {
                        const text = encodeURIComponent(`Hello Parani Mill Stores,\n\nI saw the "Product of the Month" (${productOfTheMonth.name}) on your blog page.\n\nCould you please provide more details and pricing?`);
                        window.open(`https://wa.me/917094341807?text=${text}`, '_blank');
                      }}
                    >
                      Enquire Now
                    </button>
                  </div>
                )}
              </aside>
            </div>

            {/* Standalone Catchy WhatsApp Button */}
            <div className="blog-whatsapp-wrapper">
              <a 
                href={`https://wa.me/917094341807?text=${encodeURIComponent(`Hello Parani Mill Stores,\n\nI was browsing your blogs and equipment guides.\n\nCould you please help me with equipment advice and pricing?`)}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp-catchy"
              >
                <div className="wa-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28">
                    <path fill="#25D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z" />
                    <path fill="#FFF" d="M223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </div>
                <div className="wa-divider"></div>
                <div className="wa-text-container">
                  <span className="wa-text-small">ENQUIRE VIA</span>
                  <span className="wa-text-large">WHATSAPP</span>
                </div>
                <div className="wa-arrow-container">
                  <ChevronRight size={24} color="white" />
                </div>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
