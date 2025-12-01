import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles";
import { Splash, Main, MyPage, Setting, Announcement, AttendanceRanking, Timesheet, Alarm, Login, SignUp } from "./src/pages";
import { View, Text, Animated } from "react-native";
import { Footer } from "./src/components";

const Screen = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const AnimatedScreen = styled(Animated.View)`
  flex: 1;
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
  const [screen, setScreen] = useState<"main" | "my" | "ranking" | "timecard" | "alarm" | "setting" | "announcement">("main");
  const [prevScreen, setPrevScreen] = useState<"main" | "my" | "ranking" | "timecard" | "alarm" | "setting" | "announcement">("main");

  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAuthScreen, setCurrentAuthScreen] = useState<"login" | "signup">("login");

  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenTranslateX = useRef(new Animated.Value(0)).current;

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
    let newScreen: "main" | "my" | "timecard" = "main";
    if (tabId === "home") {
      newScreen = "main";
    } else if (tabId === "profile") {
      newScreen = "my";
    } else if (tabId === "timecard") {
      newScreen = "timecard";
    }

    // 현재 화면과 동일하면 애니메이션 없이 리턴
    if (newScreen === screen) return;

    // 화면 순서 결정 (timecard < main < my)
    const screenOrder: Record<string, number> = { timecard: 0, main: 1, my: 2 };
    const currentOrder = screenOrder[screen] ?? 1;
    const nextOrder = screenOrder[newScreen] ?? 1;
    const isMovingRight = nextOrder > currentOrder;

    setPrevScreen(screen);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(screenTranslateX, {
          toValue: isMovingRight ? -30 : 30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(screenTranslateX, {
        toValue: isMovingRight ? 30 : -30,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setScreen(newScreen);
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(screenTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Screen>
        {showSplash ? (
          <Splash />
        ) : !isLoggedIn ? (
          currentAuthScreen === "login" ? (
            <Login
              onLoginSuccess={() => setIsLoggedIn(true)}
              onNavigateToSignUp={() => setCurrentAuthScreen("signup")}
            />
          ) : (
            <SignUp
              onNavigateBack={() => setCurrentAuthScreen("login")}
              onSignUpSuccess={() => setIsLoggedIn(true)}
            />
          )
        ) : (
          <AnimatedScreen
            style={{
              opacity: screenOpacity,
              transform: [{ translateX: screenTranslateX }],
            }}
          >
            {screen === "main" ? (
              <Main
                onNavigateToTimesheet={() => setScreen("timecard")}
                onNavigateToAlarm={() => setScreen("alarm")}
              />
            ) : screen === "my" ? (
              <MyPage
                onNavigateRanking={() => setScreen("ranking")}
                onNavigateSetting={() => setScreen("setting")}
                onNavigateAnnouncement={() => setScreen("announcement")}
                onLogout={() => setIsLoggedIn(false)}
              />
            ) : screen === "ranking" ? (
              <AttendanceRanking onGoBack={() => setScreen("my")} />
            ) : screen === "timecard" ? (
              <Timesheet />
            ) : screen === "alarm" ? (
              <Alarm onGoBack={() => setScreen("main")} />
            ) : screen === "setting" ? (
              <Setting onGoBack={() => setScreen("my")} />
            ) : screen === "announcement" ? (
              <Announcement onGoBack={() => setScreen("my")} />
            ) : (
              <Main />
            )}
          </AnimatedScreen>
        )}
        </Screen>
        {!showSplash && isLoggedIn && screen !== "alarm" && screen !== "setting" && screen !== "announcement" && (
          <Footer
            activeTabId={screen === "main" ? "home" : screen === "my" || screen === "ranking" ? "profile" : "timecard"}
            onTabPress={handleTabPress}
          />
        )}
        <StatusBar style="auto" />
    </ThemeProvider>
  );
}
