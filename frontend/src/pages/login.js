import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api'; // loginUser is still a direct axios call
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // context hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });

      const { token, refreshToken, user, message } = data;

      // ✅ Save both access and refresh tokens in context
      login({ token, refreshToken, user });

      alert(message);
      navigate(location.state?.from?.pathname || '/users');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formCard} onSubmit={handleLogin}>
        <h2 className={styles.title}>Login</h2>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">
          Login
        </button>
        <p className={styles.link} onClick={() => navigate('/register')}>
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
};

export default Login;

