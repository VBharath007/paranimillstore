import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Share2, User, Calendar, Check, ChevronRight } from 'lucide-react';
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

        {/* Standalone Catchy WhatsApp Button */}
        <div className="article-whatsapp-wrapper">
          <a 
            href={`https://wa.me/917094341807?text=${encodeURIComponent(`Hello Parani Mill Stores,\n\nI just read your article: "${post.title}".\n\nCould you please help me with equipment advice and pricing?`)}`}
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

      </div>
    </div>
  );
};

export default BlogPost;
