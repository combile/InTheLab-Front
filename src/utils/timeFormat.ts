// TITLE: 시간 변환 유틸

/**
 * MARK: - UTC ISO-8601 문자열을 로컬 시간으로 변환
 * @param dateStr - ISO-8601 형식 UTC 문자열 (예: "2024-01-15T09:30:00.000000+00:00")
 * @param locale - 로케일 (기본값: 'ko-KR')
 * @returns 변환된 날짜/시간 객체 또는 null
 */
export function utcStringToLocal(dateStr: string | null, locale = "ko-KR") {
  if (!dateStr) return null;
  const dt = new Date(dateStr);
  return {
    date: dt.toLocaleDateString(locale),
    time: dt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
    dateTime: dt.toLocaleString(locale),
  };
}

/**
 * MARK: - 시간(float)을 시간/분으로 변환
 * API 응답: total_time, this_week_total 등은 시간 단위 (예: 12.5 = 12시간 30분)
 * @param hours - 시간 단위 float 값
 * @returns { hours: number, minutes: number }
 */
export function hoursToHm(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return { hours: h, minutes: m };
}

/**
 * MARK: - 시간(float)을 "H시간 M분" 형식 문자열로 변환
 * @param hours - 시간 단위 float 값
 * @returns 포맷된 문자열 (예: "12시간 30분")
 */
export function formatHoursToKorean(hours: number): string {
  const { hours: h, minutes: m } = hoursToHm(hours);
  return `${h}시간 ${m}분`;
}

/**
 * MARK: 시간(float)을 "H:MM" 형식 문자열로 변환
 * @param hours - 시간 단위 float 값
 * @returns 포맷된 문자열 (예: "12:30")
 */
export function formatHoursToColonFormat(hours: number): string {
  const { hours: h, minutes: m } = hoursToHm(hours);
  return `${h}:${String(m).padStart(2, "0")}`;
}
