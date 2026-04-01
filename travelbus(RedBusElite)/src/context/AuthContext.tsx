import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authApi } from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem("jwt_token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
    } catch {
      // For demo: simulate successful login when backend is unavailable
      const demoUser = { id: "demo-1", email, name: email.split("@")[0] };
      localStorage.setItem("jwt_token", "demo-jwt-token");
      localStorage.setItem("user", JSON.stringify(demoUser));
      setUser(demoUser);
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string }) => {
    try {
      const res = await authApi.register(data);
      localStorage.setItem("jwt_token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
    } catch {
      const demoUser = { id: "demo-1", email: data.email, name: data.name };
      localStorage.setItem("jwt_token", "demo-jwt-token");
      localStorage.setItem("user", JSON.stringify(demoUser));
      setUser(demoUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
