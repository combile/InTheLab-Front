import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles";
import {
  Splash,
  Main,
  MyPage,
  Setting,
  Announcement,
  AttendanceRanking,
  Timesheet,
  Alarm,
  Login,
  SignUp,
} from "./src/pages";
import {
  View,
  Text,
  Animated,
  Platform,
  DeviceEventEmitter,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { Footer } from "./src/components";
import Beacons from "react-native-beacons-manager";
import { attendanceService } from "./src/api/attendance";

const Screen = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const AnimatedScreen = styled(Animated.View)`
  flex: 1;
`;

const TARGET_BEACON = {
  uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0",
  major: 40011,
  minor: 57458,
  identifier: "MBeacon",
};

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
  const [screen, setScreen] = useState<
    | "main"
    | "my"
    | "ranking"
    | "timecard"
    | "alarm"
    | "setting"
    | "announcement"
  >("main");
  const [prevScreen, setPrevScreen] = useState<
    | "main"
    | "my"
    | "ranking"
    | "timecard"
    | "alarm"
    | "setting"
    | "announcement"
  >("main");

  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAuthScreen, setCurrentAuthScreen] = useState<
    "login" | "signup"
  >("login");

  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenTranslateX = useRef(new Animated.Value(0)).current;

  const lastBeaconTimeRef = useRef<number>(Date.now());
  const isCheckingOutRef = useRef<boolean>(false);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  // 앱 시작 시 비콘 스캔 초기화
  useEffect(() => {
    const startBeaconScanning = async () => {
      // Beacons 모듈이 null인지 확인
      if (
        !Beacons ||
        typeof Beacons.requestAlwaysAuthorization !== "function"
      ) {
        console.warn(
          "Beacons module is not available. Make sure the native module is properly linked."
        );
        return;
      }

      if (Platform.OS === "ios") {
        try {
          Beacons.requestAlwaysAuthorization();
          Beacons.startRangingBeaconsInRegion(TARGET_BEACON);
          console.log("iOS: Beacon scanning started");
        } catch (err) {
          console.error("iOS: Failed to start beacon scanning", err);
        }
      } else if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);

          const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );

          if (allGranted) {
            Beacons.detectIBeacons();
            try {
              await Beacons.startRangingBeaconsInRegion(TARGET_BEACON);
              console.log("Android: Beacon scanning started");
            } catch (err) {
              console.error("Android: Failed to start beacon ranging", err);
            }
          } else {
            console.log("Android: Bluetooth permissions not granted");
          }
        } catch (err) {
          console.error("Android: Permission request failed", err);
        }
      }
    };

    // 로그인 후에만 비콘 스캔 시작 (로그인 전에는 불필요)
    // 하지만 앱 시작 시 바로 시작하는 것이 좋을 수도 있으니 일단 주석 처리
    // startBeaconScanning();

    // 로그인 상태가 변경되면 비콘 스캔 시작
    if (!showSplash && isLoggedIn) {
      startBeaconScanning();
    }

    // 클린업: 앱 종료 시 비콘 스캔 중지
    return () => {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        try {
          Beacons.stopRangingBeaconsInRegion(TARGET_BEACON);
          console.log("Beacon scanning stopped");
        } catch (err) {
          console.error("Failed to stop beacon scanning", err);
        }
      }
    };
  }, [showSplash, isLoggedIn]);

  // 비콘 연결 상태 모니터링 및 자동 퇴근 로직
  useEffect(() => {
    if (!isLoggedIn) return;

    // 로그인 시점부터 시간 체크 시작
    lastBeaconTimeRef.current = Date.now();

    // 비콘 감지 이벤트 리스너
    const subscription = DeviceEventEmitter.addListener(
      "beaconsDidRange",
      (data: { beacons: any[]; region: any }) => {
        if (data.beacons && data.beacons.length > 0) {
          const found = data.beacons.find(
            (b) =>
              b.uuid.toLowerCase() === TARGET_BEACON.uuid.toLowerCase() &&
              b.major === TARGET_BEACON.major &&
              b.minor === TARGET_BEACON.minor
          );

          if (found) {
            lastBeaconTimeRef.current = Date.now();
          }
        }
      }
    );

    // 주기적 체크 (5초마다)
    const checkInterval = setInterval(async () => {
      const now = Date.now();
      const elapsed = now - lastBeaconTimeRef.current;
      const TIMEOUT_MS = 30000;

      if (elapsed > TIMEOUT_MS && !isCheckingOutRef.current) {
        try {
          isCheckingOutRef.current = true;
          // 현재 상태 확인
          const status = await attendanceService.getStatus();

          if (status.is_checked_in) {
            console.log("Auto checking out due to beacon loss...");

            // 퇴근 처리
            await attendanceService.checkOut();

            Alert.alert(
              "자동 퇴근 알림",
              "비콘 연결이 끊겨 자동으로 퇴근 처리되었습니다."
            );

            // 화면 갱신 이벤트 발생
            DeviceEventEmitter.emit("refreshScreen", { screen: "main" });
          }
        } catch (error) {
          console.error("Auto checkout failed:", error);
        } finally {
          isCheckingOutRef.current = false;
        }
      }
    }, 5000);

    return () => {
      subscription.remove();
      clearInterval(checkInterval);
    };
  }, [isLoggedIn]);

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

    // 현재 화면과 동일하면 데이터만 새로고침하고 리턴
    if (newScreen === screen) {
      // 같은 화면이면 데이터만 새로고침 (DeviceEventEmitter로 이벤트 전송)
      DeviceEventEmitter.emit("refreshScreen", { screen: newScreen });
      return;
    }

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
                isActive={screen === "main"}
              />
            ) : screen === "my" ? (
              <MyPage
                onNavigateRanking={() => setScreen("ranking")}
                onNavigateSetting={() => setScreen("setting")}
                onNavigateAnnouncement={() => setScreen("announcement")}
                onLogout={() => setIsLoggedIn(false)}
                isActive={screen === "my"}
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
      {!showSplash &&
        isLoggedIn &&
        screen !== "alarm" &&
        screen !== "setting" &&
        screen !== "announcement" && (
          <Footer
            activeTabId={
              screen === "main"
                ? "home"
                : screen === "my" || screen === "ranking"
                ? "profile"
                : "timecard"
            }
            onTabPress={handleTabPress}
          />
        )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
