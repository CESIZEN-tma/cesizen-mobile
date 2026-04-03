import React, { useEffect } from "react";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { useRouter } from "expo-router";

type AppInitializerProps = {
  children: React.ReactNode;
};

const AppInitializer = ({ children }: AppInitializerProps) => {
  const { isInitializing, progress, currentStep, hasPendingConfirmation } = useAppInitialization();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && hasPendingConfirmation) {
      router.replace("/(auth)/confirm-account");
    }
  }, [isInitializing, hasPendingConfirmation]);

  if (isInitializing) {
    return <LoadingScreen progress={progress} message={currentStep} />;
  }

  return <>{children}</>;
};

export default AppInitializer;
