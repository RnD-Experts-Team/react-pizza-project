import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthStore } from '@/components/layouts/mainLayout/types';
import { loadCurrentStore, saveCurrentStore, clearCurrentStore } from '@/components/layouts/mainLayout/currentStoreStorage';

type CurrentStoreContextValue = {
  currentStore: AuthStore | null;
  setCurrentStore: (store: AuthStore | null) => void;
  clear: () => void;
};

const CurrentStoreContext = createContext<CurrentStoreContextValue | undefined>(undefined);

export const CurrentStoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [currentStore, setCurrentStoreState] = useState<AuthStore | null>(() => loadCurrentStore());

  // Persist to localStorage whenever it changes
  useEffect(() => {
    if (currentStore) saveCurrentStore(currentStore);
    else clearCurrentStore();
  }, [currentStore]);

  // Keep tabs/windows in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'current_store') {
        setCurrentStoreState(loadCurrentStore());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<CurrentStoreContextValue>(() => ({
    currentStore,
    setCurrentStore: setCurrentStoreState,
    clear: () => setCurrentStoreState(null),
  }), [currentStore]);

  return (
    <CurrentStoreContext.Provider value={value}>
      {children}
    </CurrentStoreContext.Provider>
  );
};

export function useCurrentStore() {
  const ctx = useContext(CurrentStoreContext);
  if (!ctx) throw new Error('useCurrentStore must be used within CurrentStoreProvider');
  return ctx;
}
