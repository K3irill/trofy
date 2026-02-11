import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  padding: 2rem 0;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column-reverse;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 0;
  }
`

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const AsideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  /* position: sticky; */
  top: 25px;
  /* height: fit-content; */

  @media (max-width: 1024px) {
    position: static;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
    gap: 0.75rem;
  }
`

export const SectionMarker = styled(motion.div)`
  width: 4px;
  height: 32px;
  background: linear-gradient(180deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};

  @media (max-width: 768px) {
    height: 28px;
  }
`

export const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`
