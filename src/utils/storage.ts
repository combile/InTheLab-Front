import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth_token";
const REFRESH_TOKEN_KEY = "@refresh_token";
const USER_INFO_KEY = "@user_info";

export const storage = {
  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving refresh token:", error);
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  removeRefreshToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error removing refresh token:", error);
    }
  },

  setUserInfo: async (userInfo: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  },

  getUserInfo: async (): Promise<any | null> => {
    try {
      const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  removeUserInfo: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_INFO_KEY);
    } catch (error) {
      console.error("Error removing user info:", error);
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_INFO_KEY,
      ]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
