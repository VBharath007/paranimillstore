import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft,
  Settings,
  Tag
} from 'lucide-react';
import { getProductImage } from './Products';
import fallbackProducts from '../products.json';
import gensetsData from '../gensets.json';
import constructionData from '../construction.json';
import './Products.css';

const ProductDetail: React.FC = () => {
  const params = useParams<{ category?: string; slug?: string }>();
  const slug = params.slug || params.category;
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const mainImageRef = useRef<HTMLImageElement>(null);
  const imageDisplayAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
    setIs360View(false);

    const fetchProduct = async () => {
      setIsLoading(true);
      const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5001';
      
      try {
        const res = await fetch(API_BASE + '/api/products/' + slug).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            setSelectedProduct(json.data);
            return;
          }
        }

        // Static Cloudflare fallback for teammates
        const allStatic = [...fallbackProducts, ...(gensetsData || []), ...(constructionData || [])];
        const found = allStatic.find((p: any) => {
          const pSlug = p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
          return pSlug === slug || p.id === slug || p._id === slug || (p.name && p.name.toLowerCase() === (slug || '').replace(/-/g, ' '));
        });

        if (found) {
          setSelectedProduct(found);
        } else {
          setSelectedProduct(null);
        }
      } catch (e) {
        console.error('Error fetching product:', e);
        setSelectedProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/products');
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, activeImageIndex, is360View]);

  const images: string[] = selectedProduct 
    ? (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 
        ? selectedProduct.images 
        : [selectedProduct.thumbnail || 'thumbnail.png'])
    : [];

  const currentDisplayIndex = activeImageIndex >= 0 && activeImageIndex < images.length 
    ? activeImageIndex 
    : 0;

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedProduct && images.length > 0) {
      setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedProduct && images.length > 0) {
      setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360View) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360View || startX === null || images.length === 0) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    const threshold = 15;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else {
        setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
      setStartX(clientX);
    }
  };

  const handleDragEnd = () => {
    setStartX(null);
  };

  const handleImageZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is360View || !mainImageRef.current || !imageDisplayAreaRef.current) return;
    const rect = imageDisplayAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImageRef.current.style.transformOrigin = x + '% ' + y + '%';
    mainImageRef.current.style.transform = 'scale(1.8)';
  };

  const handleImageZoomLeave = () => {
    if (!mainImageRef.current) return;
    mainImageRef.current.style.transform = 'scale(1)';
    mainImageRef.current.style.transformOrigin = 'center center';
  };

  const renderProductTitle = (name: string) => {
    if (!name) return null;
    if (name.includes(' - ')) {
      const parts = name.split(' - ');
      return (
        <>
          <span style={{ color: '#0B6A38', fontWeight: 800 }}>{parts[0].trim()}</span>
          <span style={{ color: '#333' }}>{' - '}{parts.slice(1).join(' - ').trim()}</span>
        </>
      );
    } else if (name.includes(',')) {
      const parts = name.split(',');
      return (
        <>
          <span style={{ color: '#0B6A38', fontWeight: 800 }}>{parts[0].trim()}</span>
          <span style={{ color: '#333' }}>{', '}{parts.slice(1).join(',').trim()}</span>
        </>
      );
    }
    return <span style={{ color: '#0B6A38', fontWeight: 800 }}>{name}</span>;
  };

  const getWhatsappLink = (productName: string, productImage?: string) => {
    const text = encodeURIComponent(
      `Hello Parani Mill Stores,\n\nI am interested in your product: *${productName}*.\n\nCould you please provide pricing details, availability, and EMI options?\n\nThank you!`
    );
    return `https://wa.me/917094341807?text=${text}`;
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ width: '42px', height: '42px', border: '3px solid #e2e8f0', borderTopColor: '#0a5c36', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading equipment specifications...</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Product Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>The product you requested might have been updated or moved.</p>
        <button 
          onClick={() => navigate('/products')}
          className="back-link"
          style={{ padding: '8px 24px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <div className="back-icon-circle">
            <ArrowLeft size={16} />
          </div>
          <span>Return to Products Catalog</span>
        </button>
      </div>
    );
  }

  // SEO details
  const pageTitle = `${selectedProduct.name} | Parani Mill Stores`;
  const primaryImg = getProductImage(selectedProduct.folder, selectedProduct.thumbnail || images[0], selectedProduct.thumbnailUrl);
  const absoluteImageUrl = primaryImg.startsWith('http') ? primaryImg : `https://paranimill.com${primaryImg}`;
  const catSlug = selectedProduct.category 
    ? selectedProduct.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
    : '';
  const canonicalUrl = catSlug 
    ? `https://paranimill.com/product/${catSlug}/${selectedProduct.slug || selectedProduct.id || selectedProduct._id}`
    : `https://paranimill.com/product/${selectedProduct.slug || selectedProduct.id || selectedProduct._id}`;
  const metaDescription = selectedProduct.description 
    ? selectedProduct.description.slice(0, 160)
    : `Explore ${selectedProduct.name} at Parani Mill Stores. Genuine farm machinery, spare parts, and full service support across Tamil Nadu.`;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem 5rem' }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Parani Mill Stores" />
        {/* Google Official Product Schema (JSON-LD) for Rich Results */}
        <script type="application/ld+json">
          {`${JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": selectedProduct.name,
            "image": [absoluteImageUrl],
            "description": metaDescription,
            "sku": selectedProduct._id || selectedProduct.id,
            "category": selectedProduct.category || "Agricultural Machinery",
            "brand": {
              "@type": "Brand",
              "name": "Parani Mill Stores"
            },
            "offers": {
              "@type": "Offer",
              "url": canonicalUrl,
              "priceCurrency": "INR",
              "price": selectedProduct.price || 0,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          })}`}
        </script>
      </Helmet>

      <div className="product-modal-window" style={{ maxWidth: '1380px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        
        {/* Top bar with back-link & breadcrumbs */}
        <div className="product-modal-top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <button className="back-link" onClick={() => navigate('/products')}>
            <div className="back-icon-circle">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Products</span>
          </button>

          <div className="breadcrumb">
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span> 
            <ChevronRight size={14} /> 
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/products')}>Products</span> 
            {selectedProduct.category && (
              <>
                <ChevronRight size={14} /> 
                <span 
                  style={{ cursor: 'pointer', color: '#0B6A38', fontWeight: 600 }} 
                  onClick={() => navigate('/products?category=' + encodeURIComponent(selectedProduct.category))}
                  title={'View all ' + selectedProduct.category}
                >
                  {selectedProduct.category}
                </span>
              </>
            )}
            <ChevronRight size={14} /> 
            <span className="current">{selectedProduct.name}</span>
          </div>
        </div>

        {/* Modal content container - EXACT 2 COLUMN OLD UI */}
        <div className="modal-content-container" style={{ height: 'auto', minHeight: '620px' }}>
          
          {/* Left Column: Gallery */}
          <div className="modal-left-column">
            <div className="gallery-layout">
              
              {!is360View && images.length > 1 && (
                <div className="thumbnails-sidebar">
                  <div className="thumbnails-scroll-area">
                    {images.map((img: string, idx: number) => (
                      <div 
                        key={idx} 
                        className={`thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img src={getProductImage(selectedProduct.folder, img, selectedProduct.thumbnailUrl)} alt={`view ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                  {images.length > 4 && (
                    <button className="thumb-scroll-down"><ChevronDown size={20}/></button>
                  )}
                </div>
              )}

              <div className="main-image-section">
                <div 
                  ref={imageDisplayAreaRef}
                  className={`image-display-area ${is360View ? 'is-360' : ''}`}
                  onMouseDown={handleDragStart}
                  onMouseMove={(e) => {
                    if (is360View) {
                      handleDragMove(e);
                    } else {
                      handleImageZoomMove(e);
                    }
                  }}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={() => {
                    handleDragEnd();
                    handleImageZoomLeave();
                  }}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  {!is360View && images.length > 1 && (
                    <button className="nav-circ prev" onClick={handlePrevImage} aria-label="Previous image">
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  
                  <img 
                    ref={mainImageRef}
                    src={getProductImage(selectedProduct.folder, images[currentDisplayIndex], selectedProduct.thumbnailUrl)} 
                    alt={selectedProduct.name} 
                    className="main-display-image"
                    draggable="false"
                  />
                  
                  {!is360View && images.length > 1 && (
                    <button className="nav-circ next" onClick={handleNextImage} aria-label="Next image">
                      <ChevronRight size={24} />
                    </button>
                  )}
                  
                  {is360View && (
                    <div className="drag-hint">
                      <ChevronLeft size={20} /> Drag to rotate <ChevronRight size={20} />
                    </div>
                  )}
                </div>

                {!is360View && images.length > 1 && (
                  <div className="image-dots">
                    {images.map((_: any, idx: number) => (
                      <div key={idx} className={`dot ${activeImageIndex === idx ? 'active' : ''}`} onClick={() => setActiveImageIndex(idx)} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Specs & Actions */}
          <div className="modal-right-column">
            
            <div className="modal-badges-container">
              {selectedProduct.category && (
                <div className="modal-category-badge">
                  {selectedProduct.category}
                </div>
              )}
              {Boolean(selectedProduct.stroke && typeof selectedProduct.stroke === 'string' && selectedProduct.stroke.trim() && !['none', 'n/a', 'null', 'undefined'].includes(selectedProduct.stroke.trim().toLowerCase())) && (
                <div className="modal-stroke-badge" style={{ margin: 0 }}>
                  {selectedProduct.stroke.trim()}
                </div>
              )}
            </div>

            <h2 className="product-title">
              {renderProductTitle(selectedProduct.name)}
            </h2>
            
            <div className="product-rating-emi-row">
              <div className="emi-info-catchy">
                <div className="emi-icon-wrapper"><Tag size={20} color="white" /></div>
                <div className="emi-text-wrapper">
                  <strong>EMI Options Available</strong>
                  <span>Contact us for EMI details</span>
                </div>
              </div>
            </div>

            <div className="product-specs-container" style={{ display: 'block' }}>
              <h3 className="specs-title">
                <Settings size={20} />
                Specifications
              </h3>
              {(() => {
                let specsToRender: Record<string, string> | null = null;
                if (selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0) {
                  specsToRender = selectedProduct.specs;
                } else if (selectedProduct.description) {
                  specsToRender = {};
                  const lines = selectedProduct.description.split('\n');
                  lines.forEach((line: string) => {
                    if (!line.trim() || !specsToRender) return;
                    if (line.includes('\t')) {
                      const parts = line.split('\t');
                      if (parts.length >= 2) {
                        specsToRender[parts[0].trim()] = parts.slice(1).join(' ').trim();
                      }
                    } else {
                      const parts = line.split(/\s{2,}/);
                      if (parts.length >= 2) {
                        specsToRender[parts[0].trim()] = parts.slice(1).join(' ').trim();
                      } else {
                        specsToRender[line.trim()] = "-";
                      }
                    }
                  });
                  if (Object.keys(specsToRender).length === 0) specsToRender = null;
                }

                return specsToRender ? (
                  <table className="product-specs-table">
                    <tbody>
                      {Object.entries(specsToRender).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-value">{value as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '20px', color: '#cc3f45', fontWeight: 'bold' }}>
                    No specifications data found for this product.
                  </div>
                );
              })()}
            </div>

            <div className="flipkart-actions" style={{ justifyContent: 'center' }}>
              <a 
                href={getWhatsappLink(selectedProduct.name, selectedProduct.images?.[0])} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp-catchy"
              >
                <div className="wa-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28">
                    <path fill="#25D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z"/>
                    <path fill="#FFF" d="M223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
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
      </div>
    </div>
  );
};

export default ProductDetail;
