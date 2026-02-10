import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ProgressContainer = styled.div`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
`

export const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const ProgressText = styled.span`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`
