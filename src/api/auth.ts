import apiClient from "./axios";
import { storage } from "../utils/storage";
import { LoginResponse, User } from "../types";

// 백엔드 UserRegister 스키마와 일치시킴
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  lab_name: string;
  device_id?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // OAuth2PasswordRequestForm 형식 (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;

    await storage.setToken(access_token);
    // refresh token은 현재 백엔드에서 미지원

    // 로그인 직후 유저 정보 가져와서 저장
    try {
      const userResponse = await apiClient.get<User>("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      await storage.setUserInfo(userResponse.data);
    } catch (e) {
      console.error("Failed to fetch user info after login", e);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    // 백엔드에 로그아웃 엔드포인트가 없으므로 로컬 스토리지 정리만 수행
    await storage.clearAll();
  },

  signup: async (data: SignupRequest): Promise<User> => {
    const response = await apiClient.post<User>("/auth/register", data);
    return response.data;
  },

  // 백엔드에 중복 체크 API가 없으므로 일단 제거하거나 회원가입 에러로 처리
  checkUsername: async (username: string): Promise<boolean> => {
    // 임시로 true 반환 (실제로는 회원가입 시 400 에러로 잡아야 함)
    return true;
  },

  checkEmail: async (email: string): Promise<boolean> => {
    return true;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    await storage.setUserInfo(response.data);
    return response.data;
  },
};
