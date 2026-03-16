import React from "react";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import LoadingScreen from "@/components/shared/LoadingScreen";

type AppInitializerProps = {
  children: React.ReactNode;
};

const AppInitializer = ({ children }: AppInitializerProps) => {
  const { isInitializing, progress, currentStep } = useAppInitialization();

  if (isInitializing) {
    return <LoadingScreen progress={progress} message={currentStep} />;
  }

  return <>{children}</>;
};

export default AppInitializer;
