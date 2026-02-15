import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [token, setToken] = useState(null);

  const login = (data) => {
    setUser(data.user);
    setPermissions(data.permissions || []);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
    setToken(null);
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ user, permissions, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
