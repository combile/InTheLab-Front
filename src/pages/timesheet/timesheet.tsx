import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components/native";
import { Platform, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Svg, Path, Circle } from "react-native-svg";
import { TimeBottomSheet } from "./timebottomsheet";
import HeaderIcon from "../../../assets/logo/Header.svg";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const HeaderIconWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${props => props.theme.colors.background};
  padding-top: 50px;
  padding-bottom: 8px;
  padding-left: 24px;
`;

const PageTitle = styled.Text`
  font-size: 22px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 24px;
  letter-spacing: -1px;
`;

const DateNavigationSectionShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.08)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

const DateNavigationSection = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 16px 20px;
  position: relative;
  column-gap: 12px;
`;

const ArrowButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

const LeftArrowIcon = () => (
  <Svg
    width={8}
    height={9}
    viewBox="0 0 8 9"
    fill="none"
  >
    <Path
      d="M0 4.33008L7.80086 -4.95911e-05L7.80086 8.66021L0 4.33008Z"
      fill="#191C32"
    />
  </Svg>
);

const RightArrowIcon = () => (
  <Svg
    width={8}
    height={9}
    viewBox="0 0 8 9"
    fill="none"
  >
    <Path
      d="M7.80078 4.33008L-7.82013e-05 -4.95911e-05L-7.82013e-05 8.66021L7.80078 4.33008Z"
      fill="#191C32"
    />
  </Svg>
);

const DateText = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  position: absolute;
  right: 20px;
`;

const DropdownText = styled.Text`
  font-size: 14px;
  font-family: ${props => props.theme.fonts.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const DropdownArrow = () => (
  <Svg
    width={8}
    height={6}
    viewBox="0 0 8 6"
    fill="none"
  >
    <Path
      d="M1 1L4 4L7 1"
      stroke="#191C32"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserInfoSectionShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.08)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

const UserInfoSection = styled(Animated.View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserInfoLeft = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 12px;
`;

const UserStatsRow = styled.View`
  flex-direction: row;
  column-gap: 24px;
  align-items: center;
`;

const UserStatItem = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const UserNameValue = styled.Text`
  font-size: 22px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const UserStatLabel = styled.Text<{ $color?: string }>`
  font-size: 13px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.$color || props.theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const UserStatValue = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const CalendarSectionShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.08)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

/* --- 달력 카드 전체 --- */
const CalendarSection = styled(Animated.View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

/* --- 요일 헤더 --- */
const CalendarHeader = styled.View`
  flex-direction: row;
  margin-bottom: 6px;
  background-color: rgba(127, 142, 255, 0.05);
  border-radius: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const CalendarDayHeader = styled.View<{ $isFirst?: boolean; $isLast?: boolean }>`
  width: 14.28%;
  aspect-ratio: 0.75;
  align-items: center;
  justify-content: center;
`;

const CalendarDayHeaderText = styled.Text<{ $isSunday?: boolean; $isSaturday?: boolean }>`
  font-size: 13px;
  font-family: ${props => props.theme.fonts.semiBold};
  color: ${props => {
    if (props.$isSunday) return "#FF3B30";
    if (props.$isSaturday) return "#007AFF";
    return props.theme.colors.text.secondary;
  }};
`;

/* --- 날짜 그리드 --- */
const CalendarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
  margin-bottom: 0px;
`;

/* 격자 셀 (배경 없이 위치만) */
const CalendarDay = styled.TouchableOpacity<{
  $isCurrentMonth?: boolean;
  $isSunday?: boolean;
  $isSaturday?: boolean;
  $backgroundColor?: string;
  $isFirstRow?: boolean;
  $isLastRow?: boolean;
  $isFirstCol?: boolean;
  $isLastCol?: boolean;
}>`
  width: 14.28%;
  aspect-ratio: 0.85;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

/* 실제 pill 배경 + 숫자 컨테이너 */
const CalendarDayInner = styled.View<{ $backgroundColor?: string }>`
  width: 80%;
  height: 80%;
  border-radius: 10px;
  background-color: ${props => props.$backgroundColor || "transparent"};
  align-items: center;
  justify-content: center;
`;

const CalendarDayText = styled.Text<{
  $isCurrentMonth?: boolean;
  $isSunday?: boolean;
  $isSaturday?: boolean;
  $hasBackground?: boolean;
}>`
  font-size: 15px;
  font-family: ${props => props.theme.fonts.medium};
  color: ${props => {
    if (props.$hasBackground) return "#FFFFFF";
    if (!props.$isCurrentMonth) return props.theme.colors.text.tertiary;
    if (props.$isSunday) return "#FF3B30";
    if (props.$isSaturday) return "#007AFF";
    return props.theme.colors.text.primary;
  }};
`;

/* --- 범례 --- */
const CalendarLegend = styled.View`
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: -6px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
`;

const LegendBox = styled.View<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 6px;
  background-color: ${props => props.$color};
`;

const LegendText = styled.Text`
  font-size: 11px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
`;

const AttendanceRateSectionShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.08)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

const AttendanceRateSection = styled(Animated.View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AttendanceRateLeft = styled.View`
  flex: 1;
`;

const AttendanceRateTitle = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const AttendanceRateDate = styled.Text`
  font-size: 13px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
`;

const AttendanceRateChart = styled.View`
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ChartPercentage = styled.Text`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  position: absolute;
  z-index: 1;
`;

interface CalendarDayData {
  date: number;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  hours?: number;
}

const getHoursForDate = (date: number): number => {
  const mockData: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 3,
    7: 0,
    8: 5,
    9: 6,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    15: 11,
    16: 12,
    17: 13,
    18: 14,
    19: 15,
    20: 16,
    22: 4,
    23: 5,
    24: 6,
    25: 7,
  };
  return mockData[date] || 0;
};

const getStartTimeForDate = (date: number): string | undefined => {
  const mockData: Record<number, string> = {
    6: "09:00",
    8: "09:30",
    9: "09:00",
    10: "08:30",
    11: "09:00",
    12: "08:45",
    13: "09:15",
    15: "09:00",
    16: "08:30",
    17: "09:00",
    18: "08:45",
    19: "09:00",
    20: "08:30",
    22: "09:30",
    23: "09:00",
    24: "09:15",
    25: "09:00",
  };
  return mockData[date];
};

const getEndTimeForDate = (date: number): string | undefined => {
  const mockData: Record<number, string> = {
    6: "12:00",
    8: "14:30",
    9: "15:00",
    10: "15:30",
    11: "17:00",
    12: "17:45",
    13: "19:15",
    15: "20:00",
    16: "20:30",
    17: "22:00",
    18: "22:45",
    19: "00:00",
    20: "00:30",
    22: "13:30",
    23: "14:00",
    24: "15:15",
    25: "16:00",
  };
  return mockData[date];
};

/* 색상 단계 조금 더 예쁘게 */
const getBackgroundColor = (hours: number): string => {
  if (hours === 0) return "transparent";
  if (hours <= 4) return "#E6E9FF";
  if (hours <= 7) return "#C8D0FF";
  if (hours <= 10) return "#AAB7FF";
  return "#8FA0FF";
};

// 월별 목업 데이터
const getMonthlyData = (year: number, month: number) => {
  const data: Record<string, { totalHours: string; attendanceRate: number; monthlyRate: number }> = {
    "2025-1": { totalHours: "45:30", attendanceRate: 65, monthlyRate: 62 },
    "2025-2": { totalHours: "52:15", attendanceRate: 68, monthlyRate: 65 },
    "2025-3": { totalHours: "58:20", attendanceRate: 70, monthlyRate: 68 },
    "2025-4": { totalHours: "63:45", attendanceRate: 72, monthlyRate: 70 },
    "2025-5": { totalHours: "68:10", attendanceRate: 75, monthlyRate: 73 },
    "2025-6": { totalHours: "73:46", attendanceRate: 78, monthlyRate: 76 },
    "2025-7": { totalHours: "79:30", attendanceRate: 80, monthlyRate: 78 },
    "2025-8": { totalHours: "85:15", attendanceRate: 82, monthlyRate: 80 },
    "2025-9": { totalHours: "91:20", attendanceRate: 85, monthlyRate: 83 },
    "2025-10": { totalHours: "96:45", attendanceRate: 87, monthlyRate: 85 },
    "2025-11": { totalHours: "102:10", attendanceRate: 88, monthlyRate: 86 },
    "2025-12": { totalHours: "108:30", attendanceRate: 90, monthlyRate: 88 },
  };

  const key = `${year}-${month}`;
  return data[key] || { totalHours: "73:46", attendanceRate: 68, monthlyRate: 68 };
};

const generateCalendar = (year: number, month: number): CalendarDayData[] => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const calendar: CalendarDayData[] = [];

  // 이전 달
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonthDate = daysInPrevMonth - i;
    const date = new Date(year, month - 2, prevMonthDate);
    calendar.push({
      date: prevMonthDate,
      isCurrentMonth: false,
      isSunday: date.getDay() === 0,
      isSaturday: date.getDay() === 6,
    });
  }

  // 이번 달
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    calendar.push({
      date: day,
      isCurrentMonth: true,
      isSunday: date.getDay() === 0,
      isSaturday: date.getDay() === 6,
      hours: getHoursForDate(day),
    });
  }

  // 다음 달
  const remainingDays = 42 - calendar.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month, day);
    calendar.push({
      date: day,
      isCurrentMonth: false,
      isSunday: date.getDay() === 0,
      isSaturday: date.getDay() === 6,
    });
  }

  return calendar;
};

const DonutChart = ({ percentage }: { percentage: number }) => {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      const offset = circumference - (value / 100) * circumference;
      setAnimatedOffset(offset);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [percentage, animatedValue, circumference]);

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E5E5E5"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#7F8EFF"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={animatedOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

export const Timesheet = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));
  const [viewMode, setViewMode] = useState<"월간" | "주간">("월간");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    date: number;
    month: number;
    year: number;
    hours?: number;
    startTime?: string;
    endTime?: string;
  } | null>(null);

  const calendarOpacity = useRef(new Animated.Value(1)).current;
  const calendarTranslateX = useRef(new Animated.Value(0)).current;
  const userInfoOpacity = useRef(new Animated.Value(1)).current;
  const userInfoTranslateX = useRef(new Animated.Value(0)).current;
  const attendanceRateOpacity = useRef(new Animated.Value(1)).current;
  const attendanceRateTranslateX = useRef(new Animated.Value(0)).current;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const calendar = generateCalendar(year, month);
  const monthlyData = getMonthlyData(year, month);

  const handlePrevMonth = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(calendarTranslateX, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoTranslateX, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateTranslateX, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(calendarTranslateX, {
          toValue: 20,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoTranslateX, {
          toValue: 20,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateTranslateX, {
          toValue: 20,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setCurrentDate(new Date(year, month - 2, 1));
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(calendarTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNextMonth = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(calendarTranslateX, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoTranslateX, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateTranslateX, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(calendarTranslateX, {
          toValue: -20,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoTranslateX, {
          toValue: -20,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateTranslateX, {
          toValue: -20,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setCurrentDate(new Date(year, month, 1));
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(calendarTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(userInfoTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attendanceRateTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const dateRange = `${year}.${String(month).padStart(2, "0")}.${String(monthStart.getDate()).padStart(
    2,
    "0"
  )} ~ ${year}.${String(month).padStart(2, "0")}.${String(monthEnd.getDate()).padStart(2, "0")}`;

  return (
    <Screen>
      <HeaderIconWrapper>
        <HeaderIcon
          width={24}
          height={39}
        />
      </HeaderIconWrapper>
      <Content
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 70,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DateNavigationSection style={DateNavigationSectionShadow}>
          <ArrowButton onPress={handlePrevMonth}>
            <LeftArrowIcon />
          </ArrowButton>
          <DateText>
            {year}.{String(month).padStart(2, "0")}
          </DateText>
          <ArrowButton onPress={handleNextMonth}>
            <RightArrowIcon />
          </ArrowButton>
        </DateNavigationSection>

        <UserInfoSection
          style={[
            UserInfoSectionShadow,
            {
              opacity: userInfoOpacity,
              transform: [{ translateX: userInfoTranslateX }],
            },
          ]}
        >
          <UserInfoLeft>
            <UserStatsRow>
              <UserStatItem>
                <UserNameValue>우은식</UserNameValue>
              </UserStatItem>
              <UserStatItem>
                <UserStatLabel $color="#39B861">누적 출석시간</UserStatLabel>
                <UserStatValue>{monthlyData.totalHours}</UserStatValue>
              </UserStatItem>
              <UserStatItem>
                <UserStatLabel $color="#E04141">출석률</UserStatLabel>
                <UserStatValue>{monthlyData.attendanceRate}%</UserStatValue>
              </UserStatItem>
            </UserStatsRow>
          </UserInfoLeft>
        </UserInfoSection>

        <AttendanceRateSection
          style={[
            AttendanceRateSectionShadow,
            {
              opacity: attendanceRateOpacity,
              transform: [{ translateX: attendanceRateTranslateX }],
            },
          ]}
        >
          <AttendanceRateLeft>
            <AttendanceRateTitle>이달의 출근율</AttendanceRateTitle>
            <AttendanceRateDate>{dateRange}</AttendanceRateDate>
          </AttendanceRateLeft>
          <AttendanceRateChart>
            <DonutChart percentage={monthlyData.monthlyRate} />
            <ChartPercentage>{monthlyData.monthlyRate}%</ChartPercentage>
          </AttendanceRateChart>
        </AttendanceRateSection>

        {/* --- 달력 --- */}
        <CalendarSection
          style={[
            CalendarSectionShadow,
            {
              opacity: calendarOpacity,
              transform: [{ translateX: calendarTranslateX }],
            },
          ]}
        >
          <CalendarHeader>
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <CalendarDayHeader
                key={day}
                $isFirst={index === 0}
                $isLast={index === 6}
              >
                <CalendarDayHeaderText
                  $isSunday={index === 0}
                  $isSaturday={index === 6}
                >
                  {day}
                </CalendarDayHeaderText>
              </CalendarDayHeader>
            ))}
          </CalendarHeader>

          <CalendarGrid>
            {calendar.map((day, index) => {
              const row = Math.floor(index / 7);
              const col = index % 7;
              const isFirstRow = row === 0;
              const isLastRow = row === Math.floor((calendar.length - 1) / 7);
              const isFirstCol = col === 0;
              const isLastCol = col === 6;

              const handleDatePress = () => {
                if (day.isCurrentMonth) {
                  setSelectedDate({
                    date: day.date,
                    month: month,
                    year: year,
                    hours: day.hours,
                    startTime: getStartTimeForDate(day.date),
                    endTime: getEndTimeForDate(day.date),
                  });
                  setShowBottomSheet(true);
                }
              };

              return (
                <CalendarDay
                  key={index}
                  $isCurrentMonth={day.isCurrentMonth}
                  $isSunday={day.isSunday}
                  $isSaturday={day.isSaturday}
                  $isFirstRow={isFirstRow}
                  $isLastRow={isLastRow}
                  $isFirstCol={isFirstCol}
                  $isLastCol={isLastCol}
                  onPress={handleDatePress}
                  activeOpacity={0.7}
                >
                  <CalendarDayInner
                    $backgroundColor={day.isCurrentMonth && day.hours ? getBackgroundColor(day.hours) : "transparent"}
                  >
                    <CalendarDayText
                      $isCurrentMonth={day.isCurrentMonth}
                      $isSunday={day.isSunday}
                      $isSaturday={day.isSaturday}
                      $hasBackground={day.isCurrentMonth && day.hours ? true : false}
                    >
                      {day.date}
                    </CalendarDayText>
                  </CalendarDayInner>
                </CalendarDay>
              );
            })}
          </CalendarGrid>

          <CalendarLegend>
            <LegendItem>
              <LegendBox $color="#E6E9FF" />
              <LegendText>4+</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendBox $color="#C8D0FF" />
              <LegendText>7+</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendBox $color="#AAB7FF" />
              <LegendText>10+</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendBox $color="#8FA0FF" />
              <LegendText>12+</LegendText>
            </LegendItem>
          </CalendarLegend>
        </CalendarSection>
      </Content>
      {selectedDate && (
        <TimeBottomSheet
          visible={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          date={selectedDate.date}
          month={selectedDate.month}
          year={selectedDate.year}
          hours={selectedDate.hours}
          startTime={selectedDate.startTime}
          endTime={selectedDate.endTime}
        />
      )}
    </Screen>
  );
};
