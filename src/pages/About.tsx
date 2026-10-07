import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, History, Award, TrendingUp, CheckCircle, Gem, Users, BarChart2, ArrowRight, Quote, Settings, Leaf, Eye, Target, Store, Star, Lightbulb, HeartHandshake, Handshake } from 'lucide-react';
import './About.css';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {displayText}
    </>
  );
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-now');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.15 });

    // Select all animated elements on the page
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
      el.classList.add('animation-paused');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <Helmet>
        <title>About Us | Parani Mill Stores - 65+ Years of Trust</title>
        <meta name="description" content="Since 1960, Parani Mill Stores has been the authorized stockists for reputed brands including Jawan, Really and Perfect Equipments. We are a trusted supplier of agricultural and construction equipment in Madurai, serving wholesale and retail customers." />
      </Helmet>
      {/* 1. Main Story */}
      <section className="premium-history-section section-padding">
        {/* Background Elements */}

        <div className="container relative z-10">
          <div className="section-header centered fade-in-up">
            <h2 className="pill-title">
              <TypewriterText text="A Legacy of Trust" />
            </h2>
          </div>
          
          <div className="premium-history-grid">
            
            {/* Left Content */}
            <div className="history-content-left slide-in-left">
              <div className="history-tag">
                OUR STORY <div className="red-dash"></div>
              </div>
              
              <div className="history-founder-quote">
                <Quote className="quote-icon" size={48} fill="#e2e8f0" stroke="none" />
                <p>
                  Founded by the visionary{' '}<span className="founder-name">S. Rathinam,</span><br />
                  Parani Mill Stores was built on a simple yet unwavering commitment to providing quality products and dependable service that customers can truly rely on.
                </p>
              </div>
              
              <p className="history-body-text">
                What began as a humble business has grown alongside our customers, adapting to technological advancements and modern requirements. Throughout our evolution, we have stayed true to the core values instilled by our founder.
              </p>
              <p className="history-highlight-text">
                We are a trusted wholesaler and supplier across Tamil&nbsp;Nadu, offering quality products at&nbsp;<span className="price-highlight">Fair Market Prices.</span>
              </p>
              
            </div>

            {/* Right Content */}
            <div className="history-image-right slide-in-right">
              <div className="history-image-container">
                <div className="history-image-backdrop"></div>
                <div className="history-img-frame">
                  <img loading="lazy" src="/pm opening.png" alt="Parani Mill Stores Legacy" className="history-main-img" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=1000' }} />
                </div>
                
                <div className="premium-trust-badge">
                  <div className="badge-icon-wrapper">
                    <div className="logo-white-circle">
                      <img loading="lazy" src="/officiallogo.png" alt="Parani Mill Logo" className="badge-logo-img" />
                    </div>
                  </div>
                  <div className="badge-text-content">
                    <div className="badge-top-line">
                      <span className="since-text">SINCE</span>
                    </div>
                    <div className="badge-year">1960</div>
                    <div className="badge-bottom-text">YEARS OF TRUST</div>
                  </div>
                  <Leaf className="badge-leaf-watermark" size={100} />
                </div>
              </div>
            </div>

          </div>
          

        </div>
      </section>

      {/* 3. Our Journey */}
      <section className="journey-section relative overflow-hidden bg-white" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        {/* Decorative corner blobs */}
        <div className="journey-blob top-left"></div>
        <div className="journey-blob bottom-right"></div>
        
        <div className="container relative z-10">
          <div className="section-header centered">
            <span className="unified-tag">OUR EVOLUTION</span>
            <h2 className="unified-title">
              Our <span>Journey</span>
            </h2>
            <div className="unified-underline center"></div>
            <p className="journey-subtitle" style={{ marginTop: '20px' }}>
              A journey built on trust, quality and a commitment to serve<br/>our customers for generations.
            </p>
          </div>

          <div className="new-timeline-container">
            <div className="new-timeline-line"></div>
            
            {/* Item 1 - Left (Red) */}
            <div className="nt-row left-align fade-in-up">
              <div className="nt-card-container">
                <div className="nt-card red-theme">
                  <div className="nt-icon-box">
                    <Store size={26} />
                  </div>
                  <div className="nt-text-box">
                    <div className="nt-year-wrapper">
                      <span className="nt-year red">1960</span>
                      <div className="nt-line red"></div>
                    </div>
                    <h3>The Beginning</h3>
                    <p>Started with a commitment to quality products and reliable service.</p>
                  </div>
                </div>
              </div>
              <div className="nt-center-dot red-theme">
                <div className="nt-inner-dot"></div>
              </div>
              <div className="nt-empty"></div>
            </div>

            {/* Item 2 - Right (Green) */}
            <div className="nt-row right-align fade-in-up delay-1">
              <div className="nt-empty"></div>
              <div className="nt-center-dot red-theme">
                <div className="nt-inner-dot"></div>
              </div>
              <div className="nt-card-container">
                <div className="nt-card red-theme">
                  <div className="nt-text-box" style={{ textAlign: 'left' }}>
                    <div className="nt-year-wrapper">
                      <span className="nt-year red">1980</span>
                      <div className="nt-line red"></div>
                    </div>
                    <h3>Growing Stronger</h3>
                    <p>Expanded product offerings and strengthened customer relationships.</p>
                  </div>
                  <div className="nt-icon-box">
                    <TrendingUp size={26} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Item 3 - Left (Red) */}
            <div className="nt-row left-align fade-in-up delay-2">
              <div className="nt-card-container">
                <div className="nt-card red-theme">
                  <div className="nt-icon-box">
                    <Settings size={26} />
                  </div>
                  <div className="nt-text-box">
                    <div className="nt-year-wrapper">
                      <span className="nt-year red">2000</span>
                      <div className="nt-line red"></div>
                    </div>
                    <h3>Expanding Horizons</h3>
                    <p>Broadened the range across agriculture, construction and power tools.</p>
                  </div>
                </div>
              </div>
              <div className="nt-center-dot red-theme">
                <div className="nt-inner-dot"></div>
              </div>
              <div className="nt-empty"></div>
            </div>

            {/* Item 4 - Right (Green) */}
            <div className="nt-row right-align fade-in-up delay-3">
              <div className="nt-empty"></div>
              <div className="nt-center-dot red-theme">
                <div className="nt-inner-dot"></div>
              </div>
              <div className="nt-card-container">
                <div className="nt-card red-theme">
                  <div className="nt-text-box" style={{ textAlign: 'left' }}>
                    <div className="nt-year-wrapper">
                      <span className="nt-year red">2010</span>
                      <div className="nt-line red"></div>
                    </div>
                    <h3>Building Relationships</h3>
                    <p>Focused on dependable service and long-term customer relationships.</p>
                  </div>
                  <div className="nt-icon-box">
                    <Users size={26} />
                  </div>
                </div>
              </div>
            </div>

            {/* Item 5 - Left (Red) */}
            <div className="nt-row left-align fade-in-up delay-4">
              <div className="nt-card-container">
                <div className="nt-card red-theme">
                  <div className="nt-icon-box">
                    <Star size={26} />
                  </div>
                  <div className="nt-text-box">
                    <div className="nt-year-wrapper">
                      <span className="nt-year red">2026</span>
                      <div className="nt-line red"></div>
                    </div>
                    <h3>Continuing the Legacy ⭐</h3>
                    <p><strong>66+ Years of Trust</strong><br/>Continuing to serve customers with quality equipment, trusted service and a commitment to the future.</p>
                  </div>
                </div>
              </div>
              <div className="nt-center-dot red-theme">
                <div className="nt-inner-dot"></div>
              </div>
              <div className="nt-empty"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. What Defines Us */}
      <section className="values-section section-padding relative overflow-hidden">
        {/* Farm Field Background Image */}
        <div className="values-bg-image"></div>

        <div className="container relative z-10">
          <div className="section-header centered">
            <h2 className="unified-title">What We <span>Stand For</span></h2>
            <div className="unified-underline center" style={{ background: 'linear-gradient(90deg, #cc3f45 50%, #059669 50%)' }}></div>
          </div>

          <div className="principles-grid">
                
                {/* Card 1: Green */}
                <div className="principle-card theme-green fade-in-up">
                  <div className="principle-watermark">01</div>
                  <div className="principle-bg-wave"></div>
                  <div className="principle-icon-wrapper">
                    <div className="principle-icon-bg"></div>
                    <div className="principle-icon-dot"></div>
                    <div className="principle-icon-inner"><ShieldCheck size={28} color="white" strokeWidth={2.5} /></div>
                  </div>
                  <h4 className="principle-title">
                    <span className="p-bold">Trusted</span> <span className="p-light">Service</span>
                  </h4>
                  <p className="principle-text">
                    Built on decades of trust, we deliver reliable products and dependable support.
                  </p>
                  <div className="principle-line"></div>
                </div>

                {/* Card 2: Red */}
                <div className="principle-card theme-red fade-in-up delay-1">
                  <div className="principle-watermark">02</div>
                  <div className="principle-bg-wave"></div>
                  <div className="principle-icon-wrapper">
                    <div className="principle-icon-bg"></div>
                    <div className="principle-icon-dot"></div>
                    <div className="principle-icon-inner"><Gem size={28} color="white" strokeWidth={2.5} /></div>
                  </div>
                  <h4 className="principle-title">
                    <span className="p-bold">Quality</span> <span className="p-light">Products</span>
                  </h4>
                  <p className="principle-text">
                    We offer high-quality, durable and reliable products for every need.
                  </p>
                  <div className="principle-line"></div>
                </div>

                {/* Card 3: Gold */}
                <div className="principle-card theme-gold fade-in-up delay-2">
                  <div className="principle-watermark">03</div>
                  <div className="principle-bg-wave"></div>
                  <div className="principle-icon-wrapper">
                    <div className="principle-icon-bg"></div>
                    <div className="principle-icon-dot"></div>
                    <div className="principle-icon-inner"><Users size={28} color="white" strokeWidth={2.5} /></div>
                  </div>
                  <h4 className="principle-title">
                    <span className="p-bold">Sales in</span> <span className="p-light">madurai and nearby districts</span>
                  </h4>
                  <p className="principle-text">
                    Reaching customers across the state with the right products and support.
                  </p>
                  <div className="principle-line"></div>
                </div>

                {/* Card 4: Green */}
                <div className="principle-card theme-green fade-in-up delay-3">
                  <div className="principle-watermark">04</div>
                  <div className="principle-bg-wave"></div>
                  <div className="principle-icon-wrapper">
                    <div className="principle-icon-bg"></div>
                    <div className="principle-icon-dot"></div>
                    <div className="principle-icon-inner"><TrendingUp size={28} color="white" strokeWidth={2.5} /></div>
                  </div>
                  <h4 className="principle-title">
                    <span className="p-bold">Growing</span> <span className="p-light">Together</span>
                  </h4>
                  <p className="principle-text">
                    We grow with our customers by supporting their progress at every step.
                  </p>
                  <div className="principle-line"></div>
                </div>

              </div>
        </div>
      </section>


      {/* Vision, Mission, Values Section - Clean Minimalist */}
      <section className="vmv-minimal-section bg-white" style={{ paddingBottom: '80px' }}>
        <div className="container">
          
          <div className="section-header centered fade-in-up" style={{ marginBottom: '60px' }}>
            <h2 className="pill-title" style={{ marginBottom: 0 }}>
              Our Guiding Principles
            </h2>
          </div>

          <div className="vmv-grid">
            
            {/* Mission */}
            <div className="vmv-item mission-item">
              <div className="vmv-icon-wrapper relative flex items-center justify-center" style={{ height: '80px' }}>
                <img loading="lazy" src="/mission.png" alt="Mission Target" className="mission-target" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              </div>
              <h3 className="vmv-title">
                <span className="text-slate-900">OUR</span> <span style={{ color: '#cc3f45' }}>MISSION</span>
              </h3>
              <p className="vmv-text">
                To empower Tamilnadu farmers with top-tier, durable agricultural equipment and innovative farming solutions. We are dedicated to delivering reliable agro products and dependable support that maximize crop yield and farm productivity.
              </p>
            </div>

            {/* Divider */}
            <div className="vmv-divider hidden md:block"></div>

            {/* Vision */}
            <div className="vmv-item vision-item">
              <div className="vmv-icon-wrapper relative flex items-center justify-center" style={{ height: '80px' }}>
                <img loading="lazy" src="/vision.png" alt="Vision Bulb" className="vision-bulb" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              </div>
              <h3 className="vmv-title">
                <span className="text-slate-900">OUR</span> <span style={{ color: '#eab308' }}>VISION</span>
              </h3>
              <p className="vmv-text">
                To become Tamilnadu's most trusted manufacturer of premium agricultural machinery. We envision a sustainable future for agriculture by pioneering modern farm mechanization that drives growth and prosperity for every farming community.
              </p>
            </div>

            {/* Divider */}
            <div className="vmv-divider hidden md:block"></div>

            {/* Values */}
            <div className="vmv-item values-item">
              <div className="vmv-icon-wrapper relative flex items-center justify-center" style={{ height: '80px' }}>
                <Handshake size={60} color="#cc3f45" className="values-hands" />
              </div>
              <h3 className="vmv-title">
                <span className="text-slate-900">OUR</span> <span style={{ color: '#cc3f45' }}>VALUES</span>
              </h3>
              <p className="vmv-text">
                At Paranimill, our foundation is built on uncompromising product quality, deep-rooted integrity, and customer-first service. We remain steadfast in our commitment to advancing the agricultural sector and enhancing farmer livelihoods.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
