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
          background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.dark.bg};
          box-shadow: ${props.theme.shadows.glow.primary};

          &:hover {
            transform: translateY(-2px);
            box-shadow: ${props.theme.shadows.glow.primary}, ${props.theme.shadows.glass.medium};
          }
        `
      case 'active':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}1a 100%);
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};

          &:hover {
            background: linear-gradient(135deg, ${props.theme.colors.primary}4d 0%, ${props.theme.colors.secondary}33 100%);
          }
        `
      case 'warning':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.danger}33 0%, ${props.theme.colors.danger}1a 100%);
          border-color: ${props.theme.colors.danger};
          color: ${props.theme.colors.danger};

          &:hover {
            background: linear-gradient(135deg, ${props.theme.colors.danger}4d 0%, ${props.theme.colors.danger}33 100%);
          }
        `
      default:
        return `
          background: ${props.theme.colors.dark[800]}cc;
          border-color: ${props.theme.colors.dark[600]}80;
          color: ${props.theme.colors.light[300]};

          &:hover {
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
            background: ${props.theme.colors.primary}1a;
          }
        `
    }
  }}

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`
