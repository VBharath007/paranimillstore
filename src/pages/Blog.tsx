import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';

export const blogPosts = [
  {
    id: 1,
    title: "The Future of Agricultural Machinery: Automation and Efficiency",
    excerpt: "Discover how modern automated tillers and smart irrigation systems are revolutionizing crop yields while significantly reducing manual labor costs.",
    content: "Discover how modern automated tillers and smart irrigation systems are revolutionizing crop yields while reducing manual labor costs. With advancements in precision agriculture, farmers can optimize resources efficiently. Automated equipment ensures consistent soil preparation, and intelligent irrigation adapts to real-time weather patterns, conserving water and improving plant health. By investing in this modern machinery, agricultural businesses can streamline operations, cut operational expenses, and achieve much higher profitability.",
    category: "Agriculture",
    author: "K. Ramesh",
    date: "Sep 20, 2026",
    readTime: "5 min read",
    image: "/parani products webp/MINI TILLER - MY - 300G.webp",
    featured: false
  },
  {
    id: 2,
    title: "Choosing the Right Genset for Your Farm",
    excerpt: "A comprehensive guide to selecting reliable backup power for continuous agricultural operations.",
    content: "A comprehensive guide to selecting reliable backup power for continuous agricultural operations. Power outages can severely disrupt farm activities and lead to significant losses. Choosing the right generator involves understanding your power requirements, fuel preferences, and budget constraints. Diesel generators offer durability for heavy-duty tasks, while petrol variants provide portability. Assess your total essential wattage to ensure seamless load handling, and prioritize regular maintenance to maintain uninterrupted farm productivity.",
    category: "Power Generation",
    author: "S. Kumar",
    date: "Sep 15, 2026",
    readTime: "4 min read",
    image: "/Genset/ATLAS POWER GENERATOR - AP8500G/product raw image.webp",
    featured: true
  },
  {
    id: 3,
    title: "Top 5 Maintenance Tips for Honda Power Weeder",
    excerpt: "Extend the lifespan of your power weeder with these essential pre-monsoon and post-harvest maintenance routines.",
    content: "Extend the lifespan of your power weeder with essential pre-monsoon and post-harvest maintenance routines. Proper care ensures peak efficiency and prevents costly breakdowns. Start by thoroughly cleaning the blades and checking for damage. Lubricate moving parts regularly to reduce friction and prevent rust. Always inspect the engine oil and air filters, replacing them as recommended. Consistent maintenance enhances daily performance and maximizes your valuable equipment investment's overall longevity.",
    category: "Maintenance",
    author: "Tech Team",
    date: "Sep 10, 2026",
    readTime: "3 min read",
    image: "/Parani - 43 Products/POWER WEEDER - MY-470G (UPGRADED)/product raw image.webp",
    featured: false
  },
  {
    id: 4,
    title: "Understanding High Pressure Washers for Commercial Use",
    excerpt: "Why upgrading to a commercial-grade high-pressure washer can save your business hours of cleaning time every week.",
    content: "Why upgrading to a commercial-grade high-pressure washer saves your business hours of cleaning time. These washers deliver powerful streams that effortlessly remove stubborn dirt, grease, and grime. Built with robust components for heavy use, commercial models feature higher pressure ratings enabling faster cleaning of large areas and heavy machinery. With adjustable settings and versatile attachments, investing in a professional washer improves hygiene standards and significantly boosts operational efficiency.",
    category: "Commercial",
    author: "P. Muthu",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "/Parani - 43 Products/HIGH PRESSURE WASHER - MY - HPW - 1450/product raw image.webp",
    featured: false
  },
  {
    id: 5,
    title: "Maximizing Efficiency with Professional Engines",
    excerpt: "Simple load-balancing strategies to ensure your backup systems provide maximum runtime using minimal fuel.",
    content: "Simple load-balancing strategies ensure your backup systems provide maximum runtime using minimal fuel. Efficient power management is critical during extended outages. By distributing the electrical load evenly, you prevent engine overload, premature wear, and excessive fuel consumption. Prioritize essential equipment and avoid starting all heavy machinery simultaneously to manage surge currents. These smart strategies ensure your farm operations run smoothly, economically, and maximize the lifespan of your power equipment.",
    category: "Power",
    author: "Engineering",
    date: "Aug 28, 2026",
    readTime: "4 min read",
    image: "/Parani - 43 Products/168F ENGINE - RAPL - GE - 168F/thumbnail.png",
    featured: false
  }
];

const Blog = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredPost = blogPosts.find(p => p.featured);
  const regularPosts = blogPosts.filter(p => !p.featured);

  const categoryCounts = blogPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryCounts);

  return (
    <div className="blog-page">
      <Helmet>
        <title>Blogs & Updates | Parani Mill Stores</title>
        <meta name="description" content="Read the latest updates, buying guides, and maintenance tips for your agricultural sprayers, power weeders, petrol brush cutters, and gensets from Parani Mill Stores." />
      </Helmet>
      {/* Editorial Header */}
      <section className="blog-hero-image">
        <img loading="lazy" src="/Blogherodummy.webp" alt="Parani Journal" />
      </section>

      <div className="container blog-main-container">
        {/* Featured Article */}
        {featuredPost && (
          <article className="featured-article" onClick={() => navigate(`/blog/${featuredPost.id}`)} style={{ cursor: 'pointer' }}>
            <div className="featured-image-wrapper">
              <img loading="lazy" src={featuredPost.image} alt={featuredPost.title} className="featured-img" />
            </div>
            <div className="featured-content">
              <div className="category-badge-inline">{featuredPost.category}</div>
              <div className="meta-info">
                <span className="meta-item"><User size={14} /> {featuredPost.author}</span>
                <span className="meta-item"><Calendar size={14} /> {featuredPost.date}</span>
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
              <h3 className="section-heading">Latest Articles</h3>
              <div className="heading-line"></div>
            </div>
            
            <div className="article-cards">
              {regularPosts.map(post => (
                <article className="article-card" key={post.id} onClick={() => navigate(`/blog/${post.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="card-image-box">
                    <img loading="lazy" src={post.image} alt={post.title} />
                    <span className="card-category">{post.category}</span>
                  </div>
                  <div className="card-content">
                    <h4 className="card-title">{post.title}</h4>
                    <p className="card-excerpt">{post.excerpt}</p>
                    <div className="card-footer">
                      <div className="card-meta">
                        <span>{post.date}</span>
                      </div>
                      <span className="read-more-text">Read Article <ArrowRight size={16} /></span>
                    </div>
                  </div>
                </article>
              ))}
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
                {categories.map(([name, count]) => (
                  <li key={name}><a href="#">{name} <span>({count})</span></a></li>
                ))}
              </ul>
            </div>

            {/* Product of the Month Widget */}
            <div className="sidebar-widget product-widget">
              <div className="widget-badge">Product of the Month</div>
              <img loading="lazy" src="/parani products webp/MINI TILLER - MY - 300G.webp" alt="Mini Tiller" className="widget-product-img" />
              <h4 className="widget-product-title">Mitsuyama Mini Tiller 300G</h4>
              <p className="widget-product-desc">Perfect for small farms and gardens. High efficiency with low fuel consumption.</p>
              <button className="widget-cta-btn" onClick={() => navigate('/contact')}>Enquire Now</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
