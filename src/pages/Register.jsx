import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {     
await axios.post('https://stock-backend-3-2we7.onrender.com/register', { name, email, password });
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert('Error registering');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>Start your trading journey</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
        <p className="switch-text">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
