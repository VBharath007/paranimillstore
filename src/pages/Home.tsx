import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, Leaf, Settings, ShieldCheck, Timer, 
  ChevronLeft, ChevronRight, CheckCircle, Package, 
  Users, Award, Truck, Wrench, Headphones, Cog, Shield, Star, Quote,
  CircleDollarSign, Search, ThumbsUp, Handshake, Coins, Share2
} from 'lucide-react';
import './Home.css';

const CustomHeadphones = ({ size = 24, strokeWidth = 2, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
    <rect x="2" y="14" width="4" height="6" rx="2" />
    <rect x="18" y="14" width="4" height="6" rx="2" />
  </svg>
);

const CustomGear = ({ size = 24, strokeWidth = 2, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7.5" />
    <path d="M12 2v2.5" />
    <path d="M12 19.5V22" />
    <path d="M4.93 4.93l1.77 1.77" />
    <path d="M17.3 17.3l1.77 1.77" />
    <path d="M2 12h2.5" />
    <path d="M19.5 12H22" />
    <path d="M4.93 19.07l1.77-1.77" />
    <path d="M17.3 6.7l1.77-1.77" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M14.5 12H19.5" />
    <path d="M10.75 14.16L8.25 18.5" />
    <path d="M10.75 9.84L8.25 5.5" />
  </svg>
);

const heroImages = ['/hb1.webp', '/hb2.webp', '/hb3.webp', '/gensetbanner.webp', '/hb5.webp'];

const RealisticCrown = () => (
  <svg width="65" height="50" viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff0a8" />
        <stop offset="30%" stopColor="#d4af37" />
        <stop offset="70%" stopColor="#aa7c11" />
        <stop offset="100%" stopColor="#f8e58c" />
      </linearGradient>
      
      <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8a610c" />
        <stop offset="20%" stopColor="#e8c85c" />
        <stop offset="50%" stopColor="#fff1aa" />
        <stop offset="80%" stopColor="#e8c85c" />
        <stop offset="100%" stopColor="#8a610c" />
      </linearGradient>

      <radialGradient id="goldBall" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#b8860b" />
      </radialGradient>

      <filter id="dropShadowCrown" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.5"/>
      </filter>
    </defs>

    <g filter="url(#dropShadowCrown)">
      {/* Back inner side of the crown */}
      <path d="M 20 60 L 15 40 L 35 45 L 50 35 L 65 45 L 85 40 L 80 60 Z" fill="#6b4c06" />

      {/* Main Front Body */}
      <path d="M 18 60 L 5 25 L 30 40 L 50 15 L 70 40 L 95 25 L 82 60 Z" fill="url(#goldLight)" />
      
      {/* Base Rim */}
      <rect x="15" y="60" width="70" height="8" rx="2" fill="url(#goldBase)" />
      {/* Bottom Rim */}
      <rect x="18" y="70" width="64" height="4" rx="1" fill="url(#goldBase)" />
      
      {/* Balls on tips */}
      <circle cx="5" cy="25" r="5" fill="url(#goldBall)" />
      <circle cx="30" cy="40" r="4" fill="url(#goldBall)" />
      <circle cx="50" cy="15" r="6" fill="url(#goldBall)" />
      <circle cx="70" cy="40" r="4" fill="url(#goldBall)" />
      <circle cx="95" cy="25" r="5" fill="url(#goldBall)" />
    </g>
  </svg>
);

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const wcuRef = React.useRef<HTMLElement>(null);
  const [wcuVisible, setWcuVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setWcuVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (wcuRef.current) {
      observer.observe(wcuRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsRef.current) {
      const card = reviewsRef.current.children[0] as HTMLElement;
      const scrollAmount = card.clientWidth + 25; // card width + gap
      reviewsRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReviewScroll = () => {
    if (reviewsRef.current) {
      const scrollPosition = reviewsRef.current.scrollLeft;
      const card = reviewsRef.current.children[0] as HTMLElement;
      const cardWidth = card.clientWidth + 25;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeReviewIndex) {
        setActiveReviewIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>Parani Mill Stores | Best Agricultural Machinery & Power Generators in Madurai</title>
        <meta name="description" content="Parani Mill Stores, established in 1960, is a trusted supplier of agricultural and construction equipment in Madurai, Tamil Nadu. We deal in agricultural sprayers, water pumps, petrol brush cutters, earth augers, power weeders, HTP sprayers, concrete vibrators, earth rammers, petrol gensets, diesel engines, agricultural hand tools, car washers and related equipment." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Parani Mill Stores",
              "description": "Leading dealer for agricultural machinery, brush cutters, power weeders, gensets, and construction equipment.",
              "areaServed": [
                { "@type": "City", "name": "Madurai" },
                { "@type": "City", "name": "Virudhunagar" },
                { "@type": "City", "name": "Theni" },
                { "@type": "City", "name": "Sivakasi" },
                { "@type": "City", "name": "Dindigul" },
                { "@type": "City", "name": "Sivaganga" },
                { "@type": "City", "name": "Ramanathapuram" }
              ],
              "knowsAbout": [
                "Agricultural Sprayers", "Petrol Brush Cutters", "Earth Augers", "Power Weeders", "Power Generators", "Construction Equipment"
              ]
            }
          `}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: 0 }}>
        <div className="hero-slider">
          {heroImages.map((img, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img loading="lazy" src={img} alt={`Hero ${index + 1}`} className="hero-bg-image" />
            </div>
          ))}

          {/* Navigation Controls */}
          <button className="slider-btn prev-btn" onClick={prevSlide}>
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
          <button className="slider-btn next-btn" onClick={nextSlide}>
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>

          {/* Indicators */}
          <div className="slider-indicators">
            {heroImages.map((_, index) => (
              <button 
                key={index} 
                className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <div className="section-label">WHAT WE OFFER</div>
            <h2 className="section-title">Our Product <span>Categories</span></h2>
            <p className="section-subtitle">A wide range of products for all your agriculture and construction needs.</p>
          </div>

          <div className="product-categories-grid">
            {/* Card 1: Agricultural Machinery */}
            <div className="category-card card-agri">
              <div className="category-card-content">
                <h3 className="category-title">Agricultural<br/>Machinery</h3>
                <p className="category-subtitle">High-performance tillers & weeders.</p>
              </div>
              <div className="category-image-wrapper wrapper-agri">
                <img loading="lazy" src="/parani products webp/POWER WEEDER - RAPL-RH-700G PREMIUM.webp" alt="Agricultural Machinery" className="category-image image-agri" />
              </div>
            </div>
            
            {/* Card 2: Earth Auger */}
            <div className="category-card card-const">
              <div className="category-card-content">
                <h3 className="category-title">Earth<br/>Auger</h3>
                <p className="category-subtitle">Heavy-duty machinery for tough jobs.</p>
              </div>
              <div className="category-image-wrapper wrapper-const">
                <img loading="lazy" src="/parani products webp/EARTH AUGER - RAPL - EA - 6310.webp" alt="Construction Equipment" className="category-image image-const" />
              </div>
            </div>
            
            {/* Card 3: Gensets */}
            <div className="category-card card-gen">
              <div className="category-card-content">
                <h3 className="category-title">Power<br/>Generators</h3>
                <p className="category-subtitle">Reliable power for continuous performance.</p>
              </div>
              <div className="lightning-icon">
                 <svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg" fill="#d8f2e2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                 </svg>
              </div>
              <div className="category-image-wrapper wrapper-gen">
                <img loading="lazy" src="/parani products webp/168F ENGINE - RAPL - GE - 168F.webp" alt="Power Generators" className="category-image image-gen" />
              </div>
            </div>
            
            {/* Card 4: Pumps & Motors */}
            <div className="category-card card-pump">
              <div className="category-card-content">
                <h3 className="category-title">Pumps & Motors</h3>
                <p className="category-subtitle">Efficient water solutions for agriculture and beyond.</p>
              </div>
              <div className="category-image-wrapper wrapper-pump">
                <img loading="lazy" src="/parani products webp/WATER PUMP - RAPL-WP-30R.webp" alt="Pumps & Motors" className="category-image image-pump" />
              </div>
            </div>
          </div>
          <div className="section-footer">
            <Link to="/products?category=agri" className="btn-outline-red" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              View All Products <ArrowRight size={16} style={{marginLeft: '8px'}}/>
            </Link>
          </div>
        </div>
      </section>


      {/* Why Choose Us Design */}
      <section 
        className={`why-choose-us-section section-padding ${wcuVisible ? 'animate-in' : ''}`}
        ref={wcuRef}
      >
        <div className="wcu-bg-top-left"></div>
        <div className="wcu-bg-bottom-right"></div>
        <div className="wcu-bg-farm"></div>
        
        <div className="container relative-z">
          <div className="wcu-header">
            <div className="wcu-brand-line">
              <span className="line"></span>
              <span className="brand-text">PARANI MILL STORES</span>
              <span className="line"></span>
            </div>
            <h2 className="wcu-title">WHY CHOOSE <span>US?</span></h2>
            <p className="wcu-subtitle">TRUSTED SOLUTIONS FOR A STRONGER TOMORROW</p>
          </div>

          <div className="wcu-main-layout">
            {/* Left Items */}
            <div className="wcu-column wcu-left">
              <div className="wcu-item">
                <div className="wcu-item-number">01</div>
                <div className="wcu-item-content wcu-green">
                  <div className="wcu-icon"><Award size={28} /></div>
                  <div className="wcu-text">
                    <h4>Quality Products</h4>
                    <p>Trusted and durable products<br/>for better performance.</p>
                  </div>
                </div>
                <div className="wcu-connector left-connector">
                   <div className="connector-dot"></div>
                   <div className="connector-line"></div>
                   <div className="connector-dot-end"></div>
                </div>
              </div>

              <div className="wcu-item wcu-item-middle">
                <div className="wcu-item-number">02</div>
                <div className="wcu-item-content wcu-gold">
                  <div className="wcu-icon"><Coins size={28} /></div>
                  <div className="wcu-text">
                    <h4>Affordable Price</h4>
                    <p>Best value for your investment<br/>without compromise.</p>
                  </div>
                </div>
                <div className="wcu-connector left-connector">
                   <div className="connector-dot"></div>
                   <div className="connector-line"></div>
                   <div className="connector-dot-end"></div>
                </div>
              </div>

              <div className="wcu-item">
                <div className="wcu-item-number">03</div>
                <div className="wcu-item-content wcu-green">
                  <div className="wcu-icon"><ShieldCheck size={28} /></div>
                  <div className="wcu-text">
                    <h4>Reliability</h4>
                    <p>A dependable partner<br/>for generations.</p>
                  </div>
                </div>
                <div className="wcu-connector left-connector">
                   <div className="connector-dot"></div>
                   <div className="connector-line"></div>
                   <div className="connector-dot-end"></div>
                </div>
              </div>
            </div>

            {/* Center Badge */}
            <div className="wcu-center">
              <div className="wcu-badge-outer">
                <div className="wcu-badge-middle">
                  <div className="wcu-badge-inner">
                    <div className="wcu-realistic-crown">
                       <RealisticCrown />
                    </div>
                    <div className="wcu-since-line">
                      <span className="since-line"></span>
                      SINCE
                      <span className="since-line"></span>
                    </div>
                    <div className="wcu-year">1960</div>
                    <div className="wcu-trust-title">65+ Years<br/>of Trust</div>
                    <p className="wcu-trust-desc hide-on-mobile">
                      Serving customers since 1960<br/>with experience and<br/>dedication.
                    </p>
                    
                  </div>
                </div>
                {/* External mass decoration */}
                <div className="wcu-badge-mass-icon">
                  <Settings size={55} fill="#fcdb5a" color="#c79018" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Right Items */}
            <div className="wcu-column wcu-right">
              <div className="wcu-item">
                <div className="wcu-connector right-connector">
                   <div className="connector-dot-end"></div>
                   <div className="connector-line"></div>
                   <div className="connector-dot"></div>
                </div>
                <div className="wcu-item-number">04</div>
                <div className="wcu-item-content wcu-green">
                  <div className="wcu-icon"><CustomHeadphones size={28} /></div>
                  <div className="wcu-text">
                    <h4>Best Service</h4>
                    <p>Prompt support and<br/>expert guidance.</p>
                  </div>
                </div>
              </div>

              <div className="wcu-item wcu-item-middle">
                <div className="wcu-connector right-connector">
                   <div className="connector-dot-end"></div>
                   <div className="connector-line"></div>
                   <div className="connector-dot"></div>
                </div>
                <div className="wcu-item-number">05</div>
                <div className="wcu-item-content wcu-gold">
                  <div className="wcu-icon"><Search size={28} /></div>
                  <div className="wcu-text">
                    <h4>Transparency</h4>
                    <p>Clear information.<br/>Honest business.</p>
                  </div>
                </div>
              </div>

              <div className="wcu-item">
                <div className="wcu-connector right-connector">
                   <div className="connector-dot-end"></div>
                   <div className="connector-line"></div>
                   <div className="connector-dot"></div>
                </div>
                <div className="wcu-item-number">06</div>
                <div className="wcu-item-content wcu-green">
                  <div className="wcu-icon"><ThumbsUp size={28} /></div>
                  <div className="wcu-text">
                    <h4 style={{ lineHeight: '1.1', marginBottom: '3px' }}>100% Customer<br/>Satisfaction</h4>
                    <p>Your trust is our greatest<br/>achievement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="wcu-bottom-features">
            <div className="wcu-feature">
              <Leaf size={20} color="#2b5639" strokeWidth={2} />
              <span>STRONG ROOTS</span>
            </div>
            <div className="wcu-feature-divider"></div>
            <div className="wcu-feature">
              <Users size={20} color="#2b5639" strokeWidth={2} />
              <span>VALUED CUSTOMERS</span>
            </div>
            <div className="wcu-feature-divider"></div>
            <div className="wcu-feature">
              <Leaf size={20} color="#2b5639" strokeWidth={2} />
              <span>BRIGHTER TOMORROW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services - Ribbon Cards Design */}
      <section className="section-padding" style={{ backgroundColor: '#f5f7f9' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">HOW WE HELP</div>
            <h2 className="section-title">Our <span>Services</span></h2>
          </div>

          <div className="ribbon-cards-grid">
            {/* Card 1 */}
            <div className="ribbon-card color-green">
              <div className="card-icon-ring">
                <div className="card-icon"><Truck size={35} strokeWidth={1.5}/></div>
              </div>
              <div className="card-corner"></div>
              <div className="card-content">
                <div className="step-title">
                  <span className="step-text">STEP</span>
                  <span className="step-num">01</span>
                </div>
                <h4>Equipment Delivery</h4>
                <p>Reliable equipment, delivered on time. We ensure you get exactly what you need, right when you need it.</p>
                <div className="card-dots">
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="ribbon-card color-gold">
              <div className="card-icon-ring">
                <div className="card-icon"><Wrench size={35} strokeWidth={1.5}/></div>
              </div>
              <div className="card-corner"></div>
              <div className="card-content">
                <div className="step-title">
                  <span className="step-text">STEP</span>
                  <span className="step-num">02</span>
                </div>
                <h4>Expert Installation</h4>
                <p>Expert setup for a smooth start. Our technicians ensure proper installation for optimal performance.</p>
                <div className="card-dots">
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="ribbon-card color-green">
              <div className="card-icon-ring">
                <div className="card-icon"><CustomHeadphones size={35} strokeWidth={1.5}/></div>
              </div>
              <div className="card-corner"></div>
              <div className="card-content">
                <div className="step-title">
                  <span className="step-text">STEP</span>
                  <span className="step-num">03</span>
                </div>
                <h4>Dedicated Support</h4>
                <p>Helpful, dedicated support whenever you need it. Our service team is always on standby to assist you.</p>
                <div className="card-dots">
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="ribbon-card color-gold">
              <div className="card-icon-ring">
                <div className="card-icon"><CustomGear size={35} strokeWidth={1.5}/></div>
              </div>
              <div className="card-corner"></div>
              <div className="card-content">
                <div className="step-title">
                  <span className="step-text">STEP</span>
                  <span className="step-num">04</span>
                </div>
                <h4>Maintenance Packages</h4>
                <p>Keep your equipment running at its absolute best with our comprehensive maintenance packages.</p>
                <div className="card-dots">
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="customer-reviews-section section-padding">
        <div className="cr-bg-leaves"></div>
        <div className="container relative-z">
          <div className="cr-header">
            <div className="wcu-brand-line">
              <span className="line"></span>
              <span className="brand-text">CUSTOMER REVIEWS</span>
              <span className="line"></span>
            </div>
            <h2 className="cr-title">What <span className="cr-title-highlight">Our Customers</span> Say</h2>
            <p className="cr-subtitle">65+ Years of Trust. Empowering Madurai with premium agricultural and construction machinery since 1960.</p>
          </div>

          <div className="cr-carousel-container">
            <button className="cr-nav-btn cr-prev" onClick={() => scrollReviews('left')}><ChevronLeft size={24} /></button>
            
            <div className="cr-cards-wrapper" ref={reviewsRef} onScroll={handleReviewScroll}>
              {/* Card 1 */}
              <div className="cr-card">
                <div className="cr-card-header">
                  <div className="cr-user-info">
                    <img loading="lazy" src="/avatar1.png" alt="Rajesh Kumar" className="cr-avatar" />
                    <div>
                      <h4 className="cr-name">Rajesh Kumar</h4>
                      <p className="cr-role">Farm Owner</p>
                    </div>
                  </div>
                  <div className="cr-google-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="cr-rating">
                  <div className="cr-stars">
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                  </div>
                  <span className="cr-rating-text">4.8 • 3 months ago</span>
                </div>
                <p className="cr-review-text">
                  "Parani Mill Stores has been our go-to for all agricultural machinery. The power weeders are top quality and their delivery is always exactly on time."
                </p>
                <div className="cr-card-footer">

                  <Quote className="cr-quote-bg" size={50} />
                </div>
              </div>

              {/* Card 2 (Center, Highlighted) */}
              <div className="cr-card cr-card-highlight">
                <div className="cr-card-header">
                  <div className="cr-user-info">
                    <img loading="lazy" src="/avatar2.png" alt="Senthil Nathan" className="cr-avatar" />
                    <div>
                      <h4 className="cr-name">Senthil Nathan</h4>
                      <p className="cr-role">Contractor</p>
                    </div>
                  </div>
                  <div className="cr-google-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="cr-rating">
                  <div className="cr-stars">
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                  </div>
                  <span className="cr-rating-text">4.9 • 1 month ago</span>
                </div>
                <p className="cr-review-text">
                  "Exceptional service! Their team guided me perfectly to buy the right earth auger and genset for my construction site. Pricing was fair and transparent."
                </p>
                <div className="cr-card-footer">

                  <Quote className="cr-quote-bg" size={50} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="cr-card">
                <div className="cr-card-header">
                  <div className="cr-user-info">
                    <img loading="lazy" src="/avatar3.png" alt="Murugan" className="cr-avatar" />
                    <div>
                      <h4 className="cr-name">Murugan</h4>
                      <p className="cr-role">Agriculturalist</p>
                    </div>
                  </div>
                  <div className="cr-google-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="cr-rating">
                  <div className="cr-stars">
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                  </div>
                  <span className="cr-rating-text">4.7 • 2 months ago</span>
                </div>
                <p className="cr-review-text">
                  "I've been a loyal customer for over 10 years now. You simply cannot find better prices or a more helpful after-sales support team anywhere else."
                </p>
                <div className="cr-card-footer">

                  <Quote className="cr-quote-bg" size={50} />
                </div>
              </div>

              {/* Card 4 */}
              <div className="cr-card">
                <div className="cr-card-header">
                  <div className="cr-user-info">
                    <img loading="lazy" src="/avatar4.png" alt="Karthik Subramanian" className="cr-avatar" />
                    <div>
                      <h4 className="cr-name">Karthik Subramanian</h4>
                      <p className="cr-role">Business Owner</p>
                    </div>
                  </div>
                  <div className="cr-google-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="cr-rating">
                  <div className="cr-stars">
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                  </div>
                  <span className="cr-rating-text">4.8 • 4 months ago</span>
                </div>
                <p className="cr-review-text">
                  "Sourced multiple water pumps for my distribution network. The team was incredibly knowledgeable and gave me the best bulk deal."
                </p>
                <div className="cr-card-footer">

                  <Quote className="cr-quote-bg" size={50} />
                </div>
              </div>

              {/* Card 5 */}
              <div className="cr-card">
                <div className="cr-card-header">
                  <div className="cr-user-info">
                    <img loading="lazy" src="/avatar5.png" alt="Vetrivel" className="cr-avatar" />
                    <div>
                      <h4 className="cr-name">Vetrivel</h4>
                      <p className="cr-role">Farmer</p>
                    </div>
                  </div>
                  <div className="cr-google-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <div className="cr-rating">
                  <div className="cr-stars">
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                    <Star size={16} fill="#fbbc04" color="#fbbc04" strokeWidth={0} />
                  </div>
                  <span className="cr-rating-text">4.9 • 6 months ago</span>
                </div>
                <p className="cr-review-text">
                  "Bought a chaff cutter and it works flawlessly. The staff took the time to explain how to maintain it properly. Highly recommended for farmers in Madurai."
                </p>
                <div className="cr-card-footer">

                  <Quote className="cr-quote-bg" size={50} />
                </div>
              </div>
            </div>
            
            <button className="cr-nav-btn cr-next" onClick={() => scrollReviews('right')}><ChevronRight size={24} /></button>
          </div>
          
          <div className="cr-dots">
            {[0, 1, 2, 3, 4].map(idx => (
              <span 
                key={idx} 
                className={`cr-dot ${activeReviewIndex === idx ? 'cr-dot-active' : ''}`}
                onClick={() => {
                  if (reviewsRef.current) {
                    const card = reviewsRef.current.children[0] as HTMLElement;
                    const cardWidth = card.clientWidth + 25;
                    reviewsRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                  }
                }}
              ></span>
            ))}
          </div>


        </div>
      </section>

    </div>
  );
};

export default Home;
