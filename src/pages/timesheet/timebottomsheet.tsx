import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { Modal, Animated, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform } from "react-native";
import { Svg, Path, Circle } from "react-native-svg";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const BottomSheetContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-top: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: ${Platform.OS === "ios" ? 40 : 24}px;
  max-height: ${SCREEN_HEIGHT * 0.9}px;
`;

const HandleBar = styled.View`
  width: 40px;
  height: 4px;
  background-color: ${props => props.theme.colors.text.tertiary};
  border-radius: 2px;
  align-self: center;
  margin-bottom: 20px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const BottomSheetTitle = styled.Text`
  font-size: 22px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

const CloseIcon = () => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 15 15"
    fill="none"
  >
    <Path
      d="M6.44045 7.50095L0.219947 1.28195C0.150215 1.21222 0.0949012 1.12943 0.0571625 1.03832C0.0194239 0.947213 7.34745e-10 0.849563 0 0.750947C-7.34745e-10 0.652332 0.0194239 0.554681 0.0571625 0.463572C0.0949012 0.372463 0.150215 0.289679 0.219947 0.219947C0.289679 0.150215 0.372463 0.0949012 0.463572 0.0571625C0.554681 0.0194239 0.652332 -7.34745e-10 0.750947 0C0.849563 7.34745e-10 0.947213 0.0194239 1.03832 0.0571625C1.12943 0.0949012 1.21222 0.150215 1.28195 0.219947L7.50095 6.44045L13.7199 0.219947C13.8608 0.0791173 14.0518 0 14.2509 0C14.4501 0 14.6411 0.0791173 14.7819 0.219947C14.9228 0.360777 15.0019 0.551784 15.0019 0.750947C15.0019 0.950111 14.9228 1.14112 14.7819 1.28195L8.56145 7.50095L14.7819 13.7199C14.9228 13.8608 15.0019 14.0518 15.0019 14.2509C15.0019 14.4501 14.9228 14.6411 14.7819 14.7819C14.6411 14.9228 14.4501 15.0019 14.2509 15.0019C14.0518 15.0019 13.8608 14.9228 13.7199 14.7819L7.50095 8.56145L1.28195 14.7819C1.14112 14.9228 0.950111 15.0019 0.750947 15.0019C0.551784 15.0019 0.360777 14.9228 0.219947 14.7819C0.0791173 14.6411 0 14.4501 0 14.2509C0 14.0518 0.0791173 13.8608 0.219947 13.7199L6.44045 7.50095Z"
      fill="black"
    />
  </Svg>
);

const WhiteBoxShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.08)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

const WhiteBox = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const AttendanceRateRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AttendanceRateLeft = styled.View`
  flex: 1;
`;

const AttendanceRateLabel = styled.Text`
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

const TimeSection = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const TimeLeft = styled.View`
  flex: 1;
`;

const TimeLabel = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const TimeRight = styled.View`
  align-items: flex-end;
`;

const TimeDate = styled.Text`
  font-size: 13px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const TimeValue = styled.Text<{ $color: string }>`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.$color};
`;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DonutChart = ({ animatedPercentage }: { animatedPercentage: Animated.Value }) => {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = animatedPercentage.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

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
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#7F8EFF"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

interface TimeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  date: number;
  month: number;
  year: number;
  hours?: number;
  firstCheckIn?: string;
  lastCheckOut?: string;
}

export const TimeBottomSheet = ({
  visible,
  onClose,
  date,
  month,
  year,
  hours = 0,
  firstCheckIn,
  lastCheckOut,
}: TimeBottomSheetProps) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const percentageAnim = useRef(new Animated.Value(0)).current;
  const [displayPercentage, setDisplayPercentage] = useState(0);

  const calculateAttendancePercentage = () => {
    if (hours === 0) return 0;
    return Math.min((hours / 24) * 100, 100);
  };

  const attendancePercentage = calculateAttendancePercentage();

  useEffect(() => {
    let listener: string | null = null;

    if (visible) {
      slideAnim.setValue(SCREEN_HEIGHT);
      percentageAnim.setValue(0);
      setDisplayPercentage(0);

      listener = percentageAnim.addListener(({ value }) => {
        setDisplayPercentage(Math.round(value));
      });

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(percentageAnim, {
          toValue: attendancePercentage,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
      percentageAnim.setValue(0);
      setDisplayPercentage(0);
    }

    return () => {
      if (listener) {
        percentageAnim.removeListener(listener);
      }
    };
  }, [visible, slideAnim, percentageAnim, attendancePercentage]);

  const formatDate = () => {
    return `${year}.${String(month).padStart(2, "0")}.${String(date).padStart(2, "0")}`;
  };

  const formatDateWithDay = () => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayIndex = new Date(year, month - 1, date).getDay();
    return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")} (${dayNames[dayIndex]})`;
  };

  // UTC ISO 문자열을 오전/오후 HH:MM 형식으로 변환
  const formatTime = (isoString?: string): string => {
    if (!isoString) return "--";
    try {
      const date = new Date(isoString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours < 12 ? "오전" : "오후";
      const displayHours = hours % 12 || 12;
      return `${period} ${displayHours}:${String(minutes).padStart(2, "0")}`;
    } catch {
      return "--";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Overlay>
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
              }}
            >
              <BottomSheetContainer>
                <HandleBar />
                <TitleRow>
                  <BottomSheetTitle>Timemate</BottomSheetTitle>
                  <CloseButton onPress={onClose}>
                    <CloseIcon />
                  </CloseButton>
                </TitleRow>

                <WhiteBox style={WhiteBoxShadow}>
                  <AttendanceRateRow>
                    <AttendanceRateLeft>
                      <AttendanceRateLabel>오늘의 출근율</AttendanceRateLabel>
                      <AttendanceRateDate>{formatDate()}</AttendanceRateDate>
                    </AttendanceRateLeft>
                    <AttendanceRateChart>
                      <DonutChart animatedPercentage={percentageAnim} />
                      <ChartPercentage>{displayPercentage}%</ChartPercentage>
                    </AttendanceRateChart>
                  </AttendanceRateRow>
                </WhiteBox>

                <WhiteBox style={WhiteBoxShadow}>
                  <TimeSection>
                    <TimeLeft>
                      <TimeLabel>출근 시간</TimeLabel>
                    </TimeLeft>
                    <TimeRight>
                      <TimeDate>{formatDateWithDay()}</TimeDate>
                      <TimeValue $color="#39B861">{formatTime(firstCheckIn)}</TimeValue>
                    </TimeRight>
                  </TimeSection>
                </WhiteBox>

                <WhiteBox style={WhiteBoxShadow}>
                  <TimeSection>
                    <TimeLeft>
                      <TimeLabel>퇴근 시간</TimeLabel>
                    </TimeLeft>
                    <TimeRight>
                      <TimeDate>{formatDateWithDay()}</TimeDate>
                      <TimeValue $color="#E04141">{formatTime(lastCheckOut)}</TimeValue>
                    </TimeRight>
                  </TimeSection>
                </WhiteBox>
              </BottomSheetContainer>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
