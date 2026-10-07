import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, User, PhoneCall, Menu, X, ShieldCheck } from 'lucide-react';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Parani Mill Stores operations & performance' };
      case '/admin/products':
        return { title: 'Products & Equipment Catalog', subtitle: 'Manage agricultural, gensets, pumps & machinery' };
      case '/admin/blogs':
        return { title: 'Blog Articles & News', subtitle: 'Publish equipment guides and company updates' };
      default:
        return { title: 'Parani Mill Stores Admin', subtitle: 'Quality Products | Trusted Service | Since 1960' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="admin-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="header-title-wrap">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">

        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search equipment, orders..." 
            className="search-input"
          />
        </div>

        {/* Profile Avatar Button with Touch Dropdown */}
        <div className="profile-dropdown-wrapper" ref={profileRef}>
          <button 
            className={`profile-avatar-btn ${showProfileMenu ? 'active' : ''}`}
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-label="Admin Profile"
            title="Admin Profile"
          >
            <User size={19} />
          </button>

          {showProfileMenu && (
            <div className="admin-profile-popup">
              <div className="profile-popup-header">
                <div className="popup-avatar">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="profile-popup-title">Admin Profile</h4>
                  <span className="profile-popup-subtitle">Store Administrator</span>
                </div>
              </div>
              <div className="profile-popup-body">
                <div className="profile-info-row">
                  <span className="label">Account</span>
                  <span className="value">admin</span>
                </div>
                <div className="profile-info-row">
                  <span className="label">Store</span>
                  <span className="value">Parani Mill Stores</span>
                </div>
                <div className="profile-info-row">
                  <span className="label">Status</span>
                  <span className="value status-badge status-in-stock" style={{ fontSize: '0.72rem' }}>
                    <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
