import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components/native";
import { Platform, ScrollView, TouchableOpacity, Animated, RefreshControl } from "react-native";
import { Svg, Path, Circle } from "react-native-svg";
import { TimeBottomSheet } from "./timebottomsheet";
import HeaderIcon from "../../../assets/logo/Header.svg";
import { attendanceService } from "../../api/attendance";
import { storage } from "../../utils/storage";
import { MonthlyStats, CalendarDay } from "../../types";

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

const CalendarSection = styled(Animated.View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

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

const CalendarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
  margin-bottom: 0px;
`;

const CalendarDayWrapper = styled.TouchableOpacity<{
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

interface CalendarDayUI {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  hours?: number;
  firstCheckIn?: string;
  lastCheckOut?: string;
}

const getBackgroundColor = (hours: number): string => {
  if (hours === 0) return "transparent";
  if (hours <= 4) return "#E6E9FF";
  if (hours <= 7) return "#C8D0FF";
  if (hours <= 10) return "#AAB7FF";
  return "#8FA0FF";
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    date: number;
    month: number;
    year: number;
    hours?: number;
    firstCheckIn?: string;
    lastCheckOut?: string;
  } | null>(null);
  
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [calendarMap, setCalendarMap] = useState<Record<string, CalendarDay>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");

  const calendarOpacity = useRef(new Animated.Value(1)).current;
  const calendarTranslateX = useRef(new Animated.Value(0)).current;
  const userInfoOpacity = useRef(new Animated.Value(1)).current;
  const userInfoTranslateX = useRef(new Animated.Value(0)).current;
  const attendanceRateOpacity = useRef(new Animated.Value(1)).current;
  const attendanceRateTranslateX = useRef(new Animated.Value(0)).current;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  
  const loadData = async () => {
    try {
      const user = await storage.getUserInfo();
      setUsername(user?.username || "사용자");
      
      if (user?.user_id) {
        // 백엔드 API 호출
        const data = await attendanceService.getCalendar(user.user_id, year, month);
        setMonthlyStats(data);
        
        // CalendarDay 리스트를 맵으로 변환 (날짜 문자열 키)
        const map: Record<string, CalendarDay> = {};
        if (data.calendar) {
          data.calendar.forEach(day => {
            map[day.date] = day;
          });
        }
        setCalendarMap(map);
      }
    } catch (error) {
      console.error("Error loading timesheet data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [currentDate]);

  const generateCalendar = (year: number, month: number): CalendarDayUI[] => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
    const calendar: CalendarDayUI[] = [];

    // 이전 달
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonthDate = daysInPrevMonth - i;
      const date = new Date(year, month - 2, prevMonthDate);
      calendar.push({
        date: prevMonthDate,
        month: month - 1,
        year: year,
        isCurrentMonth: false,
        isSunday: date.getDay() === 0,
        isSaturday: date.getDay() === 6,
      });
    }

    // 이번 달
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendarMap[dateStr];
      
      calendar.push({
        date: day,
        month: month,
        year: year,
        isCurrentMonth: true,
        isSunday: date.getDay() === 0,
        isSaturday: date.getDay() === 6,
        hours: dayData?.total_time || 0,
        firstCheckIn: dayData?.first_check_in,
        lastCheckOut: dayData?.last_check_out,
      });
    }

    // 다음 달
    const remainingDays = 42 - calendar.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month, day);
      calendar.push({
        date: day,
        month: month + 1,
        year: year,
        isCurrentMonth: false,
        isSunday: date.getDay() === 0,
        isSaturday: date.getDay() === 6,
      });
    }

    return calendar;
  };

  const calendar = generateCalendar(year, month);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                <UserNameValue>{username}님</UserNameValue>
              </UserStatItem>
              <UserStatItem>
                <UserStatLabel $color="#39B861">누적 출석시간</UserStatLabel>
                <UserStatValue>
                  {(() => {
                    const hours = monthlyStats?.total_time || 0;
                    const h = Math.floor(hours);
                    const m = Math.round((hours - h) * 60);
                    return `${h}시간 ${m}분`;
                  })()}
                </UserStatValue>
              </UserStatItem>
              <UserStatItem>
                <UserStatLabel $color="#E04141">출석률</UserStatLabel>
                <UserStatValue>{monthlyStats?.attendance_rate || 0}%</UserStatValue>
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
            <DonutChart percentage={monthlyStats?.attendance_rate || 0} />
            <ChartPercentage>{monthlyStats?.attendance_rate || 0}%</ChartPercentage>
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
                    month: day.month,
                    year: day.year,
                    hours: day.hours,
                    firstCheckIn: day.firstCheckIn,
                    lastCheckOut: day.lastCheckOut,
                  });
                  setShowBottomSheet(true);
                }
              };

              return (
                <CalendarDayWrapper
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
                </CalendarDayWrapper>
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
          firstCheckIn={selectedDate.firstCheckIn}
          lastCheckOut={selectedDate.lastCheckOut}
        />
      )}
    </Screen>
  );
};
