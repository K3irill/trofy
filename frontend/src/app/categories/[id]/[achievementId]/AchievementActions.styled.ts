import styled from 'styled-components'

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'active' | 'warning' }>`
  flex: 1;
  min-width: 140px;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 2px solid;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
          border-color: #00d4ff;
          color: #0a0e17;
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
          }
        `
      case 'active':
        return `
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 168, 204, 0.1) 100%);
          border-color: #00d4ff;
          color: #00d4ff;

          &:hover {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 168, 204, 0.2) 100%);
          }
        `
      case 'warning':
        return `
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
          border-color: #ef4444;
          color: #ef4444;

          &:hover {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
          }
        `
      default:
        return `
          background: rgba(17, 24, 39, 0.8);
          border-color: rgba(55, 65, 81, 0.5);
          color: #9ca3af;

          &:hover {
            border-color: #00d4ff;
            color: #00d4ff;
            background: rgba(0, 212, 255, 0.1);
          }
        `
    }
  }}

  span {
    font-size: 1.125rem;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`
