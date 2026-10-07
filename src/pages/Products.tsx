import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown, Image as ImageIcon, Maximize2, ShieldCheck, Package, Shield, Settings, Zap, Layers, Tag, FileText, Heart, Star, ShoppingCart, X, Fuel, Cpu, Wrench, Gauge, Database, Truck, CreditCard } from 'lucide-react';
import './Products.css';
import productsData from '../products.json';
import gensetsData from '../gensets.json';
import constructionData from '../construction.json';

const Products = () => {
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<'agri' | 'genset' | 'construction'>('agri');
  const [backendProducts, setBackendProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        const data = await response.json();
        if (data && data.success && data.data) {
          setBackendProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products from backend API:", error);
      }
    };
    fetchBackendProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category === 'genset' || category === 'agri' || category === 'construction') {
      setActiveCategory(category as any);
      setTimeout(() => {
        const section = document.querySelector('.categories-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // Filter images to create a 4-point rotation sequence if available
  const rotationSequence = React.useMemo(() => {
    if (!selectedProduct) return null;
    if (!selectedProduct.images) return null; // Backend products might not have 'images' initially for 360 view
    const front = selectedProduct.images.findIndex((img: string) => img.includes('front'));
    const right = selectedProduct.images.findIndex((img: string) => img.includes('right'));
    const back = selectedProduct.images.findIndex((img: string) => img.includes('back'));
    const left = selectedProduct.images.findIndex((img: string) => img.includes('left'));
    
    const seq = [front, right, back, left].filter(idx => idx !== -1);
    return seq.length >= 2 ? seq : null;
  }, [selectedProduct]);

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
    } else {
      return <span style={{ color: '#0B6A38', fontWeight: 800 }}>{name}</span>;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setIs360View(false);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct) {
      setActiveImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct) {
      setActiveImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360View) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!is360View || startX === null || !selectedProduct) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;
    
    // Higher sensitivity threshold for 360 drag
    if (Math.abs(diff) > 25) {
      if (rotationSequence) {
        if (diff > 0) {
          setRotationIndex((prev) => (prev === 0 ? rotationSequence.length - 1 : prev - 1));
        } else {
          setRotationIndex((prev) => (prev === rotationSequence.length - 1 ? 0 : prev + 1));
        }
      } else {
        if (diff > 0) {
          setActiveImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
        } else {
          setActiveImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
        }
      }
      setStartX(clientX);
    }
  };

  const currentDisplayIndex = (is360View && rotationSequence) ? rotationSequence[rotationIndex] : activeImageIndex;

  const handleDragEnd = () => {
    setStartX(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (is360View || !selectedProduct) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.6)',
    });
  };

  const handleMouseLeave = () => {
    if (is360View) return;
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  const getWhatsappLink = (productName: string, productImage: string) => {
    const liveDomain = "https://paranimill.com"; // Add your actual website domain here when going live
    const text = encodeURIComponent(`Hello Parani Mill Stores,\n\nI am interested in your product: *${productName}*.\n\nCould you please provide more details, pricing information, and availability?\n\nThank you!`);
    return `https://wa.me/917094341807?text=${text}`;
  };

  return (
    <div className="products-page">
      <Helmet>
        <title>Our Products | Agricultural Machinery, Power Generators & Construction Equipment | Parani Mill Stores</title>
        <meta name="description" content="Explore our premium range of products including agricultural sprayers, petrol brush cutters, earth augers, power weeders, HTP sprayers, concrete vibrators, earth rammers, petrol gensets, diesel engines, and car washers with 100% genuine spares from reputed brands like Jawan, Really and Perfect Equipments." />
      </Helmet>
      <section className="products-hero-image">
        <img src="/PH.webp" alt="Parani Mill Stores Products Hero" />
      </section>

      {/* Auto-scrolling USP Marquee */}
      <div className="product-usp-marquee">
        <div className="marquee-track">
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
          
          {/* Set 2 */}
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
          
          {/* Set 3 */}
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
          
          {/* Set 4 to ensure smooth scroll on ultrawide */}
          <span className="marquee-item"><Package size={18}/> All Spares Available</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><Truck size={18}/> Delivery in Madurai & Nearby Districts</span>
          <span className="marquee-divider">•</span>
          <span className="marquee-item"><CreditCard size={18}/> EMI Available</span>
          <span className="marquee-divider">•</span>
        </div>
      </div>
      
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '25px' }}>Explore Our Signature Products</h2>
          
          <div className="products-subnav">
            <button 
              className={`subnav-btn ${activeCategory === 'agri' ? 'active' : ''}`}
              onClick={() => setActiveCategory('agri')}
            >
              Agricultural Machinery
              {activeCategory !== 'agri' && <ArrowRight size={18} className="switch-arrow" />}
            </button>
            <button 
              className={`subnav-btn ${activeCategory === 'genset' ? 'active' : ''}`}
              onClick={() => setActiveCategory('genset')}
            >
              Power Generators
              {activeCategory !== 'genset' && <ArrowRight size={18} className="switch-arrow" />}
            </button>
            <button 
              className={`subnav-btn ${activeCategory === 'construction' ? 'active' : ''}`}
              onClick={() => setActiveCategory('construction')}
            >
              Construction Equipment
              {activeCategory !== 'construction' && <ArrowRight size={18} className="switch-arrow" />}
            </button>
          </div>

          <div className="categories-grid">
            {(() => {
              let localData = activeCategory === 'agri' ? productsData : activeCategory === 'genset' ? gensetsData : constructionData;
              let apiData = backendProducts.filter(p => {
                const cat = (p.category || '').toLowerCase();
                if (activeCategory === 'agri') return cat.includes('agri');
                if (activeCategory === 'genset') return cat.includes('genset');
                if (activeCategory === 'construction') return cat.includes('construction');
                return false;
              });
              return [...apiData, ...localData];
            })().map((prod, index) => {
              const thumbnailVal = prod.thumbnail || (prod.images && prod.images[0]);
              const cardImageSrc = thumbnailVal?.startsWith('http') ? thumbnailVal : `/${prod.folder}/${thumbnailVal}`;
              
              return (
                <div className="premium-product-card" key={index} onClick={() => openProductModal(prod)}>
                  <div className="card-image-wrapper">
                    <img src={cardImageSrc} alt={prod.name} loading="lazy" />
                    {('stroke' in prod) && (
                      <span className="stroke-badge">{(prod as any).stroke}</span>
                    )}
                  </div>
                  <div className="card-content-wrapper">
                    <h3 className="card-title" title={prod.name}>
                      {renderProductTitle(prod.name)}
                    </h3>
                    <div className="card-footer">
                      <button className="catchy-explore-btn">
                        Explore <ArrowRight size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Modal - Uploaded UI Style */}
      {selectedProduct && (
        <div className="product-modal-overlay">
          <div className="product-modal-fullpage">
            
            <div className="modal-header-uploaded">
              <button className="back-link desktop-only-btn" onClick={closeProductModal}>
                <span className="back-icon-circle">
                  <ChevronLeft size={18} strokeWidth={3} />
                </span>
                Back to Products
              </button>
              <div className="breadcrumb">
                <span>Home</span> <ChevronRight size={14} /> <span>Products</span> <ChevronRight size={14} /> <span className="current">{selectedProduct.name}</span>
              </div>
              <button className="close-modal-btn mobile-only-btn" onClick={closeProductModal} aria-label="Close">
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="modal-content-container">
              
              {/* Left Column: Gallery */}
              <div className="modal-left-column">
                <div className="gallery-layout">
                  
                  {!is360View && (
                    <div className="thumbnails-sidebar">
                      <div className="thumbnails-scroll-area">
                        {(selectedProduct.images || []).map((img: string, idx: number) => (
                          <div 
                            key={idx} 
                            className={`thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                            onClick={() => setActiveImageIndex(idx)}
                          >
                            <img src={img?.startsWith('http') ? img : `/${selectedProduct.folder}/${img}`} alt={`view ${idx}`} />
                          </div>
                        ))}
                      </div>
                      {(selectedProduct.images || []).length > 4 && (
                        <button className="thumb-scroll-down"><ChevronDown size={20}/></button>
                      )}
                    </div>
                  )}

                  <div className="main-image-section">
                    


                    <div 
                      className={`image-display-area ${is360View ? 'is-360' : ''}`}
                      onMouseDown={handleDragStart}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={handleDragStart}
                      onTouchMove={handleDragMove}
                      onTouchEnd={handleDragEnd}
                    >
                      {!is360View && (
                        <button className="nav-circ prev" onClick={handlePrevImage}><ChevronLeft size={24} /></button>
                      )}
                      
                      <img 
                        src={
                          selectedProduct.images && selectedProduct.images[currentDisplayIndex]?.startsWith('http')
                            ? selectedProduct.images[currentDisplayIndex]
                            : `/${selectedProduct.folder}/${selectedProduct.images?.[currentDisplayIndex]}`
                        } 
                        alt={selectedProduct.name} 
                        className="main-display-image"
                        draggable="false"
                        style={zoomStyle}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                      
                      {!is360View && (
                        <button className="nav-circ next" onClick={handleNextImage}><ChevronRight size={24} /></button>
                      )}
                      
                      {is360View && (
                        <div className="drag-hint">
                          <ChevronLeft size={20} /> Drag to rotate <ChevronRight size={20} />
                        </div>
                      )}
                    </div>



                    {!is360View && (
                      <div className="image-dots">
                        {(selectedProduct.images || []).map((_: any, idx: number) => (
                          <div key={idx} className={`dot ${activeImageIndex === idx ? 'active' : ''}`} onClick={() => setActiveImageIndex(idx)} />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="modal-right-column">
                
                {selectedProduct.stroke && (
                  <div className="modal-stroke-badge">
                    {selectedProduct.stroke}
                  </div>
                )}
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

                <div className="product-specs-container" style={{display: 'block'}}>
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
                      <div style={{padding: '20px', color: '#cc3f45', fontWeight: 'bold'}}>
                        No specifications data found for this product.
                      </div>
                    );
                  })()}
                </div>

                <div className="flipkart-actions" style={{ justifyContent: 'center' }}>
                  <a href={getWhatsappLink(selectedProduct.name, selectedProduct.images[0])} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-catchy">
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
      )}
    </div>
  );
};

export default Products;
