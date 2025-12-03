import React, { useState, useEffect } from "react";
import { Platform, RefreshControl, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Svg, Path } from "react-native-svg";
import { attendanceService } from "../../api/attendance";
import { storage } from "../../utils/storage";
import { RankingItem, User } from "../../types";

interface AttendanceRankingProps {
  onGoBack?: () => void;
}

// 백엔드 API는 기간별 필터링을 지원하지 않으므로 일단 "전체"만 보여주거나
// 프론트엔드에서 필터링할 수 없으니 단일 옵션으로 변경하거나 API 스펙에 맞춤
const periods = ["누적"]; 

const sectionShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(16, 28, 71, 0.15)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
      }
    : {
        elevation: 6,
      };

export const AttendanceRanking = ({ onGoBack }: AttendanceRankingProps) => {
  const [activePeriod, setActivePeriod] = useState(periods[0]);
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [user, ranking] = await Promise.all([
        storage.getUserInfo(),
        attendanceService.getRanking(),
      ]);
      
      setCurrentUser(user);
      
      // 백엔드에서 이미 total_time 내림차순 정렬되어 옴
      // 순위(rank) 정보 추가
      const rankingWithRank = ranking.map((item, index) => ({
        ...item,
        rank: index + 1,
        // 임시 UI 데이터
        role: "연구원",
        avatar: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=120&q=80"
      }));
      
      setRankingData(rankingWithRank);
    } catch (error) {
      console.error("Failed to load ranking data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // 초 단위 시간을 "HH:MM" 형식으로 변환
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${String(minutes).padStart(2, "0")}`;
  };

  const featured = rankingData.slice(0, 3);
  const others = rankingData.slice(3);

  // 내 랭킹 정보 찾기
  const myRanking = rankingData.find(item => item.username === currentUser?.username);

  return (
    <Screen>
      <Header>
        <BackButton onPress={onGoBack}>
          <BackIcon />
        </BackButton>
        <HeaderTitle>연구실 출근 랭킹</HeaderTitle>
        <Spacer />
      </Header>
      <Content
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#7F8EFF" style={{ marginTop: 50 }} />
        ) : (
          <>
            {myRanking && (
              <HighlightCard style={sectionShadow}>
                <Avatar source={{ uri: myRanking.avatar }} />
                <HighlightInfo>
                  <UserName>{myRanking.username}</UserName>
                  <UserMeta>{myRanking.lab_name}</UserMeta>
                </HighlightInfo>
                <DurationBlock>
                  <DurationLabel>누적시간</DurationLabel>
                  <DurationValue>{formatDuration(myRanking.total_time)}</DurationValue>
                </DurationBlock>
              </HighlightCard>
            )}

            <SectionHeader>
              <SectionTitle>누적시간 랭킹</SectionTitle>
              <ContextInfo>전체 기간 데이터 기준으로 정렬했어요</ContextInfo>
            </SectionHeader>

            {/* 기간 선택 (지금은 '누적' 하나뿐) */}
            <SegmentControl>
              {periods.map(period => (
                <SegmentButton
                  key={period}
                  $active={period === activePeriod}
                  onPress={() => setActivePeriod(period)}
                  activeOpacity={0.9}
                >
                  <SegmentLabel $active={period === activePeriod}>{period}</SegmentLabel>
                </SegmentButton>
              ))}
            </SegmentControl>

            <PodiumRow>
              {featured.map(entry => (
                <PodiumCard
                  key={entry.user_id}
                  style={sectionShadow}
                  $primary={entry.rank === 1}
                >
                  <PodiumBadge $primary={entry.rank === 1}>
                    {entry.rank === 1 ? <CrownIcon /> : <PodiumBadgeText>{`${entry.rank}`}</PodiumBadgeText>}
                  </PodiumBadge>
                  <PodiumName>{entry.username}</PodiumName>
                  <PodiumRole>{entry.role}</PodiumRole>
                  <PodiumDuration>{formatDuration(entry.total_time)}</PodiumDuration>
                </PodiumCard>
              ))}
            </PodiumRow>

            <RankingList>
              {others.map(item => (
                <RankingCell key={item.user_id}>
                  <CellLeft>
                    <CellBadge>{item.rank}</CellBadge>
                    <CellMeta>
                      <CellRole>{item.role}</CellRole>
                      <CellName>{item.username}</CellName>
                    </CellMeta>
                  </CellLeft>
                  <CellDuration>{formatDuration(item.total_time)}</CellDuration>
                </RankingCell>
              ))}
            </RankingList>
          </>
        )}
      </Content>
    </Screen>
  );
};

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  background-color: ${props => props.theme.colors.background};
  z-index: 10;
`;

const BackButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const Spacer = styled.View`
  width: 36px;
`;

const HighlightCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 26px;
  padding: 18px;
  margin-bottom: 24px;
`;

const Avatar = styled.Image`
  width: 52px;
  height: 52px;
  border-radius: 26px;
  margin-right: 16px;
`;

const HighlightInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fonts.bold};
`;

const UserMeta = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.fonts.primary};
  margin-top: 2px;
`;

const DurationBlock = styled.View`
  align-items: flex-end;
`;

const DurationLabel = styled.Text`
  font-size: 13px;
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.fonts.medium};
  margin-bottom: 4px;
`;

const DurationValue = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.primary};
`;

const SectionHeader = styled.View`
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const ContextInfo = styled.Text`
  font-size: 13px;
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.fonts.medium};
  margin-top: 6px;
`;

const SegmentControl = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.colors.surface};
  padding: 6px;
  border-radius: 18px;
  margin-bottom: 18px;
`;

const SegmentButton = styled.TouchableOpacity<{ $active: boolean }>`
  flex: 1;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${props => (props.$active ? props.theme.colors.surfaceSoft : "transparent")};
`;

const SegmentLabel = styled.Text<{ $active: boolean }>`
  font-size: 14px;
  font-family: ${props => (props.$active ? props.theme.fonts.bold : props.theme.fonts.medium)};
  color: ${props => (props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary)};
`;

const PodiumRow = styled.View`
  flex-direction: row;
  column-gap: 12px;
  margin-bottom: 22px;
`;

const PodiumCard = styled.View<{ $primary?: boolean }>`
  flex: 1;
  padding: 18px 12px;
  border-radius: 22px;
  background-color: ${props => (props.$primary ? props.theme.colors.surface : props.theme.colors.surfaceSoft)};
  align-items: center;
`;

const PodiumBadge = styled.View<{ $primary?: boolean }>`
  width: ${props => (props.$primary ? 54 : 46)}px;
  height: ${props => (props.$primary ? 54 : 46)}px;
  border-radius: 27px;
  background-color: ${props => (props.$primary ? props.theme.colors.primary : props.theme.colors.surface)};
  border-width: ${props => (props.$primary ? 0 : 1)}px;
  border-color: ${props => props.theme.colors.primarySoft};
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const PodiumBadgeText = styled.Text`
  font-size: 15px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.primary};
`;

const PodiumName = styled.Text`
  font-size: 16px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const PodiumRole = styled.Text`
  font-size: 12px;
  font-family: ${props => props.theme.fonts.medium};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 2px;
`;

const PodiumDuration = styled.Text`
  margin-top: 8px;
  font-size: 15px;
  font-family: ${props => props.theme.fonts.semiBold};
  color: ${props => props.theme.colors.primary};
`;

const RankingList = styled.View`
  row-gap: 10px;
`;

const RankingCell = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 22px;
  background-color: ${props => props.theme.colors.surface};
`;

const CellLeft = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 14px;
`;

const CellBadge = styled.Text`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.primarySoft};
  font-size: 16px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  line-height: 40px;
`;

const CellMeta = styled.View``;

const CellRole = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.semiBold};
`;

const CellName = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fonts.bold};
`;

const CellDuration = styled.Text`
  font-size: 15px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.primary};
`;

const BackIcon = () => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
  >
    <Path
      d="M11.25 3.75L6.75 8.25L11.25 12.75"
      stroke="#1F2433"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CrownIcon = () => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 13 13"
    fill="none"
  >
    <Path
      d="M3.25004 10.8335C3.09657 10.8335 2.96801 10.7815 2.86438 10.6775C2.76074 10.5735 2.70874 10.4449 2.70838 10.2918C2.70801 10.1387 2.76001 10.0102 2.86438 9.90616C2.96874 9.80216 3.09729 9.75016 3.25004 9.75016H9.75004C9.90351 9.75016 10.0323 9.80216 10.1363 9.90616C10.2402 10.0102 10.2921 10.1387 10.2917 10.2918C10.2913 10.4449 10.2393 10.5737 10.1357 10.678C10.0321 10.7824 9.90351 10.8342 9.75004 10.8335H3.25004ZM3.62921 8.93766C3.3674 8.93766 3.13503 8.8519 2.93208 8.68037C2.72914 8.50884 2.60492 8.29218 2.55942 8.03037L2.01775 4.59079C1.99969 4.59079 1.97947 4.59314 1.95708 4.59783C1.93469 4.60252 1.91429 4.60469 1.89588 4.60433C1.67018 4.60433 1.47843 4.52543 1.32063 4.36762C1.16282 4.20982 1.08374 4.01789 1.08338 3.79183C1.08301 3.56577 1.1621 3.37403 1.32063 3.21658C1.47915 3.05914 1.6709 2.98005 1.89588 2.97933C2.12085 2.97861 2.31278 3.05769 2.47167 3.21658C2.63056 3.37547 2.70946 3.56722 2.70838 3.79183C2.70838 3.85503 2.70151 3.91371 2.68779 3.96787C2.67407 4.02204 2.65836 4.07169 2.64067 4.11683L4.33338 4.87516L6.02608 2.55954C5.92678 2.48732 5.84553 2.39252 5.78233 2.27516C5.71914 2.1578 5.68754 2.03141 5.68754 1.896C5.68754 1.6703 5.76662 1.47837 5.92479 1.32021C6.08296 1.16204 6.27471 1.08314 6.50004 1.0835C6.72538 1.08386 6.91731 1.16294 7.07583 1.32075C7.23436 1.47855 7.31326 1.6703 7.31254 1.896C7.31254 2.03141 7.28094 2.1578 7.21775 2.27516C7.15456 2.39252 7.07331 2.48732 6.974 2.55954L8.66671 4.87516L10.3594 4.11683C10.3414 4.07169 10.3255 4.02204 10.3118 3.96787C10.298 3.91371 10.2913 3.85503 10.2917 3.79183C10.2917 3.56614 10.3708 3.37421 10.529 3.21604C10.6871 3.05787 10.8789 2.97897 11.1042 2.97933C11.3295 2.97969 11.5215 3.05878 11.68 3.21658C11.8385 3.37439 11.9174 3.56614 11.9167 3.79183C11.916 4.01752 11.8371 4.20946 11.68 4.36762C11.5229 4.52579 11.331 4.60469 11.1042 4.60433C11.0862 4.60433 11.0659 4.60216 11.0435 4.59783C11.0212 4.5935 11.0008 4.59115 10.9823 4.59079L10.4407 8.03037C10.3955 8.29218 10.2715 8.50884 10.0685 8.68037C9.8656 8.8519 9.63304 8.93766 9.37088 8.93766H3.62921Z"
      fill="#ffffff"
    />
  </Svg>
);
