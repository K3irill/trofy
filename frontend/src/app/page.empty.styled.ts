import styled from 'styled-components'
import { motion } from 'framer-motion'

export const EmptyProfileContainer = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark[900]};
  border: 1px solid ${(props) => props.theme.colors.dark[700]};
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
`

export const EmptyProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
`

export const EmptyProfileTitle = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const EmptyProfileText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const EmptyProfileButton = styled.div`
  margin-top: 0.5rem;
`
