"use client";
import { createContext, use, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (data) => {
    const res = await api.post("/login", data);
    setUser(res.data);
    router.push(res.data.role === "admin" ? "/dashboard" : "/library");
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => use(AuthContext);
