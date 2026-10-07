import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Search, User, MapPin, Phone, Mail, Clock, ArrowRight, Leaf, ShieldCheck, Truck, Headset, Handshake, Users, Maximize, Menu, X, Home as HomeIcon, Info, Package, Image as ImageIcon, FileText, ChevronRight, ChevronDown, CreditCard } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import './App.css';

function App() {
  const [activeMap, setActiveMap] = useState<'head' | 'branch'>('head');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <HelmetProvider>
      <Router>
        <div className="app-container">
          {/* Topbar exactly matching the design */}
        <div className="topbar">
          <div className="container">
            <div className="topbar-left">
              <span className="topbar-item" style={{display: 'flex', alignItems: 'center'}}><ShieldCheck size={14} style={{marginRight: '4px'}}/> Trust Since 1960</span>
              <span className="topbar-divider">|</span>
              <span className="topbar-item" style={{display: 'flex', alignItems: 'center'}}><Package size={14} style={{marginRight: '4px'}}/> All Spares Available</span>
              <span className="topbar-divider">|</span>
              <span className="topbar-item" style={{display: 'flex', alignItems: 'center'}}><CreditCard size={14} style={{marginRight: '4px'}}/> EMI Available</span>
            </div>
            <div className="topbar-right">
              <span className="topbar-item">Call Us</span>
              <span className="topbar-contact">+91 70943 41807</span>
              <span className="topbar-divider">|</span>
              <div className="topbar-socials">
                <a href="https://www.instagram.com/reel/DdGPsk2K8P5/" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', alignItems: 'center'}}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="28" height="28" style={{marginLeft: '10px'}} />
                </a>
                <a href="https://www.facebook.com/Paranimillstores/" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', alignItems: 'center'}}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="28" height="28" style={{marginLeft: '10px'}} />
                </a>
                <a href="https://wa.me/917094341807" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', alignItems: 'center'}}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="28" height="28" style={{marginLeft: '10px'}} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="header">
          <div className="container">
            {/* Logo area */}
            <div className="logo-wrapper">
              <img src="/officiallogo.png" alt="Parani Mill Stores Logo" className="header-logo-img" />
              <div className="logo-text-container">
                <span className="header-logo-text" style={{ 
                  fontWeight: 900, 
                  background: 'linear-gradient(135deg, #0a5c36 0%, #1a8f57 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px', 
                  textTransform: 'uppercase',
                  filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.1))'
                }}>
                  Parani Mill Stores
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div className="mobile-menu-inner">
                {/* Mobile Menu Header (only visible when open) */}
                <div className="mobile-menu-header hide-on-desktop">
                  <div className="logo-wrapper">
                    <img src="/officiallogo.png" alt="Parani Mill Stores Logo" className="header-logo-img" />
                    <div className="logo-text-container">
                      <span className="header-logo-text" style={{ 
                        fontWeight: 900, background: 'linear-gradient(135deg, #0a5c36 0%, #1a8f57 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px', textTransform: 'uppercase',
                        filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.1))'
                      }}>Parani Mill Stores</span>
                    </div>
                  </div>
                  <button className="icon-btn mobile-menu-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="mobile-menu-divider hide-on-desktop"></div>

                <ul className="nav-links">
                  <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => isActive ? "active" : ""}><span className="nav-icon-wrapper hide-on-desktop"><HomeIcon size={20}/></span><span className="nav-text">Home</span><span className="nav-chevron hide-on-desktop"><ChevronRight size={18}/></span></NavLink></li>
                  <li><NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}><span className="nav-icon-wrapper hide-on-desktop"><Info size={20}/></span><span className="nav-text">About Us</span><span className="nav-chevron hide-on-desktop"><ChevronRight size={18}/></span></NavLink></li>
                  <li className="nav-item-dropdown">
                    <NavLink to="/products" onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => isActive ? "active dropdown-link" : "dropdown-link"}>
                      <span className="nav-icon-wrapper hide-on-desktop"><Package size={20}/></span>
                      <span className="nav-text">
                        Products
                        <ChevronDown size={14} className="dropdown-arrow hide-on-mobile" style={{marginLeft: '4px', marginTop: '2px'}} />
                      </span>
                      <span className="nav-chevron hide-on-desktop"><ChevronRight size={18}/></span>
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li><NavLink to="/products?category=agri" onClick={() => setIsMobileMenuOpen(false)}>Agricultural Machinery</NavLink></li>
                      <li><NavLink to="/products?category=genset" onClick={() => setIsMobileMenuOpen(false)}>Power Generators</NavLink></li>
                      <li><NavLink to="/products?category=construction" onClick={() => setIsMobileMenuOpen(false)}>Construction Equipment</NavLink></li>
                    </ul>
                  </li>
                  <li><NavLink to="/blogs" onClick={() => setIsMobileMenuOpen(false)}><span className="nav-icon-wrapper hide-on-desktop"><FileText size={20}/></span><span className="nav-text">Blogs</span><span className="nav-chevron hide-on-desktop"><ChevronRight size={18}/></span></NavLink></li>
                  <li><NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}><span className="nav-icon-wrapper hide-on-desktop"><Phone size={20}/></span><span className="nav-text">Contact Us</span><span className="nav-chevron hide-on-desktop"><ChevronRight size={18}/></span></NavLink></li>
                </ul>

                <div className="mobile-menu-footer hide-on-desktop">
                  <div className="mobile-footer-bg"></div>
                  <div className="mobile-footer-text">
                  </div>
                </div>
              </div>
            </nav>

            {/* Icons */}
            <div className="header-icons">
              <button className="icon-btn mobile-menu-btn hide-on-desktop" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Placeholders for other routes */}
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Modern Footer Redesign - Ultra Premium Dark Theme */}
        <footer className="footer dark-theme">
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="footer-top">
              
              {/* Column 1: Brand & Badges */}
              <div className="footer-brand">
                <div className="footer-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '0 0 15px 0' }}>
                  <img src="/officiallogo.png" alt="Parani Mill Stores Logo" className="footer-logo-img pulse-zoom" style={{ height: '60px', width: '60px', objectFit: 'contain', borderRadius: '50%', background: 'white', padding: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} />
                  <span className="shimmer-text" style={{ 
                    fontSize: '1.7rem', 
                    fontWeight: 900, 
                    letterSpacing: '0.5px', 
                    textTransform: 'uppercase', 
                    lineHeight: 1.1,
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                  }}>
                    Parani<br/>Mill Stores
                  </span>
                </div>
                <p className="footer-desc">
                  Serving Madurai with quality agricultural machinery, construction equipment, and power tools since 1960.
                </p>


                <div className="footer-socials-row">
                  <div className="footer-socials">
                    <a href="https://www.instagram.com/reel/DdGPsk2K8P5/" target="_blank" rel="noopener noreferrer" className="footer-social-icon ig" style={{border: 'none', background: 'transparent', padding: 0, marginRight: '10px'}}>
                      <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="white" />
                        <g transform="scale(0.65) translate(6.46, 6.46)">
                          <defs>
                            <linearGradient id="igGradFooter" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f09433" />
                              <stop offset="25%" stopColor="#e6683c" />
                              <stop offset="50%" stopColor="#dc2743" />
                              <stop offset="75%" stopColor="#cc2366" />
                              <stop offset="100%" stopColor="#bc1888" />
                            </linearGradient>
                          </defs>
                          <rect width="24" height="24" rx="6" fill="url(#igGradFooter)" />
                          <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="white" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3.5" fill="none" stroke="white" strokeWidth="2"/>
                          <circle cx="16.5" cy="7.5" r="1.2" fill="white"/>
                        </g>
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/Paranimillstores/" target="_blank" rel="noopener noreferrer" className="footer-social-icon fb" style={{border: 'none', background: 'transparent', padding: 0, marginRight: '10px'}}>
                      <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="white" />
                        <g transform="scale(0.65) translate(6.46, 6.46)">
                          <rect width="24" height="24" rx="4" fill="#1877F2"/>
                          <path d="M15.4 24V14.71h3.12l.47-3.62h-3.59V8.78c0-1.05.29-1.76 1.79-1.76h1.91V3.78A25.6 25.6 0 0 0 16.32 3.6c-2.75 0-4.63 1.68-4.63 4.76v2.73H8.56v3.62h3.13V24h3.71z" fill="white"/>
                        </g>
                      </svg>
                    </a>
                    <a href="https://wa.me/917094341807" target="_blank" rel="noopener noreferrer" className="footer-social-icon wa" style={{border: 'none', background: 'transparent', padding: 0}}>
                      <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="white" />
                        <g transform="scale(0.65) translate(6.46, 6.46)">
                          <circle cx="12" cy="12" r="9" fill="white"/>
                          <path d="M12.04 2.05h-.01c-5.46 0-9.91 4.45-9.91 9.91 0 1.74.45 3.44 1.3 4.93L2 21.95l5.22-1.37c1.45.81 3.1 1.24 4.81 1.24h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.9-9.91-9.9zm5.48 14.18c-.23.65-1.33 1.23-1.84 1.28-.48.04-1.09.15-3.53-.86-2.95-1.22-4.84-4.24-4.99-4.44-.15-.2-1.19-1.58-1.19-3.02 0-1.44.75-2.15 1.02-2.45.27-.29.58-.37.77-.37.19 0 .38.01.55.02.18.01.43-.07.67.51.24.6.82 2.02.9 2.19.08.17.13.37.02.57-.11.2-.17.32-.34.52-.17.2-.36.43-.51.6-.17.18-.36.38-.15.74.21.36.94 1.54 2.01 2.5 1.38 1.24 2.54 1.62 2.9 1.8.36.17.57.15.79-.11.21-.26.91-1.06 1.15-1.42.24-.36.49-.3.83-.17.34.13 2.16 1.02 2.53 1.2.37.18.62.27.71.42.09.15.09.89-.14 1.54z" fill="#25D366"/>
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div className="emi-pill">
                    <div className="emi-pill-icon">%</div>
                    <span className="emi-pill-text">EMI Available</span>
                  </div>
                </div>
                
                <div className="truck-delivery-banner" style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.08)', padding: '12px 20px', borderRadius: '8px', borderLeft: '4px solid #fbaf00', width: 'fit-content', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
                  <span className="delivery-text-sweep" style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                    Delivery Available: <span>Madurai & Nearby Districts</span>
                  </span>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="footer-links-col">
                <h3 className="footer-heading">Quick Links</h3>
                <ul className="footer-links">
                  <li><NavLink to="/"><ArrowRight size={14} /> Home</NavLink></li>
                  <li><NavLink to="/about"><ArrowRight size={14} /> About Us</NavLink></li>
                  <li><NavLink to="/products"><ArrowRight size={14} /> Products</NavLink></li>
                  <li><NavLink to="/blogs"><ArrowRight size={14} /> Blogs</NavLink></li>
                  <li><NavLink to="/contact"><ArrowRight size={14} /> Contact Us</NavLink></li>
                </ul>
              </div>

              {/* Column 3: Contact Info */}
              <div className="footer-contact-col">
                <h3 className="footer-heading">Contact Us</h3>
                <div className="footer-contact-item">
                  <div className="footer-icon-wrapper">
                    <MapPin size={16} className="footer-icon" />
                  </div>
                  <div className="footer-contact-text">
                    <strong style={{ color: '#fbaf00', display: 'block', marginBottom: '2px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Head Office:</strong>
                    No.21/37, West Marret Street,<br/>Opp To Kattabomman Statue,<br/>Madurai - 625001.
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-icon-wrapper">
                    <MapPin size={16} className="footer-icon" />
                  </div>
                  <div className="footer-contact-text">
                    <strong style={{ color: '#fbaf00', display: 'block', marginBottom: '2px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Branch Office:</strong>
                    135/3B1, Bye Pass Road,<br/>(Near D-Mart), Avaniapuram,<br/>Madurai - 625012.
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-icon-wrapper">
                    <Phone size={16} className="footer-icon" />
                  </div>
                  <div className="footer-phones">
                    <span className="phone-primary">+91 70943 41807</span>
                    <span className="phone-secondary">+91 90923 41807</span>
                    <span className="phone-secondary">+91 95008 23452</span>
                  </div>
                </div>
              </div>

              {/* Column 4: Map Card */}
              <div className="footer-map-col">
                <div className="footer-map-card">
                  <div className="footer-map-header">
                    <div className="map-header-title">
                      <MapPin size={18} className="map-pin-red" fill="#cc3f45" color="white" /> Find Us on Google Maps
                    </div>
                  </div>
                  
                  {/* Map Toggle Tabs */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button 
                      onClick={() => setActiveMap('head')} 
                      style={{ flex: 1, padding: '6px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid', borderColor: activeMap === 'head' ? '#cc3f45' : '#ddd', borderRadius: '6px', cursor: 'pointer', background: activeMap === 'head' ? '#cc3f45' : 'white', color: activeMap === 'head' ? 'white' : '#555', transition: 'all 0.2s' }}
                    >
                      HEAD OFFICE
                    </button>
                    <button 
                      onClick={() => setActiveMap('branch')} 
                      style={{ flex: 1, padding: '6px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid', borderColor: activeMap === 'branch' ? '#cc3f45' : '#ddd', borderRadius: '6px', cursor: 'pointer', background: activeMap === 'branch' ? '#cc3f45' : 'white', color: activeMap === 'branch' ? 'white' : '#555', transition: 'all 0.2s' }}
                    >
                      BRANCH
                    </button>
                  </div>

                  <div className="footer-map-wrapper">
                    <a 
                      href={activeMap === 'head' 
                        ? "https://www.google.com/maps/place/Parani+Mill+Stores/@9.9169815,78.1121363,704m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b00c580bfba178f:0x66bfbe1d0a2a8594!8m2!3d9.9169815!4d78.1121363!16s%2Fg%2F1tdj2m_d?entry=ttu&g_ep=EgoyMDI2MDkyNy4wIKXMDSoASAFQAw%3D%3D" 
                        : "https://www.google.com/maps/place/Parani+Mill+Stores+(+Branch+Office+)/@9.8854899,78.1180296,704m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b00c5942e848b8d:0x49f23ecb84aaac9d!8m2!3d9.8854899!4d78.1180296!16s%2Fg%2F11ygxz1bll?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10}}>
                    </a>
                    <iframe 
                      src={activeMap === 'head' 
                        ? "https://maps.google.com/maps?q=9.9169815,78.1121363&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                        : "https://maps.google.com/maps?q=9.8854899,78.1180296&t=&z=16&ie=UTF8&iwloc=&output=embed"} 
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      allowFullScreen={true} 
                      loading="lazy">
                    </iframe>
                  </div>
                  <a 
                    href={activeMap === 'head' 
                        ? "https://www.google.com/maps/place/Parani+Mill+Stores/@9.9169815,78.1121363,704m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b00c580bfba178f:0x66bfbe1d0a2a8594!8m2!3d9.9169815!4d78.1121363!16s%2Fg%2F1tdj2m_d?entry=ttu&g_ep=EgoyMDI2MDkyNy4wIKXMDSoASAFQAw%3D%3D" 
                        : "https://www.google.com/maps/place/Parani+Mill+Stores+(+Branch+Office+)/@9.8854899,78.1180296,704m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b00c5942e848b8d:0x49f23ecb84aaac9d!8m2!3d9.8854899!4d78.1180296!16s%2Fg%2F11ygxz1bll?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{textDecoration: 'none'}}>
                    <button className="get-directions-btn">
                      <MapPin size={16} /> Get Directions <ArrowRight size={16} className="get-directions-arrow" />
                    </button>
                  </a>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <div className="footer-contact-item" style={{ marginBottom: '15px' }}>
                    <div className="footer-icon-wrapper">
                      <Mail size={16} className="footer-icon" />
                    </div>
                    <span className="footer-contact-text">paranimillstores@gmail.com</span>
                  </div>
                  <div className="footer-contact-item" style={{ marginBottom: '0' }}>
                    <div className="footer-icon-wrapper">
                      <Clock size={16} className="footer-icon" />
                    </div>
                    <span className="footer-contact-text">Mon - Sat : 10:00 AM - 7:00 PM<br/>Sunday : Closed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Social Media Pill */}
          <div className="hide-on-desktop">
            <div className="footer-social-pill-container">
            <div className="social-pill">
              <a href="https://www.instagram.com/reel/DdGPsk2K8P5/" target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="25" height="25" className="footer-icon-pulse" style={{ animationDelay: '0s' }} />
              </a>
              <a href="https://www.facebook.com/Paranimillstores/" target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="25" height="25" className="footer-icon-pulse" style={{ animationDelay: '-1.8s' }} />
              </a>
              <a href="https://wa.me/917094341807" target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="27" height="27" className="footer-icon-pulse" style={{ animationDelay: '-1.6s' }} />
              </a>
            </div>
          </div>
          </div>

          <div className="footer-bottom-bar">
            <div className="container">
              <div className="footer-bottom-content">
                <div className="footer-bottom-left">
                  &copy; {new Date().getFullYear()} Parani Mill Stores. All Rights Reserved.
                </div>
                
                <div className="footer-bottom-badges">
                  <div className="bottom-badge-item">
                    <div className="bottom-badge-icon"><ShieldCheck size={16} /></div>
                    <span className="bottom-badge-text">Genuine<br/>Products</span>
                  </div>
                  <div className="bottom-badge-item">
                    <div className="bottom-badge-icon"><Truck size={16} /></div>
                    <span className="bottom-badge-text">Reliable<br/>Delivery</span>
                  </div>
                  <div className="bottom-badge-item">
                    <div className="bottom-badge-icon"><Headset size={16} /></div>
                    <span className="bottom-badge-text">Dedicated<br/>Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
