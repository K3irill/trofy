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

export const DescriptionText = styled.p<{ $isExpanded?: boolean }>`
  margin: 0;
  position: relative;
  z-index: 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  ${(props) => !props.$isExpanded && `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`

export const DescriptionToggle = styled.button`
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.colors.primary}20;
  border: 1px solid ${(props) => props.theme.colors.primary}4d;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: fit-content;
  position: relative;
  z-index: 2;

  &:hover {
    background: ${(props) => props.theme.colors.primary}33;
    border-color: ${(props) => props.theme.colors.primary}80;
    transform: translateY(-1px);
  }
`
