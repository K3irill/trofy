import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Marker = styled(motion.div)`
  width: 4px;
  height: 32px;
  background: linear-gradient(180deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};

  @media (max-width: 768px) {
    height: 28px;
  }
`
