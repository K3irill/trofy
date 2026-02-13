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
    ? `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}1a 100%)`
    : `${props.theme.colors.dark[800]}cc`};
  border: 2px solid ${props => props.liked ? props.theme.colors.primary : `${props.theme.colors.dark[600]}80`};
  border-radius: 12px;
  color: ${props => props.liked ? props.theme.colors.primary : props.theme.colors.light[300]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}1a;
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
  background: ${(props) => props.theme.colors.dark[600]}4d;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[300]};
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
