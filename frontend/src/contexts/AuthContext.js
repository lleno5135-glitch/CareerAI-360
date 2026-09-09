import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data.user);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm: password
      });
      const { token: newToken, user: newUser } = response.data.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
