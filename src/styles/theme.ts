export const theme = {
  fonts: {
    thin: "Pretendard-Thin",
    extraLight: "Pretendard-ExtraLight",
    light: "Pretendard-Light",
    primary: "Pretendard-Regular",
    medium: "Pretendard-Medium",
    semiBold: "Pretendard-SemiBold",
    bold: "Pretendard-Bold",
    extraBold: "Pretendard-ExtraBold",
    black: "Pretendard-Black",
  },
  colors: {
    primary: "#6D6BFF",
    primarySoft: "#9AA1FF",
    accent: "#6C63FF",
    background: "#F0F2F5",
    surface: "#FFFFFF",
    surfaceSoft: "#F9FAFF",
    border: "#E4E7F2",
    divider: "#EEF0FA",
    text: {
      primary: "#4A4A4A",
      secondary: "#A2A2A2",
      tertiary: "#9AA3BA",
    },
    status: {
      success: "#2BC0AC",
      info: "#6D6BFF",
      error: "#FF6B6B",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 60,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  fontSize: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    bold: "700" as const,
  },
};

export type Theme = typeof theme;
