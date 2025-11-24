import React from "react";
import styled from "styled-components/native";
import Svg, { Path } from "react-native-svg";
import { Container } from "../../components";
import { Text } from "../../components";
import { theme } from "../../styles";

const SplashContainer = styled(Container)`
  align-items: flex-start;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const ContentContainer = styled.View`
  padding-top: ${theme.spacing.xl + 260}px;
  padding-left: ${theme.spacing.xl}px;
  padding-right: ${theme.spacing.xl}px;
`;

const LogoContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const TitleSvg = () => (
  <Svg
    width="204"
    height="170"
    viewBox="0 0 204 170"
    fill="none"
  >
    <Path
      d="M2 169V83H27.2548V152.756H70L60.0645 169H2Z"
      fill="#191C32"
    />
    <Path
      d="M63 117.5C63 122.194 59.1944 126 54.5 126C49.8056 126 46 122.194 46 117.5C46 112.806 49.8056 109 54.5 109C59.1944 109 63 112.806 63 117.5Z"
      fill="#7F8EFF"
    />
    <Path
      d="M5.65875 68.64V14.88H20.7787V68.64H5.65875ZM28.3181 68.56V27.36H41.4381V30.96H41.8381C45.4381 28.16 49.7581 26.64 54.9581 26.64C62.6381 26.64 67.1181 29.76 67.1181 37.92V68.56H53.5181V41.68C53.5181 38.32 52.0781 37.2 48.3181 37.2C46.1581 37.2 43.5981 37.92 41.9981 38.56V68.56H28.3181ZM85.2694 68.64V25.68H71.1094V14.88H114.469V25.68H100.389V68.64H85.2694ZM118.693 68.56V11.36H132.373V30.64H132.693C135.893 28.08 140.133 26.64 145.333 26.64C153.013 26.64 157.493 29.76 157.493 37.92V68.56H143.893V41.68C143.893 38.32 142.453 37.2 138.693 37.2C136.533 37.2 133.973 37.92 132.373 38.56V68.56H118.693ZM182.284 35.6C179.244 35.6 176.364 37.36 175.804 43.76H188.284C188.284 37.76 186.284 35.6 182.284 35.6ZM183.804 69.36C169.164 69.36 162.044 62 162.044 48.4V47.36C162.044 34.64 169.964 26.64 182.284 26.64C196.124 26.64 201.324 34.4 201.324 47.92V51.44H175.884C176.684 57.92 180.364 59.76 187.324 59.76C192.204 59.76 196.444 58.56 199.644 57.28V65.68C196.524 67.52 191.404 69.36 183.804 69.36Z"
      fill="#191C32"
    />
    <Path
      d="M134.552 118.712H143.256C149.912 118.712 154.648 115.896 154.648 108.216C154.648 101.048 150.808 98.36 143.512 98.36H134.552V118.712ZM134.552 153.4H144.792C152.216 153.4 156.696 149.944 156.696 142.392C156.696 134.968 152.344 131.768 144.152 131.768H134.552V153.4ZM118.245 169.016L111 83H148.248C167.448 83 177.688 90.296 177.688 104.888C177.688 114.744 173.208 121.016 163.352 123.832V124.216C174.104 126.136 181.528 131.896 181.528 144.568C181.528 158.52 172.056 169.016 149.784 169.016H118.245Z"
      fill="#191C32"
    />
    <Path
      d="M97.832 107.96L88.744 136.504H107.432L98.344 107.96H97.832ZM57 169.016L87.08 83H112.808L138.273 169.016H118.056L112.296 151.992H84.136L78.76 169.016H57Z"
      fill="#191C32"
    />
  </Svg>
);

const DividerContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const DividerSvg = () => (
  <Svg
    width="296"
    height="6"
    viewBox="0 0 296 6"
    fill="none"
  >
    <Path
      d="M290.333 2.6665C290.333 4.13926 291.527 5.33317 293 5.33317C294.473 5.33317 295.667 4.13926 295.667 2.6665C295.667 1.19374 294.473 -0.00016284 293 -0.00016284C291.527 -0.00016284 290.333 1.19374 290.333 2.6665ZM0 2.6665V3.1665H293V2.6665V2.1665H0V2.6665Z"
      fill="#B0B0B0"
    />
  </Svg>
);

const SplashText = styled(Text)`
  font-family: ${theme.fonts.medium};
`;

export const Splash = () => {
  return (
    <SplashContainer>
      <ContentContainer>
        <LogoContainer>
          <TitleSvg />
        </LogoContainer>
        <DividerContainer>
          <DividerSvg />
        </DividerContainer>
        <SplashText size={theme.fontSize.xxl}>출근관리를 한번에</SplashText>
      </ContentContainer>
    </SplashContainer>
  );
};
