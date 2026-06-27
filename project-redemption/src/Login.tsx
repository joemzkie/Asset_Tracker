import React, { useState } from 'react';
import { supabase } from './supabase';

interface LoginProps {
  onLoginSuccess: (userId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, theme, toggleTheme }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Injected
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ISSUE #1 FIX: Stop the request dead in its tracks if passwords don't match
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account created! Logging you in...');
        if (data.user) onLoginSuccess(data.user.id);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) onLoginSuccess(data.user.id);
      }
    } catch (err: any) {
      alert(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="theme-toggle-top">
        <span>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
        <label className="switch">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>

      <div className="login-box">
        <div className="login-header">
          <div className="brand-badge">REDEMPTION</div>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Start tracking your portfolio live.' : 'Access your secure asset tracker.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="joem@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {/* ISSUE #1 FIX: Only renders when registering */}
          {isSignUp && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
          )}

          {/* ISSUE #4 FIX: Cleaned up action text */}
          <button type="submit" className="btn btn-red-submit" disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              className="btn-link" 
              onClick={() => { setIsSignUp(!isSignUp); setConfirmPassword(''); }}
            >
              {isSignUp ? 'Sign In' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;