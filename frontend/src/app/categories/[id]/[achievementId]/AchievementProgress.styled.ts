import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ProgressContainer = styled.div<{ $isComplete?: boolean }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  transition: all 0.3s ease;

  ${(props) =>
    props.$isComplete &&
    `
    animation: pulse 1.5s ease-in-out infinite;
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 20px ${props.theme.colors.primary}40, 0 0 40px ${props.theme.colors.primary}20;
  `}

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 20px ${(props) => props.theme.colors.primary}40, 0 0 40px ${(props) => props.theme.colors.primary}20;
      border-color: ${(props) => props.theme.colors.primary};
    }
    50% {
      box-shadow: 0 0 30px ${(props) => props.theme.colors.primary}60, 0 0 60px ${(props) => props.theme.colors.primary}40;
      border-color: ${(props) => props.theme.colors.primary}CC;
    }
  }
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

export const ProgressSlider = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 12px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  z-index: 2;
  margin: 0;
  padding: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.4);
    transition: all 0.2s ease;
    border: 2px solid #00d4ff;
    margin-top: -4px;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 15px rgba(0, 212, 255, 1), 0 0 25px rgba(0, 212, 255, 0.6);
    }

    &:active {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: 2px solid #00d4ff;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.4);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 15px rgba(0, 212, 255, 1), 0 0 25px rgba(0, 212, 255, 0.6);
    }

    &:active {
      transform: scale(1.1);
    }
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    background: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 12px;
    background: transparent;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &::-webkit-slider-thumb {
      cursor: not-allowed;
    }

    &::-moz-range-thumb {
      cursor: not-allowed;
    }
  }
`

export const ProgressControls = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
`

export const ProgressButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.dark[400]};
  background: ${(props) => props.theme.colors.dark[500]};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;

  svg {
    color: ${(props) => props.theme.colors.primary};
    transition: color 0.2s ease;
  }

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
    transform: scale(1.05);

    svg {
      color: ${(props) => props.theme.colors.light[100]};
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    svg {
      color: ${(props) => props.theme.colors.dark[300]};
    }
  }
`