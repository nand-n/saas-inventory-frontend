// hooks/useAuthStoreClient.ts
'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '../auth/auth.store';

const useAuthStoreClient = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate store on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Return the store with hydration status
  return {
    ...useAuthStore(),
    isHydrated,
  };
};

export default useAuthStoreClient;