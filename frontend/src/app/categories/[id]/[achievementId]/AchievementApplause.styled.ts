import styled from 'styled-components'

export const ApplauseContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

export const ApplauseButton = styled.button<{ liked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.liked
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 168, 204, 0.1) 100%)'
    : 'rgba(17, 24, 39, 0.8)'};
  border: 2px solid ${props => props.liked ? '#00d4ff' : 'rgba(55, 65, 81, 0.5)'};
  border-radius: 12px;
  color: ${props => props.liked ? '#00d4ff' : '#9ca3af'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: #00d4ff;
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
`

export const ApplauseCount = styled.span`
  font-size: 1rem;
  font-weight: 700;
`

export const ApplauseDisabled = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(55, 65, 81, 0.3);
  border-radius: 8px;
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }
`
