import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  X,
  Bell
} from 'lucide-react';
import Logo from './Logo';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products & Equipment', path: '/admin/products', icon: Package },
    { name: 'Articles & Blogs', path: '/admin/blogs', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    if (onClose) onClose();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Official Brand Logo */}
      <div className="sidebar-brand">
        <div className="brand-logo-card">
          <Logo variant="full" height={36} />
        </div>
        {onClose && (
          <button 
            className="mobile-sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>



      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">MAIN NAVIGATION</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon-wrapper">
                <Icon size={19} />
              </span>
              <span className="nav-label">{item.name}</span>
            </NavLink>
          );
        })}

        {/* Notification moved to menu */}
        <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>NOTIFICATIONS</div>
        <div 
          className={`sidebar-notif-toggle ${showNotifications ? 'open' : ''}`}
          onClick={() => setShowNotifications((prev) => !prev)}
          title="Toggle System Notifications"
        >
          <span className="nav-icon-wrapper" style={{ position: 'relative' }}>
            <Bell size={19} />
            <span className="sidebar-bell-dot"></span>
          </span>
          <span className="nav-label">Notifications</span>
         
        </div>


      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
