import { useConfiguration } from "@/hooks/useConfiguration";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback, useRef } from "react";

type InitializationStep = {
  name: string;
  progress: number;
};

export const useAppInitialization = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { refreshMyConfigurations, refreshBookmarks } = useConfiguration();

  const [isInitializing, setIsInitializing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initialisation...");
  const hasInitialized = useRef(false);
  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;

  const initialize = useCallback(async () => {
    try {
      setProgress(10);
      setCurrentStep("Chargement de l'application...");

      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(30);

      if (isAuthenticatedRef.current) {
        setCurrentStep("Chargement de vos configurations...");
        try {
          await refreshMyConfigurations();
        } catch (error) {
        }
        setProgress(60);

        setCurrentStep("Chargement de vos favoris...");
        try {
          await refreshBookmarks();
        } catch (error) {
        }
        setProgress(90);
      } else {
        setProgress(90);
      }

      setCurrentStep("Finalisation...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsInitializing(false);
    } catch (error) {
      console.error("Initialization error:", error);
      setProgress(100);
      setIsInitializing(false);
    }
  }, [refreshMyConfigurations, refreshBookmarks]);

  useEffect(() => {
    if (!authLoading && !hasInitialized.current) {
      hasInitialized.current = true;
      initialize();
    }
  }, [authLoading, initialize]);

  return {
    isInitializing,
    progress,
    currentStep,
  };
};
