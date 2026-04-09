import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bnUser')) || null; }
    catch { return null; }
  });

  const login = (userData) => {
    localStorage.setItem('bnUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('bnUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      isAdmin:  user?.role === 'admin',
      isVendor: user?.role === 'vendor' || user?.role === 'admin',
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
