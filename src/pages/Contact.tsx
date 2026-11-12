import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, MapPin, Phone, Mail, Clock, Map, Headset } from 'lucide-react';
import { PRODUCT_CATEGORIES } from './Products';
import { API_BASE } from '../config/api';
import './Contact.css';

const Contact = () => {
  const [categories, setCategories] = useState<string[]>(PRODUCT_CATEGORIES.map(c => c.name));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const buildCategoryList = (backendList?: any[]): string[] => {
      const list: string[] = [];
      const existingNames = new Set<string>();
      const existingIds = new Set<string>();

      // 1. Keep standard 10 categories in clean consistent order
      PRODUCT_CATEGORIES.forEach((stdCat) => {
        list.push(stdCat.name);
        existingIds.add(stdCat.id);
        existingNames.add(stdCat.name.toLowerCase());
      });

      // 2. Add any new custom category created from backend /api/categories
      if (backendList && backendList.length > 0) {
        backendList.forEach((cat: any) => {
          const catName = cat && cat.name ? cat.name.trim() : (typeof cat === 'string' ? cat.trim() : '');
          if (catName && catName.toLowerCase() !== 'all products' && cat.slug !== 'all' && catName.toLowerCase() !== 'construction') {
            let id = cat.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            if (id === 'genset') id = 'gensets';
            if (id === 'power-weeder') id = 'weeder';
            if (!existingIds.has(id) && !existingNames.has(catName.toLowerCase())) {
              list.push(catName);
              existingNames.add(catName.toLowerCase());
              existingIds.add(id);
            }
          }
        });
      }

      return list;
    };

    // 1. Instant load from session cache (zero delay/flicker)
    try {
      const cached = sessionStorage.getItem('pm_cached_categories') || sessionStorage.getItem('pm_cached_categories_v4');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(buildCategoryList(parsed));
        }
      }
    } catch (e) {}

    // 2. Fresh live fetch directly from Backend API (guarantees any new category added in backend appears immediately!)
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(resData => {
        const catList = resData && resData.data && Array.isArray(resData.data) 
          ? resData.data 
          : (Array.isArray(resData) ? resData : []);
        if (catList.length > 0) {
          setCategories(buildCategoryList(catList));
          try { sessionStorage.setItem('pm_cached_categories', JSON.stringify(catList)); } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: any) => {
    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
    if (val.length <= 10) {
      setFormData({ ...formData, phone: val });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const text = `Hello Parani Mill Stores,\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nProduct Required: ${formData.service}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/917094341807?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="contact-flat-page">
      <Helmet>
        <title>Contact Us | Parani Mill Stores Madurai</title>
        <meta name="description" content="Contact Parani Mill Stores in Madurai. Trusted supplier of agricultural sprayers, water pumps, petrol brush cutters, earth augers, power weeders, petrol gensets, engines and genuine spares. Call +91 70943 41807." />
        <link rel="canonical" href="https://paranimill.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Us | Parani Mill Stores Madurai" />
        <meta property="og:description" content="Contact Parani Mill Stores in Madurai. Trusted supplier of agricultural machinery and power generators. Call +91 70943 41807." />
        <meta property="og:url" content="https://paranimill.com/contact" />
        <meta property="og:image" content="https://paranimill.com/contacthero.webp" />
      </Helmet>
      {/* Hero Banner using user's asset (Responsive Image to prevent cropping) */}
      <div className="contact-hero-banner">
        <img src="/contacthero.webp" alt="Parani Mill Stores" className="hero-full-img" />
      </div>

      <div className="contact-flat-container">

        {/* Left Side: Form */}
        <div className="flat-form-section">
          <div className="flat-tag">GST Registered Store</div>
          <h1 className="flat-title">
            Get Your Free <span style={{ color: '#cc3f45' }}>Quote Today!</span>
          </h1>

          <form className="flat-form" onSubmit={handleSubmit}>
            <div className="flat-form-row">
              <div className="flat-input-group">
                <label>Your Name *</label>
                <input type="text" name="name" required placeholder="Ex. John Doe" onChange={handleChange} />
              </div>
              <div className="flat-input-group">
                <label>Email *</label>
                <input type="email" name="email" required placeholder="example@gmail.com" onChange={handleChange} />
              </div>
            </div>

            <div className="flat-form-row">
              <div className="flat-input-group">
                <label>Phone *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  placeholder="Enter 10-digit Mobile Number" 
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  value={formData.phone}
                  onChange={handlePhoneChange} 
                />
              </div>
              <div className="flat-input-group">
                <label>Product Requirement *</label>
                <select name="service" required onChange={handleChange} defaultValue="">
                  <option value="" disabled>Select Product / Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flat-input-group">
              <label>Your Message *</label>
              <textarea name="message" required rows={5} placeholder="Enter here.." onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="flat-submit-btn">Submit</button>
          </form>
        </div>

        {/* Right Side: Green Info Card */}
        <div className="flat-info-section">
          <div className="info-group">
            <h3 className="catchy-info-heading"><MapPin size={20} className="catchy-icon" /> Office Address</h3>
            <p className="catchy-info-text">135/3B1, Bye Pass Road,<br />(Near D-Mart), Avaniapuram,<br />Madurai - 625012.</p>
          </div>
          <div className="catchy-wavy-divider"></div>

          <div className="info-group">
            <h3 className="catchy-info-heading"><Headset size={20} className="catchy-icon" /> Contact Info</h3>
            <p className="catchy-info-text">
              <span className="catchy-flex-line"><Phone size={14} /> +91 70943 41807</span>
              <span className="catchy-flex-line"><Mail size={14} /> paranimillstores@gmail.com</span>
            </p>
          </div>
          <div className="catchy-wavy-divider"></div>

          <div className="info-group">
            <h3 className="catchy-info-heading"><Clock size={20} className="catchy-icon" /> Business Hours</h3>
            <p className="catchy-info-text">
              <span className="catchy-flex-line"><strong>Mon - Sat :</strong> 10:00 AM - 7:00 PM</span>
              <span className="catchy-flex-line"><strong>Sunday :</strong> Closed</span>
            </p>
          </div>
          <div className="catchy-wavy-divider"></div>

          <div className="info-group">
            <h3 className="catchy-info-heading"><Map size={20} className="catchy-icon" /> Location Map</h3>
            <div className="contact-small-map" style={{ position: 'relative' }}>
              <a
                href="https://www.google.com/maps/place/Parani+Mill+Stores+(+Branch+Office+)/@9.8854899,78.1180296,704m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3b00c5942e848b8d:0x49f23ecb84aaac9d!8m2!3d9.8854899!4d78.1180296!16s%2Fg%2F11ygxz1bll?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDkyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'pointer' }}>
                <div className="blinking-map-pin">
                  <MapPin size={48} fill="#ef4444" color="white" strokeWidth={1.5} />
                </div>
              </a>
              <iframe
                src="https://maps.google.com/maps?q=9.8854899,78.1180296&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
