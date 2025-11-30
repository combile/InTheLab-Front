import React from "react";
import styled from "styled-components/native";
import { Platform } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { theme } from "../../styles";
import BagIcon from "../../../assets/svg/bag.svg";
import AlarmIcon from "../../../assets/svg/marketing.svg";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const HeaderSection = styled.View`
  margin-bottom: 10px;
  align-items: flex-start;
`;

const LogoWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const LogoText = styled.Text`
  font-size: 32px;
  font-family: ${props => props.theme.fonts.black};
  color: ${props => props.theme.colors.text.primary};
  line-height: 40px;
`;

const LogoDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.primary};
  margin-top: 8px;
  margin-left: 2px;
`;

const LabName = styled.Text`
  color: #000;
  font-feature-settings: "liga" off, "clig" off;
  font-family: ${props => props.theme.fonts.bold};
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: -1px;
`;

const CardsRow = styled.View`
  flex-direction: row;
  column-gap: 12px;
  margin-bottom: 28px;
`;

const AttendanceCard = styled.TouchableOpacity`
  flex: 1;
  border-radius: 12px;
  background: #7f8eff;
  min-height: 130px;
  padding: 18px;
  position: relative;
  overflow: hidden;
`;

const AttendanceCardShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(127, 142, 255, 0.25)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 4 };

const AlarmCard = styled.TouchableOpacity`
  flex: 1;
  border-radius: 12px;
  background: #fff;
  min-height: 130px;
  padding: 18px;
  position: relative;
  overflow: hidden;
`;

const AlarmCardShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.08)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

const CardTitle = styled.Text`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.bold};
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
`;

const AlarmCardTitle = styled.Text`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 6px;
  letter-spacing: -0.3px;
`;

const CardSubtitle = styled.Text`
  font-size: 12px;
  font-family: ${props => props.theme.fonts.primary};
  color: rgba(255, 255, 255, 0.95);
  line-height: 17px;
  padding-right: 58px;
`;

const AlarmCardSubtitle = styled.Text`
  font-size: 12px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 17px;
  padding-right: 58px;
`;

const CardIconWrapper = styled.View`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 48px;
  height: 48px;
  opacity: 0.9;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 18px;
  letter-spacing: -0.5px;
`;

const AttendanceList = styled.View`
  row-gap: 14px;
`;

const AttendanceItem = styled.View`
  border-radius: 16px;
  background: #fff;
  width: 100%;
  min-height: 68px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AttendanceItemShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.06)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

const AttendanceItemContent = styled.View`
  flex: 1;
  margin-right: 12px;
`;

const AttendanceItemNameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const AttendanceItemName = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  letter-spacing: -0.3px;
`;

const AttendanceItemTimeInName = styled.Text<{ $color: string }>`
  font-size: 16px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.$color};
  letter-spacing: -0.3px;
`;

const DotsIcon = () => (
  <Svg
    width={10}
    height={2}
    viewBox="0 0 10 2"
    fill="none"
  >
    <Circle
      cx={1}
      cy={1}
      r={1}
      fill="#7F8EFF"
    />
    <Circle
      cx={5}
      cy={1}
      r={1}
      fill="#7F8EFF"
    />
    <Circle
      cx={9}
      cy={1}
      r={1}
      fill="#7F8EFF"
    />
  </Svg>
);

const DotsIconWrapper = styled.View`
  margin-left: 4px;
  margin-right: 4px;
  align-items: center;
  justify-content: center;
`;

const AttendanceItemTime = styled.Text`
  font-size: 13px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 18px;
`;

const AttendanceItemRight = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;

const StatusDot = styled.View<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => props.$color};
`;

const mockAttendanceData = [
  { name: "우은식", time: "4:20:30", status: "5시간전 출근" },
  { name: "강윤서", time: "2:15:45", status: "2시간전 출근" },
  { name: "이민지", time: "0:45:20", status: "1시간전 출근" },
  { name: "예다은", time: "0:00:00", status: "2일전 출근" },
  { name: "정민성", time: "0:00:00", status: "5일전 출근" },
];

interface MainProps {
  onNavigateToTimesheet?: () => void;
  onNavigateToAlarm?: () => void;
}

export const Main = ({ onNavigateToTimesheet, onNavigateToAlarm }: MainProps) => {
  // 시간 문자열을 초로 변환하는 함수 (예: "4:20:30" -> 15630)
  const timeToSeconds = (timeStr: string): number => {
    if (timeStr === "0:00:00") return 0;
    const parts = timeStr.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  // 정렬: 1. 연구실에 있는 사람(보라색) 우선, 2. 최근 출근 시간 순
  const sortedAttendanceData = [...mockAttendanceData].sort((a, b) => {
    const aIsPresent = a.time !== "0:00:00";
    const bIsPresent = b.time !== "0:00:00";

    // 연구실에 있는 사람이 위로
    if (aIsPresent && !bIsPresent) return -1;
    if (!aIsPresent && bIsPresent) return 1;

    // 둘 다 있거나 둘 다 없으면, 최근 출근 시간 순 (작은 값이 위로 = 최근 출근이 위로)
    const aSeconds = timeToSeconds(a.time);
    const bSeconds = timeToSeconds(b.time);

    // 0:00:00인 경우는 맨 아래로
    if (aSeconds === 0 && bSeconds !== 0) return 1;
    if (aSeconds !== 0 && bSeconds === 0) return -1;

    return aSeconds - bSeconds;
  });

  return (
    <Screen>
      <Content
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection>
          <LogoWrapper>
            <LogoText>L</LogoText>
            <LogoDot />
          </LogoWrapper>
          <LabName>Mobicom</LabName>
        </HeaderSection>

        <CardsRow>
          <AttendanceCard
            style={AttendanceCardShadow}
            activeOpacity={0.8}
            onPress={onNavigateToTimesheet}
          >
            <CardTitle>출근부</CardTitle>
            <CardSubtitle numberOfLines={1}>나의 출근 기록은?</CardSubtitle>
            <CardIconWrapper>
              <BagIcon
                width={48}
                height={48}
              />
            </CardIconWrapper>
          </AttendanceCard>

          <AlarmCard
            style={AlarmCardShadow}
            activeOpacity={0.8}
            onPress={onNavigateToAlarm}
          >
            <AlarmCardTitle>알리미</AlarmCardTitle>
            <AlarmCardSubtitle numberOfLines={1}>연구실 소식 확인!</AlarmCardSubtitle>
            <CardIconWrapper>
              <AlarmIcon
                width={48}
                height={48}
              />
            </CardIconWrapper>
          </AlarmCard>
        </CardsRow>

        <SectionTitle>현재 Mobicom에는?</SectionTitle>

        <AttendanceList>
          {sortedAttendanceData.map((item, index) => {
            const isPresent = item.time !== "0:00:00";
            const dotColor = isPresent ? "#7F8EFF" : "#BABBC1";
            const timeColor = isPresent ? "#7F8EFF" : "#BABBC1";
            return (
              <AttendanceItem
                key={index}
                style={AttendanceItemShadow}
              >
                <AttendanceItemContent>
                  <AttendanceItemNameContainer>
                    <AttendanceItemName>{item.name}님</AttendanceItemName>
                    <DotsIconWrapper>
                      <DotsIcon />
                    </DotsIconWrapper>
                    <AttendanceItemTimeInName $color={timeColor}>{item.time}</AttendanceItemTimeInName>
                  </AttendanceItemNameContainer>
                  <AttendanceItemTime>{item.status}</AttendanceItemTime>
                </AttendanceItemContent>
                <AttendanceItemRight>
                  <StatusDot $color={dotColor} />
                </AttendanceItemRight>
              </AttendanceItem>
            );
          })}
        </AttendanceList>
      </Content>
    </Screen>
  );
};
