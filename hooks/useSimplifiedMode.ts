import { useEffect, useState } from 'react';
import secureStoreService from '@/app/services/secureStore.service';

const SIMPLIFIED_MODE_KEY = 'simplifiedMode';

export function useSimplifiedMode() {
  const [isSimplified, setIsSimplified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await secureStoreService.getItem(SIMPLIFIED_MODE_KEY);
      setIsSimplified(stored === 'true');
      setIsLoaded(true);
    })();
  }, []);

  const toggle = async (value: boolean) => {
    setIsSimplified(value);
    await secureStoreService.setItem(SIMPLIFIED_MODE_KEY, value ? 'true' : 'false');
  };

  return { isSimplified, isLoaded, toggle };
}
