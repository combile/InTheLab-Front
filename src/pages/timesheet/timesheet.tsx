import React from "react";
import styled from "styled-components/native";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.text.primary};
`;

export const Timesheet = () => {
  return (
    <Screen>
      <Content>
        <Title>출근부 페이지</Title>
      </Content>
    </Screen>
  );
};



