import type { UserCacheData } from '../types/authTypes';

const CACHE_KEY = 'user_cache_data';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const cacheStorage = {
  // Store cached user data with expiry
  setCacheData: (data: Omit<UserCacheData, 'cached_at' | 'expires_at'>): void => {
    try {
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + CACHE_DURATION).toISOString();
      
      // Flatten permissions from roles
      const rolesPermissions = data.global_roles.reduce((acc: any[], role) => {
        return [...acc, ...role.permissions];
      }, []);

      const cacheData: UserCacheData = {
        ...data,
        roles_permissions: rolesPermissions,
        cached_at: now,
        expires_at: expiresAt,
      };

      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache user data:', error);
    }
  },

  // Get cached user data if not expired
  getCacheData: (): UserCacheData | null => {
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const parsed: UserCacheData = JSON.parse(cachedData);
      const now = new Date();
      const expiresAt = new Date(parsed.expires_at);

      // Check if cache is expired
      if (now > expiresAt) {
        sessionStorage.removeItem(CACHE_KEY);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
  },

  // Remove cached data
  clearCacheData: (): void => {
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear cache data:', error);
    }
  },

  // Check if cache exists and is valid
  isCacheValid: (): boolean => {
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (!cachedData) return false;

      const parsed: UserCacheData = JSON.parse(cachedData);
      const now = new Date();
      const expiresAt = new Date(parsed.expires_at);

      return now <= expiresAt;
    } catch {
      return false;
    }
  },

  // Get cache expiry time
  getCacheExpiry: (): string | null => {
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const parsed: UserCacheData = JSON.parse(cachedData);
      return parsed.expires_at;
    } catch {
      return null;
    }
  },

  // Extend cache expiry (useful when user is active)
  extendCacheExpiry: (): void => {
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (!cachedData) return;

      const parsed: UserCacheData = JSON.parse(cachedData);
      const newExpiresAt = new Date(Date.now() + CACHE_DURATION).toISOString();
      
      parsed.expires_at = newExpiresAt;
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error('Failed to extend cache expiry:', error);
    }
  },
};
