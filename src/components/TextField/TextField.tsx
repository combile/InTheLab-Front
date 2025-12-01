import React, { useState } from "react";
import styled from "styled-components/native";
import { TextInput, TextInputProps } from "react-native";
import { Text } from "../Text";
import { theme } from "../../styles";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  containerStyle?: any;
}

const InputContainer = styled.View`
  margin-bottom: 28px;
  width: ${Math.min(343, screenWidth - 32)}px;
  max-width: 343px;
`;

const InputLabel = styled(Text)`
  color: ${theme.colors.text.primary};
  text-align: left;
  font-size: ${theme.fontSize.md}px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 12px;
  font-family: ${theme.fonts.medium};
`;

const InputField = styled.TextInput`
  width: 100%;
  height: 48px;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSize.sm}px;
  font-family: ${theme.fonts.primary};
`;

const InputLine = styled.View<{ focused?: boolean }>`
  width: 100%;
  height: ${props => (props.focused ? "2px" : "1.5px")};
  background: ${props => (props.focused ? theme.colors.primary : theme.colors.border)};
  margin-top: 4px;
`;

export const TextField = ({
  label,
  placeholder,
  placeholderTextColor,
  containerStyle,
  ...textInputProps
}: TextFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <InputContainer style={containerStyle}>
      {label && <InputLabel>{label}</InputLabel>}
      <InputField
        {...textInputProps}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || theme.colors.text.secondary}
        onFocus={e => {
          setFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          textInputProps.onBlur?.(e);
        }}
      />
      <InputLine focused={focused} />
    </InputContainer>
  );
};
