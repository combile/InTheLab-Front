import apiClient from "./axios";
import { User } from "../types";

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  // 백엔드에 프로필 업데이트 API가 없음
  // updateProfile: async (data: Partial<User>): Promise<User> => { ... }
};
