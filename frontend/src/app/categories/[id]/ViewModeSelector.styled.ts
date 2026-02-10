import styled from 'styled-components'

export const ViewModeSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(31, 41, 55, 0.5);
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid rgba(55, 65, 81, 0.5);

  @media (max-width: 768px) {
    gap: 0.375rem;
    padding: 0.2rem;
  }
`

export const ModeButton = styled.button<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 168, 204, 0.2) 100%)' 
    : 'transparent'};
  border: 2px solid ${props => props.active ? '#00d4ff' : 'transparent'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#00d4ff' : '#9ca3af'};
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.4) 0%, rgba(0, 168, 204, 0.3) 100%)' 
      : 'rgba(0, 212, 255, 0.1)'};
    border-color: ${props => props.active ? '#00d4ff' : '#4b5563'};
    color: ${props => props.active ? '#00d4ff' : '#d1d5db'};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    min-width: 40px;
  }
`
