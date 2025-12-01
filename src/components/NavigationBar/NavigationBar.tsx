import React from "react";
import styled from "styled-components/native";
import Svg, { Rect } from "react-native-svg";

interface NavigationBarProps {
  currentStep: number;
  totalSteps?: number;
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 24px;
`;

const NavigationBar = ({ currentStep, totalSteps = 4 }: NavigationBarProps) => {
  const bars = Array.from({ length: totalSteps }, (_, index) => {
    const isActive = index + 1 <= currentStep;
    const width = 30;
    const gap = 6;
    const x = index * (width + gap);

    return (
      <Rect
        key={index}
        x={x}
        width={width}
        height="5"
        rx="2.5"
        fill={isActive ? "#7F8EFF" : "#D9D9D9"}
      />
    );
  });

  const totalWidth = totalSteps * 30 + (totalSteps - 1) * 6;

  return (
    <Container>
      <Svg
        width={totalWidth}
        height="5"
        viewBox={`0 0 ${totalWidth} 5`}
        fill="none"
      >
        {bars}
      </Svg>
    </Container>
  );
};

export { NavigationBar };
