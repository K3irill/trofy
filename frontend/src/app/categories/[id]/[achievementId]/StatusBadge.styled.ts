import styled from 'styled-components'

type StatusType = 'in_progress' | 'achieved' | 'not_achieved'

export const StatusBadgeContainer = styled.div<{ $status: StatusType }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;

  ${(props) => {
    switch (props.$status) {
      case 'in_progress':
        return `
          background: linear-gradient(135deg, #ffa50020 0%, #ff8c0020 100%);
          color: #ffa500;
          border: 1px solid #ffa50040;
          box-shadow: 0 2px 8px rgba(255, 165, 0, 0.2);
        `
      case 'achieved':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
          border: 1px solid ${props.theme.colors.success}40;
          box-shadow: 0 2px 8px ${props.theme.colors.success}20;
        `
      case 'not_achieved':
        return `
          background: ${props.theme.colors.dark[600]}40;
          color: ${props.theme.colors.light[300]};
          border: 1px solid ${props.theme.colors.dark[600]}60;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `
      default:
        return ''
    }
  }}

  svg {
    font-size: 1rem;
  }
`

export const StatusText = styled.span`
  font-size: 0.875rem;
`
