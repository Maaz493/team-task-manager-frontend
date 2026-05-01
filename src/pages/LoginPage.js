import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isSignup ? `${API_URL}/auth/signup` : `${API_URL}/auth/login`;
      const res = await axios.post(url, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'white',padding:'40px',borderRadius:'12px',width:'400px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
        <h2 style={{textAlign:'center',color:'#1a73e8',marginBottom:'4px'}}>Team Task Manager</h2>
        <h3 style={{textAlign:'center',color:'#555',marginBottom:'24px'}}>{isSignup ? 'Create Account' : 'Login'}</h3>
        {error && <p style={{color:'red',textAlign:'center'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isSignup && <input style={inputStyle} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />}
          <input style={inputStyle} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          {isSignup && (
            <select style={inputStyle} name="role" value={form.role} onChange={handleChange}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          )}
          <button type="submit" style={{width:'100%',padding:'12px',backgroundColor:'#1a73e8',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',cursor:'pointer'}}>
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'16px',color:'#555'}}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span style={{color:'#1a73e8',cursor:'pointer',fontWeight:'bold'}} onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? ' Login' : ' Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {width:'100%',padding:'12px',marginBottom:'16px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',boxSizing:'border-box'};

export default LoginPage;