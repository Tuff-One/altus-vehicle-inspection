import { useContext } from 'react';
import { AuthContext } from './AuthContextBase.js';

export function useAuth() {
  return useContext(AuthContext);
}