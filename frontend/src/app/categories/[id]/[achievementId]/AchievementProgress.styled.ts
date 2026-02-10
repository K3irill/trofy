import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ProgressContainer = styled.div`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(55, 65, 81, 0.5);
`

export const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const ProgressText = styled.span`
  color: #f3f4f6;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(55, 65, 81, 0.5);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`
