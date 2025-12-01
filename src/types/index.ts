export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export type DisabilityType = "none" | "blind" | "low_vision" | "hearing" | "mobility" | "cognitive" | "other";

