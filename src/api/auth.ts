import apiClient from "./axios";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  disabilityType: string;
  consent: {
    terms: boolean;
    privacy: boolean;
  };
}

export interface SignupResponse {
  username: string;
  email: string;
  name?: string;
  phone?: string;
  disabilityType?: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
}

export const authService = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },

  checkUsername: async (username: string): Promise<CheckAvailabilityResponse> => {
    const response = await apiClient.get<CheckAvailabilityResponse>(`/auth/check-username/${username}`);
    return response.data;
  },

  checkEmail: async (email: string): Promise<CheckAvailabilityResponse> => {
    const response = await apiClient.get<CheckAvailabilityResponse>(`/auth/check-email/${email}`);
    return response.data;
  },
};
