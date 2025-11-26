import React from "react";
import styled from "styled-components/native";
import { Container } from "../../components";
import { Text } from "../../components";
import { theme } from "../../styles";

const MainContainer = styled(Container)`
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const MainTitle = styled(Text)`
  font-family: ${theme.fonts.bold};
  font-size: ${theme.fontSize.xl}px;
  color: ${theme.colors.text.primary};
`;

export const Main = () => {
  return (
    <MainContainer>
      <MainTitle>메인 화면</MainTitle>
    </MainContainer>
  );
};
