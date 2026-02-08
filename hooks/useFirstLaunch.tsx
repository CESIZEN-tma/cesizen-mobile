import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FIRST_LAUNCH_KEY = "@app_first_launch";

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      setIsFirstLaunch(hasLaunched === null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking first launch:", error);
      setIsFirstLaunch(false);
      setIsLoading(false);
    }
  };

  const markAsLaunched = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, "false");
      setIsFirstLaunch(false);
    } catch (error) {
      console.error("Error marking app as launched:", error);
    }
  };

  return {
    isFirstLaunch,
    isLoading,
    markAsLaunched,
  };
}
