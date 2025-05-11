'use client';

import useAuthStore from "../auth/auth.store";

// Removed duplicate import of useEffect

const AuthHydration = () => {
  // Just mount the store to initialize it
  useAuthStore();

  return null;
};

export default AuthHydration;