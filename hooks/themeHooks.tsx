import secureStoreService from "@/app/services/secureStore.service";
import { themes } from "@/constants/Colors";
import { ColorPalette } from "@/types/color.types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  theme: "light" | "dark";
  colors: ColorPalette["light"];
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(systemTheme || "light");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await secureStoreService.getItem("userTheme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
        } else if (systemTheme) {
          setTheme(systemTheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        if (systemTheme) {
          setTheme(systemTheme);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Update theme when system theme changes (only if no saved preference)
  useEffect(() => {
    const checkSystemTheme = async () => {
      const savedTheme = await secureStoreService.getItem("userTheme");
      if (!savedTheme && systemTheme) {
        setTheme(systemTheme);
      }
    };

    checkSystemTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      await secureStoreService.setItem("userTheme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const colors = themes[theme];

  // Optional: show loading screen while theme loads
  if (isLoading) {
    return null; // or a loading component
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
