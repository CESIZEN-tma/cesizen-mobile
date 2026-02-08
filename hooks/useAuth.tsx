import secureStoreService from "@/app/services/secureStore.service";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await secureStoreService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userData = await secureStoreService.getUser<User>();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      console.log("Login attempt:", { email, password });

      // Simulate API response
      const mockRefreshToken = "mock-refresh-token-" + Date.now();
      const mockAuthToken = "mock-auth-token-" + Date.now();
      const mockUser = {
        email,
        firstName: "User",
        lastName: "Test",
      };

      await secureStoreService.saveRefreshToken(mockRefreshToken);
      await secureStoreService.saveToken(mockAuthToken);
      await secureStoreService.saveUser(mockUser);

      setIsAuthenticated(true);
      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      // TODO: Replace with actual API call
      console.log("Register attempt:", userData);

      // Simulate API response
      const mockRefreshToken = "mock-refresh-token-" + Date.now();
      const mockAuthToken = "mock-auth-token-" + Date.now();
      const mockUser = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };

      await secureStoreService.saveRefreshToken(mockRefreshToken);
      await secureStoreService.saveToken(mockAuthToken);
      await secureStoreService.saveUser(mockUser);

      setIsAuthenticated(true);
      setUser(mockUser);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await secureStoreService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
