import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';

export const blogPosts = [
  {
    id: 1,
    title: "The Future of Agricultural Machinery: Automation and Efficiency",
    excerpt: "Learn how modern agricultural machinery can help you increase your crop yield while reducing your daily labor costs.",
    content: "Farming is changing, and modern machinery makes it easier than ever to get the best out of your land. Today's equipment helps you save water, prepare soil faster, and keep your plants healthy without the back-breaking manual work. Whether it's a smart irrigation system or an advanced tiller, these tools do the heavy lifting for you. By upgrading to the right machinery, you can cut down on daily expenses, finish your work faster, and ultimately increase your farm's profit.",
    category: "Agricultural Machinery",
    author: "K. Ramesh",
    date: "Sep 20, 2026",
    readTime: "5 min read",
    image: "/parani products webp/MINI TILLER - MY - 300G.webp",
    featured: false
  },
  {
    id: 2,
    title: "How to Choose the Right Generator for Your Farm",
    excerpt: "A simple guide to picking the perfect backup power so your farm operations never stop.",
    content: "Unexpected power cuts can bring farm work to a halt and cause unnecessary losses. Picking the right generator ensures your equipment keeps running smoothly, no matter what. Diesel generators are tough and great for heavy, long-term tasks, while petrol generators are easy to move around for quick fixes. Start by calculating how much power your most important machines need. By matching the generator's size to your daily farm needs, you can guarantee a steady, reliable power supply all year round.",
    category: "Power Generators",
    author: "S. Kumar",
    date: "Sep 15, 2026",
    readTime: "4 min read",
    image: "/Genset/ATLAS POWER GENERATOR - AP8500G/product raw image.webp",
    featured: true
  },
  {
    id: 3,
    title: "Top 5 Maintenance Tips for Honda Power Weeder",
    excerpt: "Keep your power weeder running like new with these simple pre-season and post-harvest maintenance tips.",
    content: "Taking good care of your power weeder saves you money and prevents sudden breakdowns in the middle of the field. After every use, make sure to clean the blades and remove stuck mud or weeds. Keep all moving parts well-oiled to stop them from rusting. Don't forget to check the engine oil and clean the air filter regularly—just like you would for your bike or tractor. A little bit of daily care ensures your weeder gives you peak performance for years to come.",
    category: "Agricultural Machinery",
    author: "Tech Team",
    date: "Sep 10, 2026",
    readTime: "3 min read",
    image: "/Parani - 43 Products/POWER WEEDER - MY-470G (UPGRADED)/product raw image.webp",
    featured: false
  },
  {
    id: 4,
    title: "Understanding High Pressure Washers for Commercial Use",
    excerpt: "Find out how a commercial high-pressure washer can save you hours of cleaning time every single week.",
    content: "Cleaning heavy machinery, tractors, and large farm areas can take hours of hard work. A commercial high-pressure washer changes all that by easily washing away stubborn dirt, hard mud, and thick grease in minutes. These machines are built tough to handle daily use and offer strong water pressure to cover large spaces quickly. With adjustable nozzles and powerful sprays, investing in a good pressure washer keeps your equipment shining and saves your valuable time and energy.",
    category: "Construction Equipment",
    author: "P. Muthu",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "/Parani - 43 Products/HIGH PRESSURE WASHER - MY - HPW - 1450/product raw image.webp",
    featured: false
  },
  {
    id: 5,
    title: "How to Save Fuel and Maximize Your Engine's Efficiency",
    excerpt: "Simple tips to get the most runtime out of your backup engines while spending less on fuel.",
    content: "Fuel costs can add up quickly, but smart power management can save you a lot of money. To get the best mileage out of your engines and generators, avoid turning on all heavy machines at the exact same time—this prevents sudden overloads and wasted fuel. Make a habit of balancing your power usage by running only what you absolutely need during long power cuts. Following these simple steps will not only reduce your fuel bills but also protect your engine from wearing out too fast.",
    category: "Power Generators",
    author: "Engineering",
    date: "Aug 28, 2026",
    readTime: "4 min read",
    image: "/Parani - 43 Products/168F ENGINE - RAPL - GE - 168F/thumbnail.png",
    featured: false
  }
];

const Blog = () => {
  const navigate = useNavigate();
  const [backendBlogs, setBackendBlogs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBackendBlogs = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/blogs');
        const data = await res.json();
        if (data && data.success && data.data) {
          setBackendBlogs(data.data);
        }
      } catch (err) {
        console.error("Error fetching blogs from backend API:", err);
      }
    };
    fetchBackendBlogs();
  }, []);

  const PRODUCT_CATEGORIES = [
    "Agricultural Machinery",
    "Power Generators",
    "Construction Equipment",
    "Maintenance & Service"
  ];

  const rawBlogs = [
    ...blogPosts.map(p => {
       let cat = p.category;
       if (cat === 'Agriculture') cat = 'Agricultural Machinery';
       else if (cat === 'Power Generation' || cat === 'Power') cat = 'Power Generators';
       else if (cat === 'Commercial') cat = 'Maintenance & Service';
       else if (cat === 'Maintenance') cat = 'Maintenance & Service';
       return { ...p, category: cat };
    }),
    ...backendBlogs.map(b => {
      let cat = b.category || 'General';
      if (cat === 'Agriculture') cat = 'Agricultural Machinery';
      else if (cat === 'Power Generation' || cat === 'Power') cat = 'Power Generators';
      else if (cat === 'Commercial') cat = 'Maintenance & Service';
      else if (cat === 'Maintenance') cat = 'Maintenance & Service';

      return {
        id: b._id,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        category: cat,
        author: b.author,
        date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: "5 min read",
        image: b.coverImage || '/Blogherodummy.webp',
        featured: false 
      };
    })
  ];

  const uniqueBlogsMap = new Map();
  rawBlogs.forEach(blog => {
    if (!uniqueBlogsMap.has(blog.title)) {
      uniqueBlogsMap.set(blog.title, blog);
    }
  });
  const allBlogs = Array.from(uniqueBlogsMap.values());

  const displayBlogs = selectedCategory 
    ? allBlogs.filter(p => p.category === selectedCategory) 
    : allBlogs;

  // If filtering, don't show a huge featured post, just show them all in the grid.
  // Otherwise, pick the featured post for the main view.
  const featuredPost = selectedCategory ? null : (displayBlogs.find(p => p.featured) || displayBlogs[0]);
  const regularPosts = selectedCategory ? displayBlogs : displayBlogs.filter(p => p.id !== featuredPost?.id);

  const categoryCounts = allBlogs.reduce((acc, post) => {
    const cat = post.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = PRODUCT_CATEGORIES.map(name => [name, categoryCounts[name] || 0]);

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

            {/* Product of the Month Widget */}
            <div className="sidebar-widget product-widget">
              <div className="widget-badge">Product of the Month</div>
              <img loading="lazy" src="/parani products webp/MINI TILLER - MY - 300G.webp" alt="Mini Tiller" className="widget-product-img" />
              <h4 className="widget-product-title">Mitsuyama Mini Tiller 300G</h4>
              <p className="widget-product-desc">Perfect for small farms and gardens. High efficiency with low fuel consumption.</p>
              <button 
                className="widget-cta-btn" 
                onClick={() => {
                  const text = encodeURIComponent(`Hello Parani Mill Stores,\n\nI saw the "Product of the Month" (Mitsuyama Mini Tiller 300G) on your blog page.\n\nCould you please provide more details and pricing?`);
                  window.open(`https://wa.me/917094341807?text=${text}`, '_blank');
                }}
              >
                Enquire Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
