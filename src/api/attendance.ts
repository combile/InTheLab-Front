import apiClient from "./axios";
import {
  AttendanceStatus,
  Attendance,
  CheckInRequest,
  RankingItem,
  WeeklyStats,
  MonthlyStats,
  TemperatureResponse,
} from "../types";

export const attendanceService = {
  // 출근 상태 조회
  getStatus: async (): Promise<AttendanceStatus> => {
    const response = await apiClient.get<AttendanceStatus>("/attendance/status");
    // 백엔드 응답에 status 필드가 없으므로 프론트엔드용 파생 필드 추가 로직이 필요할 수 있음
    // 하지만 여기서는 raw data를 반환하고 컴포넌트에서 처리하도록 함
    return response.data;
  },

  // 출근
  checkIn: async (data: CheckInRequest): Promise<Attendance> => {
    const response = await apiClient.post<Attendance>("/attendance/check-in", data);
    return response.data;
  },

  // 퇴근
  checkOut: async (): Promise<Attendance> => {
    const response = await apiClient.post<Attendance>("/attendance/check-out");
    return response.data;
  },

  // 랭킹 조회
  getRanking: async (): Promise<RankingItem[]> => {
    const response = await apiClient.get<RankingItem[]>("/attendance/ranking");
    return response.data;
  },

  // 내 통계 (주간 비교)
  getMyStats: async (userId: string): Promise<WeeklyStats> => {
    const response = await apiClient.get<WeeklyStats>(`/attendance/my-stats/${userId}`);
    return response.data;
  },

  // 월간 캘린더 및 통계
  getCalendar: async (userId: string, year: number, month: number): Promise<MonthlyStats> => {
    const monthStr = `${year}-${String(month).padStart(2, "0")}`;
    const response = await apiClient.get<MonthlyStats>(`/attendance/calendar/${userId}`, {
      params: { month: monthStr },
    });
    return response.data;
  },

  // 온도 조회
  getTemperature: async (): Promise<TemperatureResponse> => {
    const response = await apiClient.get<TemperatureResponse>("/sensor/temperature");
    return response.data;
  },
};
