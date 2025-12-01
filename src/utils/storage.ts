// Note: Install @react-native-async-storage/async-storage for production
// For now using a simple in-memory storage
let memoryStorage: { [key: string]: string } = {};

const USER_INFO_KEY = "@user_info";

export interface UserInfo {
  user_id?: string;
  username?: string;
  email?: string;
  name?: string;
  phone?: string;
  disabilityType?: string;
  [key: string]: any;
}

export const storage = {
  setUserInfo: async (userInfo: UserInfo): Promise<void> => {
    try {
      // Try to use AsyncStorage if available, otherwise use memory
      try {
        const AsyncStorage = require("@react-native-async-storage/async-storage").default;
        await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
      } catch {
        // Fallback to memory storage
        memoryStorage[USER_INFO_KEY] = JSON.stringify(userInfo);
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      throw error;
    }
  },

  getUserInfo: async (): Promise<UserInfo | null> => {
    try {
      try {
        const AsyncStorage = require("@react-native-async-storage/async-storage").default;
        const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
        return userInfo ? JSON.parse(userInfo) : null;
      } catch {
        // Fallback to memory storage
        const userInfo = memoryStorage[USER_INFO_KEY];
        return userInfo ? JSON.parse(userInfo) : null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  removeUserInfo: async (): Promise<void> => {
    try {
      try {
        const AsyncStorage = require("@react-native-async-storage/async-storage").default;
        await AsyncStorage.removeItem(USER_INFO_KEY);
      } catch {
        // Fallback to memory storage
        delete memoryStorage[USER_INFO_KEY];
      }
    } catch (error) {
      console.error("Error removing user info:", error);
      throw error;
    }
  },
};

