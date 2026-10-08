import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, User, Calendar } from 'lucide-react';
import { blogPosts } from './Blog';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [backendPost, setBackendPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // First try to find it locally
  const localPost = blogPosts.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (localPost) {
      setIsLoading(false);
      return;
    }

    const fetchBackendPost = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/blogs/${id}`);
        const data = await res.json();
        if (data && data.success && data.data) {
          const b = data.data;
          setBackendPost({
            id: b._id,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            category: b.category,
            author: b.author,
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: "5 min read",
            image: b.coverImage || '/Blogherodummy.webp',
          });
        }
      } catch (err) {
        console.error("Error fetching blog from backend API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBackendPost();
  }, [id, localPost]);

  const post = localPost || backendPost;

  // Split content into sentences
  const contentSentences = post ? post.content.split('. ').filter((s: string) => s.trim().length > 0).map((s: string) => s.trim() + (s.endsWith('.') ? '' : '.')) : [];
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
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Article...</div>;
  }

  if (!post) {
    return (
      <div className="blog-post-not-found">
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Article not found</h2>
          <button onClick={() => navigate('/blogs')} className="article-back-btn" style={{ marginTop: '20px' }}>Return to Blog</button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
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
            <div className="meta-author">
              <div className="author-info" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="author-name" style={{ color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={18} /> Author: {post.author}
                </span>
                <div className="author-date" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                  <Calendar size={18} /> Published: {post.date}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Split Layout */}
        <div className="article-split-layout">
          {/* Left Side: Text and Buttons */}
          <div className="article-split-left">
            <article className="article-body">
              <p className="article-lead">{post.excerpt}</p>
              <div className="article-content">
                {leftContent.map((sentence: string, i: number) => (
                  <p key={i}>{sentence}</p>
                ))}
              </div>
            </article>

            {/* Action Buttons */}
            <div className="article-footer-actions">
              <button className="article-cta-btn" onClick={() => navigate('/contact')}>
                Enquire Now
              </button>
              <button onClick={handleShare} className="article-share-btn">
                <Share2 size={18} /> Share Article
              </button>
            </div>
          </div>

          {/* Right Side: Image and Extra Content */}
          <div className="article-split-right">
            <div className="article-featured-image">
              <img loading="lazy" src={post.image} alt={post.title} />
              <div className="image-caption">Fig 1. {post.title}</div>
            </div>
            
            <div className="article-content right-side-content" style={{ marginTop: '30px' }}>
              {rightContent.map((sentence: string, i: number) => (
                <p key={i}>{sentence}</p>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BlogPost;
