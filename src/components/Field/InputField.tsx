import React, { useState } from "react";
import styled from "styled-components/native";
import { TextInput, TextInputProps, View } from "react-native";
import { Text } from "../Text";
import { theme } from "../../styles";

interface InputFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  labelColor?: string;
  placeholder?: string;
  errorText?: string;
  successText?: string;
  containerStyle?: any;
}

const InputContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const InputLabel = styled(Text)`
  color: ${props => props.labelColor || props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSize.md}px;
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  font-family: ${props => props.theme.fonts.medium};
`;

const InputWrapper = styled.View`
  position: relative;
`;

const StyledTextInput = styled.TextInput<{ hasError?: boolean; hasSuccess?: boolean }>`
  width: 100%;
  height: 48px;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSize.sm}px;
  font-family: ${props => props.theme.fonts.primary};
`;

const InputLine = styled.View<{ focused?: boolean; hasError?: boolean; hasSuccess?: boolean }>`
  width: 100%;
  height: ${props => (props.focused ? "1.5px" : "1.5px")};
  background: ${props => {
    if (props.hasError) return props.theme.colors.status.error || "#FF6B6B";
    if (props.hasSuccess) return "#65BF73";
    if (props.focused) return props.theme.colors.primary;
    return props.theme.colors.border;
  }};
  margin-top: 4px;
`;

const HelperText = styled(Text)`
  font-size: ${props => props.theme.fontSize.sm}px;
  margin-top: ${props => props.theme.spacing.xs}px;
  font-family: ${props => props.theme.fonts.primary};
`;

const ErrorText = styled(HelperText)`
  color: ${props => props.theme.colors.status.error || "#FF6B6B"};
`;

const SuccessText = styled(HelperText)`
  color: #65BF73;
`;

export const InputField = ({
  label,
  labelColor,
  placeholder,
  errorText,
  successText,
  containerStyle,
  ...textInputProps
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <InputContainer style={containerStyle}>
      {label && <InputLabel labelColor={labelColor}>{label}</InputLabel>}
      <InputWrapper>
        <StyledTextInput
          {...textInputProps}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          hasError={!!errorText}
          hasSuccess={!!successText && !errorText}
          onFocus={e => {
            setFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
        <InputLine focused={focused} hasError={!!errorText} hasSuccess={!!successText && !errorText} />
      </InputWrapper>
      {errorText && <ErrorText>{errorText}</ErrorText>}
      {successText && !errorText && <SuccessText>{successText}</SuccessText>}
    </InputContainer>
  );
};

