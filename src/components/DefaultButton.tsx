import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity, Text as RNText, ActivityIndicator } from "react-native";

interface DefaultButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  width?: number | string;
  fullWidth?: boolean;
  loading?: boolean;
}

const ButtonContainer = styled(TouchableOpacity)<{ disabled?: boolean; width?: number | string; fullWidth?: boolean }>`
  border-radius: 10px;
  background: #7f8eff;
  width: ${props => {
    if (props.fullWidth) return "100%";
    if (props.width) {
      return typeof props.width === "number" ? `${props.width}px` : props.width;
    }
    return "352px";
  }};
  height: 48px;
  justify-content: center;
  align-items: center;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled(RNText)`
  color: #ffffff;
  font-family: ${props => props.theme.fonts.medium};
`;

export const DefaultButton = ({ children, onPress, disabled, width, fullWidth, loading }: DefaultButtonProps) => {
  return (
    <ButtonContainer
      onPress={onPress}
      disabled={disabled || loading}
      width={width}
      fullWidth={fullWidth}
    >
      {loading ? <ActivityIndicator color="#ffffff" /> : <ButtonText>{children}</ButtonText>}
    </ButtonContainer>
  );
};
