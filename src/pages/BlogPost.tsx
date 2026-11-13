import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Share2, User, Calendar, Check } from 'lucide-react';
import './BlogPost.css';
import fallbackBlogs from '../blogs.json';
import { API_BASE } from '../config/api';

// Inline parser for bold, italic, and links
const renderInline = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const closeBracket = token.indexOf('](');
      const linkText = token.slice(1, closeBracket);
      const linkUrl = token.slice(closeBracket + 2, -1);
      parts.push(
        <a key={key++} href={linkUrl} target="_blank" rel="noopener noreferrer" className="article-inline-link">
          {linkText}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
};

// Full block-level markdown renderer
const renderMarkdownContent = (content: string, postTitle?: string): React.ReactNode => {
  if (!content) return null;

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  let currentList: string[] = [];
  let currentTable: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key++} className="article-list">
          {currentList.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = () => {
    if (currentTable.length >= 2) {
      const headerLine = currentTable[0];
      const headers = headerLine.split('|').map(s => s.trim()).filter(Boolean);
      // Data rows starting from line 2 (skipping divider line 1)
      const dataRows = currentTable.slice(2).map(row => 
        row.split('|').map(s => s.trim()).filter(Boolean)
      );

      elements.push(
        <div key={key++} className="article-table-wrapper">
          <table className="article-table">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    currentTable = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check if table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      currentTable.push(line);
      continue;
    } else if (currentTable.length > 0) {
      flushTable();
    }

    // Check if list item
    if (line.startsWith('- ') || line.startsWith('* ') || /^(\d+)\.\s+/.test(line)) {
      const itemText = line.replace(/^[-*]\s+|\d+\.\s+/, '');
      currentList.push(itemText);
      continue;
    } else if (currentList.length > 0) {
      flushList();
    }

    // Empty line
    if (!line) {
      continue;
    }

    // Horizontal rule
    if (line === '---' || line === '***' || line === '___') {
      elements.push(<hr key={key++} className="article-divider" />);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      const h1Text = line.replace(/^#\s+/, '').trim();
      // If matches article title, don't repeat it
      if (postTitle && h1Text.toLowerCase().includes(postTitle.slice(0, 20).toLowerCase())) {
        continue;
      }
      elements.push(<h2 key={key++} className="article-h2">{renderInline(h1Text)}</h2>);
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="article-h2">{renderInline(line.replace(/^##\s+/, ''))}</h2>);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="article-h3">{renderInline(line.replace(/^###\s+/, ''))}</h3>);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={key++} className="article-quote">{renderInline(line.replace(/^>\s+/, ''))}</blockquote>);
      continue;
    }

    // Normal paragraph
    elements.push(<p key={key++} className="article-p">{renderInline(line)}</p>);
  }

  flushList();
  flushTable();

  return elements;
};

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
            <div className="article-meta-left">
              <span className="article-author"><User size={15} /> By {post.author}</span>
              <span className="meta-dot">•</span>
              <span className="article-date"><Calendar size={15} /> {post.date}</span>
              <span className="meta-dot">•</span>
              <span className="article-read-time">{post.readTime}</span>
            </div>
            <button className="article-share-btn" onClick={handleShare} aria-label="Share article">
              {isCopied ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />} 
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
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

        {/* Clean Article Content Body */}
        <div className="article-content-container">
          <article className="article-body-content">
            {renderMarkdownContent(post.content, post.title)}
          </article>
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
