import secureStoreService from "@/app/services/secureStore.service";
import { authApi } from "@/app/services/api/authApi";
import { userApi } from "@/app/services/api/userApi";
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
      const { accessToken, refreshToken } = await authApi.login(
        email,
        password,
      );

      await secureStoreService.saveToken(accessToken);
      await secureStoreService.saveRefreshToken(refreshToken);

      const userProfile = await userApi.getProfile();

      const userData = {
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      };

      await secureStoreService.saveUser(userData);

      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
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
      await authApi.register({
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = (await secureStoreService.getRefreshToken()) ?? "error";
      await authApi.logout(refreshToken);
      await secureStoreService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      await secureStoreService.logout();
      setIsAuthenticated(false);
      setUser(null);
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
