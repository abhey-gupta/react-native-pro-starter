import { MMKV } from "react-native-mmkv";

export const tokenStorage = new MMKV({
  id: "token-storage",
  encryptionKey: "some_secret_key",
});

export const storage = new MMKV({
  id: "mazinda-storage",
  encryptionKey: "some_secret_key",
});

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setJsonItem: (key: string, value: any) => {
    storage.set(key, JSON.stringify(value));
  },
  getJsonItem: (key: string) => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
