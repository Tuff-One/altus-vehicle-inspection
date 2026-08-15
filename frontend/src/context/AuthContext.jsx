import { useState } from 'react';
import { AuthContext } from './AuthContextBase.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  function loginUser(userData, authToken) {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  }

  function logoutUser() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  const value = { user, token, loginUser, logoutUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}