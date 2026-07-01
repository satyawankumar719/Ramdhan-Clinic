import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/apiConfig/apiClient";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  avatar?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.data);
          setToken("authenticated");
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (response.data.success) {
        setUser(response.data.data);
        setToken("authenticated");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/register", userData);
      if (response.data.success) {
        setUser(response.data.data);
        setToken("authenticated");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/verify-otp", { email, otp });
      if (response.data.success) {
        setUser(response.data.data.user);
        setToken("authenticated");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        signup,
        verifyOtp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
