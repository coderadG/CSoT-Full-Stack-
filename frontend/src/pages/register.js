import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import styles from './Register.module.css'; // ✅ Import CSS Module

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser({ username, email, password });
      alert(data.message);
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      alert(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formCard} onSubmit={handleRegister}>
        <h2 className={styles.title}>Register</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
          Register
        </button>
        <p
          className={styles.link}
          onClick={() => navigate('/login')}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
