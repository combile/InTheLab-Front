import React from "react";
import styled from "styled-components/native";
import { Platform } from "react-native";
import { Svg, Path } from "react-native-svg";

interface AnnouncementProps {
  onGoBack?: () => void;
}

interface AnnouncementItem {
  title: string;
  content: string;
  date: string;
  category?: string;
}

const announcements: AnnouncementItem[] = [
  {
    title: "시스템 점검 안내",
    content:
      "2025년 12월 10일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다. 해당 시간 동안 서비스 이용이 제한될 수 있으니 참고해주세요.",
    date: "2025-12-05",
    category: "시스템",
  },
  {
    title: "출석 시스템 업데이트",
    content:
      "출석 체크 기능이 개선되었습니다. 더 정확한 위치 기반 출석 확인이 가능합니다. 업데이트 후 앱을 재시작해주세요.",
    date: "2025-12-03",
    category: "업데이트",
  },
  {
    title: "연말 휴무 안내",
    content: "12월 30일부터 1월 2일까지 연말 연시 휴무로 인해 출석 체크가 비활성화됩니다. 새해 복 많이 받으세요!",
    date: "2025-11-28",
    category: "공지",
  },
  {
    title: "개인정보 처리방침 변경",
    content: "개인정보 처리방침이 2025년 12월 1일자로 변경되었습니다. 변경된 내용을 확인하시기 바랍니다.",
    date: "2025-11-25",
    category: "법적",
  },
  {
    title: "앱 버전 업데이트 필수",
    content:
      "보안 강화를 위해 앱 업데이트가 필요합니다. 최신 버전으로 업데이트하지 않으시면 일부 기능 이용에 제한이 있을 수 있습니다.",
    date: "2025-11-20",
    category: "보안",
  },
  {
    title: "서비스 이용 가이드",
    content:
      "InTheLab 앱의 주요 기능 사용법을 안내드립니다. 출석 체크, 시간표 관리, 알림 기능 등 다양한 기능을 활용해보세요.",
    date: "2025-11-15",
    category: "안내",
  },
];

const announcementItemShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.06)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

export const Announcement = ({ onGoBack }: AnnouncementProps) => {
  return (
    <Screen>
      <Header>
        <BackButton onPress={onGoBack}>
          <BackIcon />
        </BackButton>
        <HeaderTitle>공지사항</HeaderTitle>
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
      >
        <AnnouncementList>
          {announcements.map((announcement, index) => (
            <AnnouncementItem
              key={index}
              style={announcementItemShadow}
            >
              {announcement.category && (
                <CategoryBadge>
                  <CategoryBadgeText>{announcement.category}</CategoryBadgeText>
                </CategoryBadge>
              )}
              <AnnouncementTitle>{announcement.title}</AnnouncementTitle>
              <AnnouncementContent>{announcement.content}</AnnouncementContent>
              <AnnouncementDate>{announcement.date}</AnnouncementDate>
            </AnnouncementItem>
          ))}
        </AnnouncementList>
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
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const Spacer = styled.View`
  width: 36px;
`;

const AnnouncementList = styled.View`
  row-gap: 16px;
`;

const AnnouncementItem = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  position: relative;
`;

const CategoryBadge = styled.View`
  background-color: ${props => props.theme.colors.primary};
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 6px;
  align-self: flex-start;
  margin-bottom: 12px;
`;

const CategoryBadgeText = styled.Text`
  font-size: 11px;
  font-family: ${props => props.theme.fonts.bold};
  color: #ffffff;
`;

const AnnouncementTitle = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 10px;
`;

const AnnouncementContent = styled.Text`
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 22px;
  margin-bottom: 12px;
`;

const AnnouncementDate = styled.Text`
  font-size: 12px;
  font-family: ${props => props.theme.fonts.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

const BackIcon = () => (
  <Svg
    width={18}
    height={36}
    viewBox="0 0 18 36"
    fill="none"
  >
    <Path
      d="M14.7009 9.59008L13.1094 8.00008L4.44093 16.6656C4.30119 16.8044 4.1903 16.9695 4.11463 17.1514C4.03896 17.3333 4 17.5283 4 17.7253C4 17.9223 4.03896 18.1174 4.11463 18.2992C4.1903 18.4811 4.30119 18.6462 4.44093 18.7851L13.1094 27.4551L14.6994 25.8651L6.56343 17.7276L14.7009 9.59008Z"
      fill="#191C32"
    />
  </Svg>
);
