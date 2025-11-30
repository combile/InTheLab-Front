import React from "react";
import styled from "styled-components/native";
import { Platform } from "react-native";
import { Svg, Path } from "react-native-svg";
import { theme } from "../../styles";

interface AlarmProps {
  onGoBack?: () => void;
}

interface AlarmMessage {
  author: string;
  content: string;
  date: string;
  avatar?: string;
}

const todayMessages: AlarmMessage[] = [
  {
    author: "황경호 교수님",
    content: "오늘 7시 랩미팅",
    date: "2025-12-04",
    avatar: "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
  },
];

const previousMessages: AlarmMessage[] = [
  {
    author: "황경호 교수님",
    content: "오늘은 랩미팅 안함",
    date: "2025-11-20",
    avatar: "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
  },
  {
    author: "황경호 교수님",
    content: "내일 오후 2시에 논문 리뷰 미팅이 있습니다",
    date: "2025-11-19",
    avatar: "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
  },
  {
    author: "황경호 교수님",
    content: "이번 주 금요일은 휴강입니다",
    date: "2025-11-18",
    avatar: "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
  },
  {
    author: "황경호 교수님",
    content: "연구실 청소는 매주 월요일 오전에 진행합니다",
    date: "2025-11-17",
    avatar: "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
  },
  {
    author: "황경호 교수님",
    content: "새로운 프로젝트 관련해서 오늘 오후에 미팅하겠습니다",
    date: "2025-11-16",
    avatar: "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
  },
];

const messageItemShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(0, 0, 0, 0.06)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      }
    : { elevation: 3 };

export const Alarm = ({ onGoBack }: AlarmProps) => {
  return (
    <Screen>
      <Content
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <BackButton onPress={onGoBack}>
            <BackIcon />
          </BackButton>
          <HeaderTitle>알라미</HeaderTitle>
          <Spacer />
        </Header>

        {todayMessages.length > 0 && (
          <Section>
            <SectionTitle>오늘</SectionTitle>
            <MessageList>
              {todayMessages.map((message, index) => (
                <MessageItem
                  key={index}
                  style={messageItemShadow}
                >
                  <MessageAvatar
                    source={{
                      uri: message.avatar || "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
                    }}
                  />
                  <MessageContent>
                    <MessageAuthor>{message.author}</MessageAuthor>
                    <MessageText>{message.content}</MessageText>
                  </MessageContent>
                  <MessageDate>{message.date}</MessageDate>
                </MessageItem>
              ))}
            </MessageList>
          </Section>
        )}

        {previousMessages.length > 0 && (
          <Section>
            <SectionTitle>이전 메시지</SectionTitle>
            <MessageList>
              {previousMessages.map((message, index) => (
                <MessageItem
                  key={index}
                  style={messageItemShadow}
                >
                  <MessageAvatar
                    source={{
                      uri: message.avatar || "https://www.hanbat.ac.kr/images/kor/sub01/sub01_010301_img03.png",
                    }}
                  />
                  <MessageContent>
                    <MessageAuthor>{message.author}</MessageAuthor>
                    <MessageText>{message.content}</MessageText>
                  </MessageContent>
                  <MessageDate>{message.date}</MessageDate>
                </MessageItem>
              ))}
            </MessageList>
          </Section>
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
  margin-bottom: 24px;
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

const Section = styled.View`
  margin-bottom: 28px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 14px;
`;

const MessageList = styled.View`
  row-gap: 12px;
`;

const MessageItem = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 18px;
  position: relative;
  flex-direction: row;
  align-items: flex-start;
`;

const MessageAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
`;

const MessageContent = styled.View`
  flex: 1;
  padding-right: 80px;
`;

const MessageAuthor = styled.Text`
  font-size: 16px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 6px;
`;

const MessageText = styled.Text`
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 20px;
`;

const MessageDate = styled.Text`
  position: absolute;
  top: 18px;
  right: 18px;
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
