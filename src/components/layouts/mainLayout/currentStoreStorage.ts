import type { AuthStore } from '@/components/layouts/mainLayout/types';

const STORAGE_KEY = 'current_store';

export function saveCurrentStore(store: AuthStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function loadCurrentStore(): AuthStore | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthStore) : null;
  } catch {
    return null;
  }
}

export function clearCurrentStore() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
