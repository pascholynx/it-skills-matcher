import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // ✅ Ensure this property is included
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add isLoading state

  useEffect(() => {
    // Simulate authentication check (Replace with actual logic)
    setTimeout(() => {
      setIsAuthenticated(true); // Replace with real authentication logic
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login: () => {}, logout: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
