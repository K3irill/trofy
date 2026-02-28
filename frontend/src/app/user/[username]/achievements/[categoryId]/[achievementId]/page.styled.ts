import styled from 'styled-components'
import { motion } from 'framer-motion'

export const AchievementActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-direction: column-reverse;

    .button-text {
      display: none;
    }

    button {
      padding: 0.5rem !important;
      gap: 0 !important;
    }
  }
`

export const EditAchievementButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%);
    border-color: rgba(0, 212, 255, 0.5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .button-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    background: rgba(2, 97, 116, 0.5);
    padding: 0.5rem;
    justify-content: center;
    gap: 0;

    svg {
      font-size: 1rem;
    }
  }
`

export const DeleteAchievementButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;

  &:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%);
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .button-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    background: rgba(130, 30, 30, 0.515);
    padding: 0.5rem;
    justify-content: center;
    gap: 0;

    svg {
      font-size: 1rem;
    }
  }
`
