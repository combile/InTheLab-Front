import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components/native";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  DeviceEventEmitter,
  PermissionsAndroid,
} from "react-native";
import type { StyleProp, TouchableOpacityProps, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import Beacons from "react-native-beacons-manager";

import ChartIcon from "../../../assets/myPage/Chart.svg";
import GoToWorkIcon from "../../../assets/myPage/GoToWork.svg";
import LogoutIcon from "../../../assets/myPage/Logout.svg";
import HeaderIcon from "../../../assets/logo/Header.svg";

import { authService } from "../../api/auth";
import { attendanceService } from "../../api/attendance";
import { userService } from "../../api/user";
import { User, AttendanceStatus, WeeklyStats } from "../../types";
import { storage } from "../../utils/storage";

const TARGET_BEACON = {
  uuid: "e2c56db5-dffb-48d2-b060-d0f5a71096e0",
  major: 40011,
  minor: 57458,
  identifier: "InTheLab",
};

const quickActions = [
  { id: "ranking", label: "출근 랭킹", Icon: ChartIcon },
  { id: "checkIn", label: "출근", Icon: GoToWorkIcon },
  { id: "checkOut", label: "퇴근", Icon: LogoutIcon },
] as const;

const menuItems: Array<{
  id: string;
  label: string;
  highlight?: boolean;
}> = [
  { id: "notice", label: "공지사항" },
  { id: "settings", label: "설정" },
  { id: "logout", label: "로그아웃" },
  { id: "request", label: "출석 요청" },
];

const gradientColors = ["#7F8EFF", "#46C4E7"] as const;

const cardShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(16, 28, 71, 0.15)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      }
    : {
        elevation: 6,
      };

const menuItemShadow =
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

interface MyPageProps {
  onNavigateRanking?: () => void;
  onNavigateSetting?: () => void;
  onNavigateAnnouncement?: () => void;
  onLogout?: () => void;
}

export const MyPage = ({
  onNavigateRanking,
  onNavigateSetting,
  onNavigateAnnouncement,
  onLogout,
}: MyPageProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAttendanceRequestModal, setShowAttendanceRequestModal] =
    useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatus | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklyStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [inBeaconRange, setInBeaconRange] = useState(false);

  const fetchUserData = async () => {
    try {
      // 먼저 저장된 유저 정보 불러오기 시도
      let userInfo = await storage.getUserInfo();

      // 항상 최신 정보 업데이트 시도
      try {
        const newUserInfo = await userService.getProfile();
        await storage.setUserInfo(newUserInfo);
        userInfo = newUserInfo;
      } catch (e) {
        console.log(
          "Failed to fetch user profile, using cached data if available",
          e
        );
      }

      setUser(userInfo);

      // 출석 상태 조회
      try {
        const status = await attendanceService.getStatus();
        setAttendanceStatus(status);
      } catch (e) {
        console.log("Failed to fetch attendance status", e);
        // 에러 시 초기화
        setAttendanceStatus(null);
      }

      // 주간 요약 조회
      if (userInfo?.id) {
        try {
          const summary = await attendanceService.getMyStats(userInfo.id);
          setWeeklySummary(summary);
        } catch (e) {
          console.log("Failed to fetch weekly summary", e);
          setWeeklySummary(null);
        }
      }
    } catch (error) {
      console.error("Error loading my page data:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, []);

  // useFocusEffect 대신 useEffect 사용 (네비게이션 라이브러리 미사용 대응)
  useEffect(() => {
    fetchUserData();
  }, []);

  // 비콘 감지 로직
  useEffect(() => {
    const startBeaconScanning = async () => {
      if (Platform.OS === "ios") {
        Beacons.requestAlwaysAuthorization();
        Beacons.startRangingBeaconsInRegion(TARGET_BEACON);
      } else if (Platform.OS === "android") {
        // 안드로이드 권한 요청
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
            } catch (err) {
              console.log(`Beacons ranging not started, error: ${err}`);
            }
          } else {
            console.log("Bluetooth permissions not granted");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    startBeaconScanning();

    const subscription = DeviceEventEmitter.addListener(
      "beaconsDidRange",
      (data) => {
        if (data.beacons && data.beacons.length > 0) {
          const found = data.beacons.find(
            (b: any) =>
              b.uuid.toLowerCase() === TARGET_BEACON.uuid.toLowerCase() &&
              b.major === TARGET_BEACON.major &&
              b.minor === TARGET_BEACON.minor
          );
          if (found) {
            console.log("Target Beacon Found!", found);
            setInBeaconRange(true);
          } else {
            setInBeaconRange(false);
          }
        } else {
          setInBeaconRange(false);
        }
      }
    );

    return () => {
      subscription.remove();
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Beacons.stopRangingBeaconsInRegion(TARGET_BEACON);
      }
    };
  }, []);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout API failed", e);
    } finally {
      onLogout?.();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleAttendanceRequestPress = () => {
    setShowAttendanceRequestModal(true);
  };

  const handleAttendanceRequestConfirm = () => {
    setShowAttendanceRequestModal(false);
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 거부", "위치 정보 접근 권한이 필요합니다.");
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      return location;
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("오류", "위치 정보를 가져올 수 없습니다.");
      return null;
    }
  };

  const handleQuickAction = async (id: string) => {
    if (id === "ranking") {
      onNavigateRanking?.();
    } else if (id === "checkIn") {
      // 출근 로직

      // 1. 비콘 확인
      if (!inBeaconRange) {
        Alert.alert(
          "출근 실패",
          "지정된 비콘 구역이 아닙니다. 사무실 내에서 시도해주세요."
        );
        return;
      }

      // 2. 위치 확인
      const location = await getCurrentLocation();
      if (!location) return;

      try {
        // 백엔드 check_in 스펙: CheckInRequest { beacon_connected: bool }
        await attendanceService.checkIn({
          beacon_connected: inBeaconRange,
        });
        Alert.alert("알림", "출근 처리가 완료되었습니다.");
        await fetchUserData();
      } catch (e: any) {
        const message = e.response?.data?.detail || "출근 처리에 실패했습니다.";
        Alert.alert("오류", message);
      }
    } else if (id === "checkOut") {
      // 퇴근 로직
      try {
        await attendanceService.checkOut({});
        Alert.alert("알림", "퇴근 처리가 완료되었습니다.");
        await fetchUserData();
      } catch (e: any) {
        const message = e.response?.data?.detail || "퇴근 처리에 실패했습니다.";
        Alert.alert("오류", message);
      }
    }
  };

  return (
    <Screen>
      <HeaderIconWrapper>
        <HeaderIcon width={24} height={39} />
      </HeaderIconWrapper>
      <Content
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 70,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PageTitle>마이페이지</PageTitle>
        <UserCard style={cardShadow}>
          <UserInfo>
            <Avatar
              source={{
                uri:
                  user?.profileImage ||
                  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=120&q=80",
              }}
            />
            <UserMeta>
              <UserName>{user?.username || "사용자"}님</UserName>
              <CompanyName>{user?.lab_name || "소속 정보 없음"}</CompanyName>
            </UserMeta>
          </UserInfo>
          <StatusContainer>
            <StatusLabel>현재 상태</StatusLabel>
            <StatusValue>
              {attendanceStatus?.is_checked_in ? "출근" : "퇴근"}
            </StatusValue>
          </StatusContainer>
        </UserCard>

        <QuickActions>
          {quickActions.map(({ id, label, Icon }) => {
            return (
              <ActionCard
                key={id}
                style={cardShadow}
                activeOpacity={0.85}
                onPress={() => handleQuickAction(id)}
              >
                <IconContainer>
                  <Icon width="100%" height="100%" />
                </IconContainer>
                <ActionLabel>{label}</ActionLabel>
              </ActionCard>
            );
          })}
        </QuickActions>

        <SummaryCard style={cardShadow}>
          <SummaryText>
            이번주에는{"\n"}
            <SummaryHighlight>
              {weeklySummary?.this_week_total || 0}시간 출근했어요 !
            </SummaryHighlight>
          </SummaryText>
          <SummaryDescription>
            {weeklySummary?.comparison_message || "출근 기록이 없습니다."}
          </SummaryDescription>
          <NotebookContainer>
            <NotebookGraphic />
          </NotebookContainer>
        </SummaryCard>

        <MenuCard>
          {menuItems.map((item, index) => {
            const handlePress =
              item.id === "settings"
                ? onNavigateSetting
                : item.id === "notice"
                ? onNavigateAnnouncement
                : item.id === "logout"
                ? handleLogoutPress
                : item.id === "request"
                ? handleAttendanceRequestPress
                : undefined;
            return (
              <GradientTouchable
                key={item.id}
                borderRadius={22}
                style={[
                  styles.menuItemWrapper,
                  menuItemShadow,
                  { marginBottom: index === menuItems.length - 1 ? 0 : 12 },
                ]}
                contentStyle={styles.menuItemContent}
                onPress={handlePress}
                activeOpacity={handlePress ? 0.85 : 1}
                disabled={!handlePress}
              >
                <MenuLabel>{item.label}</MenuLabel>
                <Chevron>
                  <ChevronIcon />
                </Chevron>
              </GradientTouchable>
            );
          })}
        </MenuCard>
      </Content>

      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleLogoutCancel}
      >
        <ModalOverlay onPress={handleLogoutCancel}>
          <ModalContent style={modalShadow}>
            <ModalTitle>로그아웃하시겠습니까?</ModalTitle>
            <ModalButtonContainer>
              <ModalCancelButton onPress={handleLogoutCancel}>
                <ModalCancelText>취소</ModalCancelText>
              </ModalCancelButton>
              <ModalConfirmButton onPress={handleLogoutConfirm}>
                <ModalConfirmText>확인</ModalConfirmText>
              </ModalConfirmButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal
        visible={showAttendanceRequestModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleAttendanceRequestConfirm}
      >
        <ModalOverlay onPress={handleAttendanceRequestConfirm}>
          <ModalContent style={modalShadow}>
            <ModalTitle>출석이 요청되었습니다</ModalTitle>
            <ModalButtonContainer>
              <ModalConfirmButton
                onPress={handleAttendanceRequestConfirm}
                style={{ flex: 1 }}
              >
                <ModalConfirmText>확인</ModalConfirmText>
              </ModalConfirmButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Screen>
  );
};

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
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
  background-color: ${(props) => props.theme.colors.background};
  padding-top: 50px;
  padding-bottom: 8px;
  padding-left: 24px;
`;

const PageTitle = styled.Text`
  font-size: 22px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 24px;
  letter-spacing: -1px;
`;

const UserCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 14px;
`;

const Avatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

const UserMeta = styled.View``;

const UserName = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.fonts.bold};
  margin-bottom: 4px;
`;

const CompanyName = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: ${(props) => props.theme.fonts.primary};
`;

const StatusContainer = styled.View`
  align-items: flex-end;
`;

const StatusLabel = styled.Text`
  font-size: 13px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: ${(props) => props.theme.fonts.medium};
  margin-bottom: 4px;
`;

const StatusValue = styled.Text`
  font-size: 15px;
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fonts.bold};
`;

const QuickActions = styled.View`
  flex-direction: row;
  column-gap: 12px;
  margin-bottom: 20px;
`;

const ActionCard = styled.TouchableOpacity`
  flex: 1;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 18px;
  padding: 18px;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  min-height: 100px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
`;

const ActionLabel = styled.Text`
  font-size: 13px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: ${(props) => props.theme.fonts.medium};
  margin-bottom: 4px;
`;

const SummaryCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  overflow: hidden;
  min-height: 140px;
`;

const SummaryText = styled.Text`
  font-size: 20px;
  line-height: 30px;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.fonts.bold};
  padding-right: 80px;
  z-index: 1;
`;

const SummaryHighlight = styled.Text`
  color: ${(props) => props.theme.colors.primary};
`;

const SummaryDescription = styled.Text`
  margin-top: 8px;
  font-size: 13px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: ${(props) => props.theme.fonts.primary};
  z-index: 1;
`;

const NotebookContainer = styled.View`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 120px;
  height: 120px;
  opacity: 1;
`;

const NotebookGraphic = styled.Image.attrs({
  source: require("../../../assets/myPage/Notebook.png"),
  resizeMode: "contain",
})`
  width: 100%;
  height: 100%;
`;

const MenuCard = styled.View`
  padding: 0;
  margin-top: 8px;
`;

const MenuLabel = styled.Text`
  font-size: 15px;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.fonts.bold};
`;

const Chevron = styled.View`
  justify-content: center;
  align-items: center;
`;

const ChevronIcon = () => (
  <Svg width={6} height={10} viewBox="0 0 6 10" fill="none">
    <Path
      d="M1 1L5 5L1 9"
      stroke="#1F2433"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

type GradientTouchableProps = TouchableOpacityProps & {
  children: React.ReactNode;
  borderRadius: number;
  contentStyle?: StyleProp<ViewStyle>;
};

const GradientTouchable = ({
  children,
  borderRadius,
  contentStyle,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: GradientTouchableProps) => {
  const baseOpacity = 0;
  const borderAnim = useRef(new Animated.Value(baseOpacity)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotateLoop = useRef<Animated.CompositeAnimation | null>(null);
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });

  const handlePressIn: TouchableOpacityProps["onPressIn"] = (event) => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    rotateLoop.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: (t) => t, // Linear easing for seamless rotation
      })
    );
    rotateLoop.current.start();
    onPressIn?.(event);
  };

  const handlePressOut: TouchableOpacityProps["onPressOut"] = (event) => {
    Animated.timing(borderAnim, {
      toValue: baseOpacity,
      duration: 200,
      useNativeDriver: true,
    }).start();

    rotateLoop.current?.stop();
    rotateAnim.setValue(0);
    onPressOut?.(event);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Calculate diagonal to ensure gradient covers the whole box during rotation
  const diagonal = Math.sqrt(
    layout.width * layout.width + layout.height * layout.height
  );
  const size = Math.max(diagonal, 10) * 2.0; // Double the size to prevent clipping

  return (
    <GradientTouchableWrapper
      activeOpacity={0.95}
      $borderRadius={borderRadius}
      style={style}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: borderAnim,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Animated.View
          style={{
            width: size,
            height: size,
            transform: [{ rotate }],
          }}
        >
          <LinearGradient
            colors={[gradientColors[0], gradientColors[1], gradientColors[0]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>
      <GradientTouchableInner $borderRadius={borderRadius} style={contentStyle}>
        {children}
      </GradientTouchableInner>
    </GradientTouchableWrapper>
  );
};

const GradientTouchableWrapper = styled(TouchableOpacity)<{
  $borderRadius: number;
}>`
  border-radius: ${(props) => props.$borderRadius}px;
  background-color: ${(props) => props.theme.colors.surface};
  position: relative;
  overflow: hidden;
`;

const GradientTouchableInner = styled.View<{ $borderRadius: number }>`
  border-radius: ${(props) => props.$borderRadius - 1}px;
  background-color: ${(props) => props.theme.colors.surface};
  margin: 1px;
`;

const modalShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "rgba(16, 28, 71, 0.2)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      }
    : {
        elevation: 8,
      };

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 24px;
  width: 100%;
  height: 100%;
`;

const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: 24px;
`;

const ModalButtonContainer = styled.View`
  flex-direction: row;
  column-gap: 12px;
`;

const ModalCancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding-top: 14px;
  padding-bottom: 14px;
  align-items: center;
  justify-content: center;
`;

const ModalCancelText = styled.Text`
  font-size: 16px;
  font-family: ${(props) => props.theme.fonts.semiBold};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ModalConfirmButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 12px;
  padding-top: 14px;
  padding-bottom: 14px;
  align-items: center;
  justify-content: center;
`;

const ModalConfirmText = styled.Text`
  font-size: 16px;
  font-family: ${(props) => props.theme.fonts.semiBold};
  color: #ffffff;
`;

const styles = StyleSheet.create({
  menuItemWrapper: {
    width: "100%",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
});
