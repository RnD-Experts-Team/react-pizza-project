import { encryptionUtils } from './encryption';

const TOKEN_KEY = 'auth_token_encrypted';

export const tokenStorage = {
  // Store encrypted token
  setToken: (token: string): void => {
    try {
      const encryptedToken = encryptionUtils.encrypt(token);
      localStorage.setItem(TOKEN_KEY, encryptedToken);

    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  // Get and decrypt token
  getToken: (): string | null => {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_KEY);
      if (!encryptedToken) return null;

      const decryptedToken = encryptionUtils.decrypt(encryptedToken);

      return decryptedToken || null;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  // Remove token
  removeToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  // Check if token exists and is valid
  hasValidToken: (): boolean => {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_KEY);
      if (!encryptedToken) return false;

      return encryptionUtils.isValidEncrypted(encryptedToken);
    } catch {
      return false;
    }
  }
};
