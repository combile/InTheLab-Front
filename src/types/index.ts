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

export interface User {
  id: number; // Backend uses integer
  username: string;
  email: string;
  lab_name: string; // Renamed from companyName
  device_id?: string;
  is_active: boolean;
  is_checked_in: boolean;
  created_at?: string;

  // Frontend specific (optional, might need mapping)
  name?: string; // Assuming username is name for now
  profileImage?: string;
}

export interface LoginResponse {
  access_token: string; // Renamed from accessToken
  token_type: string;
  // user info might need to be fetched separately or included if backend changes
}

export interface CheckInRequest {
  beacon_connected: boolean;
}

export interface Attendance {
  id: number;
  user_id: number;
  check_in: string;
  check_out?: string;
}

export interface AttendanceStatus {
  is_checked_in: boolean;
  last_seen?: string;
  today_check_in?: string;
  today_check_out?: string;
  // derived for frontend
  status?: "CHECKED_IN" | "CHECKED_OUT" | "ABSENT" | "LATE" | "LEAVE";
}

export interface RankingItem {
  user_id: number;
  username: string;
  lab_name: string;
  total_time: number; // seconds
  is_checked_in: boolean;

  // Derived or additional fields for UI
  rank?: number;
  role?: string; // Frontend dummy for now
  avatar?: string; // Frontend dummy for now
}

export interface WeeklyStats {
  this_week_total: number;
  last_week_total: number;
  comparison_message: string;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  total_time: number; // hours
  is_attended: boolean;

  // Derived for frontend calendar logic
  workingHours?: number; // map total_time to this
  checkInTime?: string; // not provided by backend calendar API, might need separate fetch or simplify
  checkOutTime?: string;
}

export interface MonthlyStats {
  total_time: number;
  attendance_rate: number;
  calendar: CalendarDay[];
}

export interface TemperatureResponse {
  temperature: number;
  humidity?: number;
  timestamp: string;
  location: string;
}
