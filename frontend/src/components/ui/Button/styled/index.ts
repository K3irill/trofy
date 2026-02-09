import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledButton = styled(motion.button)<{ variant: string; size: string }>`
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${(props) => {
    const variants = {
      primary: `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
        color: ${props.theme.colors.dark[900]};
        box-shadow: ${props.theme.shadows.glow.primary};
      `,
      secondary: `
        background: ${props.theme.colors.dark[700]};
        color: ${props.theme.colors.primary};
        border: 2px solid ${props.theme.colors.primary};
      `,
      danger: `
        background: linear-gradient(135deg, ${props.theme.colors.danger} 0%, ${props.theme.colors.warning} 100%);
        color: ${props.theme.colors.dark[900]};
        box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
      `,
      ghost: `
        background: transparent;
        color: ${props.theme.colors.primary};
      `,
    };
    return variants[props.variant as keyof typeof variants];
  }}

  ${(props) => {
    const sizes = {
      sm: 'padding: 0.5rem 1rem; font-size: 0.875rem;',
      md: 'padding: 0.75rem 1.5rem; font-size: 1rem;',
      lg: 'padding: 1rem 2rem; font-size: 1.125rem;',
    };
    return sizes[props.size as keyof typeof sizes];
  }}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
