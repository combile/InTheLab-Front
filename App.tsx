import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles";
import { Splash, Main } from "./src/pages";
import { View, Text } from "react-native";
import { MyPage, AttendanceRanking } from "./src/pages";

const Screen = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

export default function App() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Thin": require("./assets/fonts/Pretendard-Thin.otf"),
    "Pretendard-ExtraLight": require("./assets/fonts/Pretendard-ExtraLight.otf"),
    "Pretendard-Light": require("./assets/fonts/Pretendard-Light.otf"),
    "Pretendard-Regular": require("./assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("./assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-ExtraBold": require("./assets/fonts/Pretendard-ExtraBold.otf"),
    "Pretendard-Black": require("./assets/fonts/Pretendard-Black.otf"),
  });
  const [screen, setScreen] = useState<"my" | "ranking">("my");

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Screen>
        {screen === "my" ? (
          <MyPage onNavigateRanking={() => setScreen("ranking")} />
        ) : (
          <AttendanceRanking onGoBack={() => setScreen("my")} />
        )}
      </Screen>
      {showSplash ? <Splash /> : <Main />}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
