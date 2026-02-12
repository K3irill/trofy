import styled from 'styled-components'

export const ProgressContainer = styled.div`
  background: ${(props) => props.theme.colors.dark[600]};
  border: 1px solid ${(props) => props.theme.colors.dark[500]};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${(props) => props.theme.shadows.glass.light};
`

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const ProgressTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.colors.light[100]};
`

export const ProgressValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(props) => props.theme.colors.dark[500]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`

export const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => Math.min(100, Math.max(0, props.$progress))}%;
  background: linear-gradient(90deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.primary}CC 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px ${(props) => props.theme.colors.primary}40;
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
  color: ${(props) => props.theme.colors.light[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.light[100]};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
