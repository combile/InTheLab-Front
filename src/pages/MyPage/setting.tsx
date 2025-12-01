import React, { useState } from "react";
import styled from "styled-components/native";
import { Platform, Switch } from "react-native";
import { Svg, Path } from "react-native-svg";

interface SettingProps {
  onGoBack?: () => void;
}

const sectionShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(16, 28, 71, 0.08)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
      }
    : {
        elevation: 2,
      };

export const Setting = ({ onGoBack }: SettingProps) => {
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(false);

  return (
    <Screen>
      <Header>
        <BackButton onPress={onGoBack}>
          <BackIcon />
        </BackButton>
        <HeaderTitle>설정</HeaderTitle>
        <Spacer />
      </Header>
      <Content
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
          paddingLeft: 24,
          paddingRight: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Section>
          <SectionTitle>계정 및 보안</SectionTitle>
          <MenuList>
            <MenuItem style={sectionShadow}>
              <MenuItemLabel>이메일 변경</MenuItemLabel>
              <ChevronIcon />
            </MenuItem>
            <MenuItem style={sectionShadow}>
              <MenuItemLabel>비밀번호 변경</MenuItemLabel>
              <ChevronIcon />
            </MenuItem>
            <MenuItem style={sectionShadow}>
              <MenuItemLabel>회원탈퇴</MenuItemLabel>
              <ChevronIcon />
            </MenuItem>
          </MenuList>
        </Section>

        <Section>
          <SectionTitle>지원</SectionTitle>
          <MenuList>
            <MenuItem style={sectionShadow}>
              <MenuItemLabel>1:1 문의</MenuItemLabel>
              <ChevronIcon />
            </MenuItem>
            <MenuItem style={sectionShadow}>
              <MenuItemLabel>F&Q</MenuItemLabel>
              <ChevronIcon />
            </MenuItem>
          </MenuList>
        </Section>

        <Section>
          <SectionTitle>알림 설정</SectionTitle>
          <MenuList>
            <MenuItem style={sectionShadow}>
              <MenuItemLabel>푸쉬 알림 설정</MenuItemLabel>
              <Switch
                value={pushNotificationEnabled}
                onValueChange={setPushNotificationEnabled}
                trackColor={{ false: "#E4E7F2", true: "#6D6BFF" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E4E7F2"
              />
            </MenuItem>
          </MenuList>
        </Section>
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

const Section = styled.View`
  margin-bottom: 28px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 14px;
`;

const MenuList = styled.View`
  row-gap: 12px;
`;

const MenuItem = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 16px;
  padding-right: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MenuItemLabel = styled.Text`
  font-size: 15px;
  font-family: ${props => props.theme.fonts.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const ChevronIcon = () => (
  <Svg
    width={6}
    height={10}
    viewBox="0 0 6 10"
    fill="none"
  >
    <Path
      d="M1 1L5 5L1 9"
      stroke="#1F2433"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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
