import { useState } from "react";
import { AuthContext } from "./AuthContext";

const loadFromSession = () => {
  const savedUser = sessionStorage.getItem('user');
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Failed to parse stored user session", error);
    sessionStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadFromSession);

  const login = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  const switchRole = (newActiveRole) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, activeRole: newActiveRole };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const handleSwitchAccess = () => {
    const newRole = user?.activeRole === 'MANAGER' ? 'CASHIER' : 'MANAGER';
    switchRole(newRole);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, handleSwitchAccess }}>
      {children}
    </AuthContext.Provider>
  );
};