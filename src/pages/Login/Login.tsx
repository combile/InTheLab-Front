import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity, ScrollView, Dimensions, Text as RNText, Alert } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { DefaultButton } from "../../components";
import { TextField } from "../../components";
import { theme } from "../../styles";

interface LoginProps {
  onLoginSuccess?: () => void;
  onNavigateToSignUp?: () => void;
}

const screenWidth = Dimensions.get("window").width;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
`;

const LogoContainer = styled.View`
  margin-bottom: 40px;
`;

const Logo = () => (
  <Svg
    width="46"
    height="75"
    viewBox="0 0 46 75"
    fill="none"
  >
    <Path
      d="M0 75V0H18.5991V56.1252H45.9406V75H0Z"
      fill="#191C32"
    />
    <Circle
      cx="36.2629"
      cy="21.7742"
      r="7.25806"
      fill="#7F8EFF"
    />
  </Svg>
);

const ButtonContainer = styled.View`
  margin-top: 24px;
  margin-bottom: 16px;
  width: ${Math.min(343, screenWidth - 32)}px;
  max-width: 343px;
  align-items: center;
`;

const BottomLinksContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${Math.min(343, screenWidth - 32)}px;
  max-width: 343px;
  margin-top: 0px;
  padding-left: 0;
  padding-right: 0;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RightSection = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const SignUpLink = styled(TouchableOpacity)`
  padding: 6px;
`;

const SignUpText = styled(RNText)`
  color: #7f8eff;
  font-size: ${theme.fontSize.sm}px;
  font-family: ${theme.fonts.primary};
`;

const FindLink = styled(TouchableOpacity)`
  padding: 6px;
`;

const FindText = styled(RNText)`
  color: #999999;
  font-size: ${theme.fontSize.sm}px;
  font-family: ${theme.fonts.primary};
`;

export const Login = ({ onLoginSuccess, onNavigateToSignUp }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 아이디와 비밀번호가 모두 "1234"일 때만 로그인 성공
    if (username === "1234" && password === "1234") {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSignUp = () => {
    if (onNavigateToSignUp) {
      onNavigateToSignUp();
    }
  };

  const handleFindId = () => {
    // TODO: Implement find ID logic
    console.log("Find ID");
  };

  const handleFindPassword = () => {
    // TODO: Implement find password logic
    console.log("Find password");
  };

  return (
    <Screen>
      <ScrollContent
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer>
          <LogoContainer>
            <Logo />
          </LogoContainer>

          <TextField
            label="아이디"
            value={username}
            onChangeText={setUsername}
            placeholder="아이디를 입력하세요"
            autoCapitalize="none"
          />

          <TextField
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
            autoCapitalize="none"
          />

          <ButtonContainer>
            <DefaultButton
              onPress={handleLogin}
              width="100%"
            >
              로그인
            </DefaultButton>
          </ButtonContainer>

          <BottomLinksContainer>
            <LeftSection>
              <SignUpLink onPress={handleSignUp}>
                <SignUpText>회원가입</SignUpText>
              </SignUpLink>
            </LeftSection>
            <RightSection>
              <FindLink onPress={handleFindId}>
                <FindText>아이디 찾기</FindText>
              </FindLink>
              <FindLink onPress={handleFindPassword}>
                <FindText>비밀번호 찾기</FindText>
              </FindLink>
            </RightSection>
          </BottomLinksContainer>
        </ContentContainer>
      </ScrollContent>
    </Screen>
  );
};
