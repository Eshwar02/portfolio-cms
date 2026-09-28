import { createContext, useContext, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("access"));

  async function login(username, password) {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setAuthed(true);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthed(false);
  }

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
