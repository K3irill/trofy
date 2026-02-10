import styled from 'styled-components'

export const ViewModeSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => props.theme.colors.dark[700]}80;
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.dark[600]}80;

  @media (max-width: 768px) {
    gap: 0.375rem;
    padding: 0.2rem;
  }
`

export const ModeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}4d 0%, ${props.theme.colors.secondary}33 100%)` 
    : 'transparent'};
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.light[300]};
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.active 
      ? `linear-gradient(135deg, ${props.theme.colors.primary}66 0%, ${props.theme.colors.secondary}4d 100%)` 
      : `${props.theme.colors.primary}1a`};
    border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.dark[600]};
    color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.light[200]};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    min-width: 40px;
  }
`
