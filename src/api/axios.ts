import axios from "axios";
import { storage } from "../utils/storage";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async config => {
    // 토큰이 있다면 헤더에 추가
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    // 에러 처리 로직
    if (error.response) {
      // 401 에러 시 로그아웃 처리 등 추가 가능
      if (error.response.status === 401) {
        // 토큰 만료 등의 처리
        // await storage.clearAll();
        // 네비게이션 처리 필요할 수 있음
      }
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
