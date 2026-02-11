'use client'

import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const dots = keyframes`
  0%, 20% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-8px);
  }
  80%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
`

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.dark.bg};
  z-index: 9999;
  overflow: hidden;
`

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
`

const OrbContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const OuterRing = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border: 3px solid transparent;
  border-top-color: ${(props) => props.theme.colors.primary};
  border-right-color: ${(props) => props.theme.colors.secondary};
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
`

const MiddleRing = styled.div`
  position: absolute;
  width: 90px;
  height: 90px;
  border: 3px solid transparent;
  border-bottom-color: ${(props) => props.theme.colors.accent};
  border-left-color: ${(props) => props.theme.colors.gold};
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite reverse;
  box-shadow: ${(props) => props.theme.shadows.glow.gold};
`

const InnerOrb = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 50%,
    ${(props) => props.theme.colors.gold} 100%
  );
  background-size: 200% 200%;
  animation: ${pulse} 2s ease-in-out infinite, ${shimmer} 3s linear infinite;
  box-shadow: ${(props) => props.theme.shadows.glow.primary},
    ${(props) => props.theme.shadows.glow.gold};
`

const Particle = styled.div<{ delay: number; angle: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
    rotate(${(props) => props.angle}deg)
    translateY(-70px);
  animation: ${rotate} 3s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  opacity: 0.8;
`

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${float} 2s ease-in-out infinite;
`

const LoadingText = styled.span`
  color: ${(props) => props.theme.colors.light[200]};
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
`

const DotsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  animation: ${dots} 1.4s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
`

export function Loader() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    delay: i * 0.3,
    angle: (i * 360) / 6,
  }))

  return (
    <LoaderContainer>
      <LoaderWrapper>
        <OrbContainer>
          <OuterRing />
          <MiddleRing />
          <InnerOrb />
          {particles.map((particle, index) => (
            <Particle
              key={index}
              delay={particle.delay}
              angle={particle.angle}
            />
          ))}
        </OrbContainer>
        <TextContainer>
          <LoadingText>Загрузка</LoadingText>
          <DotsContainer>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </DotsContainer>
        </TextContainer>
      </LoaderWrapper>
    </LoaderContainer>
  )
}
