"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const SITE_PASSWORD = "bby2025";

interface AuthContextValue {
  authenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthenticated(sessionStorage.getItem("bby-auth") === "1");
    }
  }, []);

  const login = useCallback((password: string) => {
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem("bby-auth", "1");
      setAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("bby-auth");
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
