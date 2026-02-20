import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

  const login = (data) => {
    setUser(data.user);
    sessionStorage.setItem('accessToken',data.accessToken);
    sessionStorage.setItem('user',JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};
