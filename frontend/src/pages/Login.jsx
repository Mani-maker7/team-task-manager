import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import api from '../api';
import '../styles/login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    
    try {
      const response = await api.post(endpoint, formData);
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/member');
        }
      } else {
        setIsLogin(true);
        setError('Account created successfully! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
            {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
          </div>
        </div>
        
        <h2>{isLogin ? 'Welcome Back' : 'Join TaskMaster'}</h2>
        <p className="text-center text-slate-500 mb-8 -mt-6">
          {isLogin ? 'Enter your credentials to access your tasks' : 'Start managing your team projects efficiently'}
        </p>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label><User size={14} className="inline mr-1" /> Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="John Doe"
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label><Mail size={14} className="inline mr-1" /> Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="name@company.com"
              value={formData.email} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label><Lock size={14} className="inline mr-1" /> Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} className="ml-2" />}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
