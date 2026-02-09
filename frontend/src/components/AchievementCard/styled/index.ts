import styled from 'styled-components';
import { motion } from 'framer-motion';

export const CardContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
`;

export const CardBody = styled(motion.div)<{ opacity: number }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[800]} 0%, ${(props) => props.theme.colors.dark[900]} 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: ${(props) => props.opacity};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      transparent 40%,
      ${(props) => props.theme.colors.primary}33 50%,
      transparent 60%,
      transparent
    );
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }
`;

export const IconContainer = styled.div<{ rarity: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${(props) => props.theme.colors.dark[700]};
  border: 3px solid ${(props) => props.theme.colors.rarity[props.rarity as keyof typeof props.theme.colors.rarity]};
  box-shadow: 0 0 20px ${(props) => props.theme.colors.rarity[props.rarity as keyof typeof props.theme.colors.rarity]}66;
  font-size: 2rem;
`;

export const Title = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  z-index: 1;
`;

export const Description = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  z-index: 1;
`;

export const XPReward = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.875rem;
  background: ${(props) => props.theme.colors.dark[700]};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  z-index: 1;
`;

export const RarityBadge = styled.span<{ rarity: string }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => props.theme.colors.rarity[props.rarity as keyof typeof props.theme.colors.rarity]}33;
  color: ${(props) => props.theme.colors.rarity[props.rarity as keyof typeof props.theme.colors.rarity]};
  border: 1px solid ${(props) => props.theme.colors.rarity[props.rarity as keyof typeof props.theme.colors.rarity]};
`;
