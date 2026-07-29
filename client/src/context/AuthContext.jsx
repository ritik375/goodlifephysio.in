import { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginRequest, getProfile } from '../services/authService';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'physio_admin_token';
const USER_KEY = 'physio_admin_user';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore session from localStorage and verify the
  // token is still valid by pinging the profile endpoint.
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (token && storedUser) {
        try {
          const { data } = await getProfile();
          setAdmin(data.data);
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await loginRequest(email, password);
    const { token, ...adminData } = data.data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};
