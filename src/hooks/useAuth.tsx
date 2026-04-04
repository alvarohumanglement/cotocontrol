import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Profile } from '../lib/types';
import { COMUNEROS } from '../lib/constants';

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  selectProfile: (id: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  selectProfile: () => {},
  signOut: () => {},
});

const STORAGE_KEY = 'huerta-profile-id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      const found = COMUNEROS.find((c) => c.id === savedId);
      if (found) setProfile(found);
    }
    setLoading(false);
  }, []);

  const selectProfile = (id: string) => {
    const found = COMUNEROS.find((c) => c.id === id);
    if (found) {
      setProfile(found);
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  const signOut = () => {
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ profile, loading, selectProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
