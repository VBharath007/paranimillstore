import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';
import AlertToast from '../../components/AlertToast';
import Logo from '../../components/Logo';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authAPI.login({ username, password });
      
      if (res.success && res.data?.token) {
        // Save JWT token & admin data
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('admin', JSON.stringify(res.data.admin));
        localStorage.setItem('isAuthenticated', 'true');

        setAlert({
          type: 'success',
          message: `Welcome, ${res.data.admin.username}! Login successful.`,
        });

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again later.');
      setAlert({
        type: 'error',
        message: err.message || 'Invalid username or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <AlertToast alert={alert} onClose={() => setAlert(null)} />

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <Logo variant="full" height={46} />
          </div>
          <p style={{ marginTop: '0.65rem' }}>Secure Admin Access • Quality & Trust Since 1960</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="form-options">
            <label className="remember-checkbox">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Role: Super Admin</span>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Parani Mill Stores. 60+ Years of Trust.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
