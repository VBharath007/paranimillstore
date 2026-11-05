import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Share2, User, Calendar, Check } from 'lucide-react';
import './BlogPost.css';
import fallbackBlogs from '../blogs.json';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [backendPost, setBackendPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setHasFetched(false);

    const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5001';

    const fetchBackendPost = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs/${id}`);
        const data = await res.json();
        if (data && data.success && data.data) {
          const b = data.data;
          setBackendPost({
            id: b._id || b.id,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            category: b.category || 'General',
            author: b.author || 'Parani Mill Stores',
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            rawDate: b.createdAt || new Date().toISOString(),
            readTime: "5 min read",
            image: b.coverImage || b.image || '/Blogherodummy.webp',
          });

        } else {
          const fb = (fallbackBlogs as any[]).find((b: any) => b.id === id || b._id === id || b.slug === id);
          if (fb) {
            setBackendPost({
              id: fb._id || fb.id,
              title: fb.title,
              excerpt: fb.excerpt,
              content: fb.content,
              category: fb.category || 'General',
              author: fb.author || 'Parani Mill Stores',
              date: fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
              rawDate: fb.createdAt || new Date().toISOString(),
              readTime: "5 min read",
              image: fb.coverImage || fb.image || '/Blogherodummy.webp',
            });
          } else {
            setBackendPost(null);
          }
        }

      } catch (err) {
        console.error("Error fetching blog from backend API:", err);
        const fb = (fallbackBlogs as any[]).find((b: any) => b.id === id || b._id === id || b.slug === id);
        if (fb) {
          setBackendPost({
            id: fb._id || fb.id,
            title: fb.title,
            excerpt: fb.excerpt,
            content: fb.content,
            category: fb.category || 'General',
            author: fb.author || 'Parani Mill Stores',
            date: fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            rawDate: fb.createdAt || new Date().toISOString(),
            readTime: "5 min read",
            image: fb.coverImage || fb.image || '/Blogherodummy.webp',
          });
        } else {
          setBackendPost(null);
        }
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    if (id) {
      fetchBackendPost();
    }
  }, [id]);

  const post = backendPost;

  // Split content into sentences
  const contentSentences = post && post.content ? post.content.split('. ').filter((s: string) => s.trim().length > 0).map((s: string) => s.trim() + (s.endsWith('.') ? '' : '.')) : [];
  const halfPoint = Math.ceil(contentSentences.length / 2);
  const leftContent = contentSentences.slice(0, halfPoint);
  const rightContent = contentSentences.slice(halfPoint);

  const handleShare = async () => {
    if (!post) return;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled
    }
  };

  // Luxury Skeleton while loading - NEVER flash "not found"
  if (isLoading || !hasFetched) {
    return (
      <div className="article-page">
        <div className="article-container">
          <div className="blog-skeleton-bone" style={{ width: '150px', height: '38px', marginBottom: '2.5rem', borderRadius: '50px' }}></div>
          <div className="blog-skeleton-bone" style={{ width: '110px', height: '24px', marginBottom: '1rem', borderRadius: '50px' }}></div>
          <div className="blog-skeleton-bone" style={{ width: '85%', height: '42px', marginBottom: '1.25rem' }}></div>
          <div className="blog-skeleton-bone" style={{ width: '240px', height: '20px', marginBottom: '2rem' }}></div>
          <div className="blog-skeleton-bone" style={{ width: '100%', height: '380px', borderRadius: '16px', marginBottom: '2.5rem' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="blog-skeleton-bone" style={{ width: '100%', height: '18px' }}></div>
              <div className="blog-skeleton-bone" style={{ width: '92%', height: '18px' }}></div>
              <div className="blog-skeleton-bone" style={{ width: '96%', height: '18px' }}></div>
              <div className="blog-skeleton-bone" style={{ width: '88%', height: '18px' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="blog-skeleton-bone" style={{ width: '98%', height: '18px' }}></div>
              <div className="blog-skeleton-bone" style={{ width: '90%', height: '18px' }}></div>
              <div className="blog-skeleton-bone" style={{ width: '94%', height: '18px' }}></div>
              <div className="blog-skeleton-bone" style={{ width: '85%', height: '18px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only reached if genuine 404 after fetch completed
  if (!post) {
    return (
      <div className="blog-post-not-found">
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Article not found</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>The article you are looking for may have been updated or moved.</p>
          <button onClick={() => navigate('/blogs')} className="article-back-btn" style={{ marginTop: '20px', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Return to Blog
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = `${post.title} | Parani Mill Stores Blog`;
  const pageUrl = `https://paranimill.com/blog/${id}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `https://paranimill.com${post.image}`;
  const metaDesc = post.excerpt ? post.excerpt.slice(0, 160) : `Read ${post.title} on Parani Mill Stores blog.`;

  return (
    <div className="article-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Parani Mill Stores" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": metaDesc,
            "image": [imageUrl],
            "datePublished": post.rawDate,
            "author": {
              "@type": "Organization",
              "name": post.author || "Parani Mill Stores"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Parani Mill Stores",
              "logo": {
                "@type": "ImageObject",
                "url": "https://paranimill.com/officiallogo.png"
              }
            },
            "mainEntityOfPage": pageUrl
          })}
        </script>
      </Helmet>
      <div className="article-container">
        {/* Navigation */}
        <div className="article-nav">
          <button onClick={() => navigate('/blogs')} className="article-back-btn">
            <ArrowLeft size={18} /> Back to Articles
          </button>
        </div>
        
        {/* Top Header */}
        <header className="article-header">
          <div className="article-category">{post.category}</div>
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span className="article-author"><User size={16} /> By {post.author}</span>
            <span className="article-date"><Calendar size={16} /> {post.date}</span>
            <span className="article-read-time">{post.readTime}</span>
            <button className="article-share-btn" onClick={handleShare}>
              {isCopied ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />} 
              {isCopied ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="article-featured-image">
          <img src={post.image} alt={post.title} />
        </div>

        {/* Excerpt Lead */}
        {post.excerpt && (
          <div className="article-excerpt-lead">
            <p>{post.excerpt}</p>
          </div>
        )}

        {/* Split Content Body */}
        <div className="article-split-layout">
          <div className="split-column left-column">
            {leftContent.map((sentence: string, idx: number) => (
              <p key={idx}>{sentence}</p>
            ))}
          </div>
          <div className="split-column right-column">
            {rightContent.map((sentence: string, idx: number) => (
              <p key={idx}>{sentence}</p>
            ))}
          </div>
        </div>

        {/* Bottom CTA / Help Box */}
        <div className="article-footer-cta">
          <h3>Need equipment advice or pricing?</h3>
          <p>Our farming and machinery specialists at Parani Mill Stores are ready to help you find the right equipment.</p>
          <button 
            className="article-cta-btn"
            onClick={() => {
              const text = encodeURIComponent(`Hello Parani Mill Stores,\n\nI just read your article: "${post.title}".\n\nCould you please help me with recommended products and pricing?`);
              window.open(`https://wa.me/917094341807?text=${text}`, '_blank');
            }}
          >
            Enquire via WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlogPost;
