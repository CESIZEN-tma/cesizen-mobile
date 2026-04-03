import { useState, useEffect } from "react";
import secureStoreService from "@/app/services/secureStore.service";

const CONFIRMATION_TTL_MS = 15 * 60 * 1000;

export function usePendingConfirmation() {
  const [hasPendingConfirmation, setHasPendingConfirmation] = useState(false);

  useEffect(() => {
    const check = async () => {
      const pendingAt = await secureStoreService.getItem("pendingConfirmationAt");
      if (!pendingAt) return;
      const elapsed = Date.now() - parseInt(pendingAt, 10);
      setHasPendingConfirmation(elapsed < CONFIRMATION_TTL_MS);
    };
    check();
  }, []);

  return { hasPendingConfirmation };
}
