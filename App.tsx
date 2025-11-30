import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles";
import { Splash, Main, MyPage, AttendanceRanking, Timesheet, Alarm } from "./src/pages";
import { View, Text } from "react-native";
import { Footer } from "./src/components";

const Screen = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
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
  const [screen, setScreen] = useState<"main" | "my" | "ranking" | "timecard" | "alarm">("main");

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

  const handleTabPress = (tabId: "timecard" | "home" | "profile") => {
    if (tabId === "home") {
      setScreen("main");
    } else if (tabId === "profile") {
      setScreen("my");
    } else if (tabId === "timecard") {
      setScreen("timecard");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Screen>
        {showSplash ? (
          <Splash />
        ) : screen === "main" ? (
          <Main
            onNavigateToTimesheet={() => setScreen("timecard")}
            onNavigateToAlarm={() => setScreen("alarm")}
          />
        ) : screen === "my" ? (
          <MyPage onNavigateRanking={() => setScreen("ranking")} />
        ) : screen === "ranking" ? (
          <AttendanceRanking onGoBack={() => setScreen("my")} />
        ) : screen === "timecard" ? (
          <Timesheet />
        ) : screen === "alarm" ? (
          <Alarm onGoBack={() => setScreen("main")} />
        ) : (
          <Main />
        )}
      </Screen>
      {!showSplash && screen !== "alarm" && (
        <Footer
          activeTabId={screen === "main" ? "home" : screen === "my" || screen === "ranking" ? "profile" : "timecard"}
          onTabPress={handleTabPress}
        />
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
