import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components/native";
import { Platform, ActivityIndicator, RefreshControl } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { theme } from "../../styles";
import BagIcon from "../../../assets/svg/bag.svg";
import AlarmIcon from "../../../assets/svg/marketing.svg";
import HeaderIcon from "../../../assets/logo/Header.svg";
import { attendanceService } from "../../api/attendance";
import { RankingItem } from "../../types";

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
  column-gap: 6px;
`;

const AttendanceItemName = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  letter-spacing: -0.3px;
`;

const AttendanceItemTimeInName = styled.Text<{ $color: string }>`
  font-size: 14px;
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

interface MainProps {
  onNavigateToTimesheet?: () => void;
  onNavigateToAlarm?: () => void;
}

export const Main = ({ onNavigateToTimesheet, onNavigateToAlarm }: MainProps) => {
  const [attendanceData, setAttendanceData] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      // 랭킹 API를 사용하여 현재 구성원 상태 조회
      // 백엔드 API가 '현재 출근자'만 주는 게 아니라 전체를 주기 때문에 여기서 필터링/정렬
      const data = await attendanceService.getRanking();
      
      // 정렬 로직: 출근한 사람(is_checked_in=true)이 위로, 그 다음 이름순
      const sortedData = data.sort((a, b) => {
        if (a.is_checked_in && !b.is_checked_in) return -1;
        if (!a.is_checked_in && b.is_checked_in) return 1;
        return a.username.localeCompare(b.username);
      });

      setAttendanceData(sortedData);
    } catch (error) {
      console.error("Failed to fetch main attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAttendanceData();
    setRefreshing(false);
  }, []);

  // useFocusEffect 대신 useEffect 사용
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // 초 단위 시간을 "HH:MM" 형식으로 변환 (누적 시간 표시용)
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

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
        <PageTitle>Mobicom</PageTitle>
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

        {isLoading ? (
          <ActivityIndicator color="#7F8EFF" style={{ marginTop: 20 }} />
        ) : (
          <AttendanceList>
            {attendanceData.map((item, index) => {
              const isPresent = item.is_checked_in;
              const dotColor = isPresent ? "#7F8EFF" : "#BABBC1";
              const timeColor = isPresent ? "#7F8EFF" : "#BABBC1";
              
              return (
                <AttendanceItem
                  key={item.user_id}
                  style={AttendanceItemShadow}
                >
                  <AttendanceItemContent>
                    <AttendanceItemNameContainer>
                      <AttendanceItemName>{item.username}님</AttendanceItemName>
                      <DotsIconWrapper>
                        <DotsIcon />
                      </DotsIconWrapper>
                      {/* 누적 시간 표시 (선택사항) */}
                      {/* <AttendanceItemTimeInName $color={timeColor}>{formatTotalTime(item.total_time)}</AttendanceItemTimeInName> */}
                    </AttendanceItemNameContainer>
                    <AttendanceItemTime>
                      {isPresent ? "출근 중" : "부재중"}
                    </AttendanceItemTime>
                  </AttendanceItemContent>
                  <AttendanceItemRight>
                    <StatusDot $color={dotColor} />
                  </AttendanceItemRight>
                </AttendanceItem>
              );
            })}
          </AttendanceList>
        )}
      </Content>
    </Screen>
  );
};
