import { motion } from 'framer-motion';
import { StyledCard } from './styled';
import { CardProps } from './types';

export const Card = ({ children, glow = false, variant = 'default' }: CardProps) => {
  return (
    <StyledCard
      glow={glow}
      variant={variant}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </StyledCard>
  );
};
