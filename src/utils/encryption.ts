import CryptoJS from 'crypto-js';

// You should store this secret key securely (environment variable in production)
const SECRET_KEY =
  'something0924242457ioioyuyu!qq@@zmxncbvalskdjfhgqpwoeiruty019283';

export const encryptionUtils = {
  // Encrypt data
  encrypt: (data: string): string => {
    try {
      return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return '';
    }
  },

  // Decrypt data
  decrypt: (encryptedData: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);

      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  },

  // Check if data is valid encrypted format
  isValidEncrypted: (data: string): boolean => {
    try {
      const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8).length > 0;
    } catch {
      return false;
    }
  },
};
