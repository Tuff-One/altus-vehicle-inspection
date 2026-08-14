import { useState } from 'react';
import { AuthContext } from './AuthContextBase.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  function loginUser(userData, authToken) {
    setUser(userData);
    setToken(authToken);
  }

  function logoutUser() {
    setUser(null);
    setToken(null);
  }

  const value = {
    user,
    token,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}