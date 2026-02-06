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

  useEffect(() => {
    if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = themes[theme];

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
