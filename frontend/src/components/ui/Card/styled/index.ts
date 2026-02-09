import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledCard = styled(motion.div)<{ glow: boolean; variant: string }>`
  background: ${(props) => props.theme.colors.dark[800]};
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  position: relative;
  overflow: hidden;

  ${(props) => {
    const variants = {
      default: `border-color: ${props.theme.colors.dark[600]};`,
      success: `border-color: ${props.theme.colors.success};`,
      warning: `border-color: ${props.theme.colors.warning};`,
      danger: `border-color: ${props.theme.colors.danger};`,
    };
    return variants[props.variant as keyof typeof variants];
  }}

  ${(props) =>
    props.glow &&
    `
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
    border-color: ${props.theme.colors.primary};
  `}
`;
