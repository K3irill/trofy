import styled from 'styled-components'

export const EntryCard = styled.div<{ $isPinned?: boolean }>`
  padding: 1.5rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  border: 2px solid ${(props) => (props.$isPinned ? props.theme.colors.primary + '80' : props.theme.colors.dark[600] + '80')};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => props.theme.colors.primary}80;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    border-radius: 12px;
  }
`

export const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 640px) {
    margin-bottom: 0.75rem;
    gap: 0.75rem;
  }
`

export const EntryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[100]};
  margin: 0 0 0.5rem 0;

  @media (max-width: 640px) {
    font-size: 1.125rem;
    margin: 0 0 0.375rem 0;
  }
`

export const EntryMeta = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.light[300]};

  @media (max-width: 640px) {
    font-size: 0.6875rem;
  }
`

export const EntryContent = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.light[200]};
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    margin-bottom: 0.75rem;
    -webkit-line-clamp: 2;
  }
`

export const EntryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 640px) {
    gap: 0.375rem;
  }
`

export const ActionButton = styled.button<{ $active?: boolean; $danger?: boolean }>`
  background: ${(props) =>
    props.$active
      ? props.theme.colors.primary + '33'
      : props.$danger
        ? props.theme.colors.danger + '33'
        : 'transparent'};
  border: 1px solid
    ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.$danger
        ? props.theme.colors.danger
        : props.theme.colors.dark[600] + '80'};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.$danger
        ? props.theme.colors.danger
        : props.theme.colors.light[300]};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: ${(props) =>
    props.$active
      ? props.theme.colors.primary + '4d'
      : props.$danger
        ? props.theme.colors.danger + '4d'
        : props.theme.colors.dark[600] + '80'};
    transform: scale(1.1);
  }

  @media (max-width: 640px) {
    padding: 0.375rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }
`

export const EntryBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    gap: 0.375rem;
    margin-top: 0.75rem;
  }
`

export const Badge = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: ${(props) => (props.$color ? props.$color + '33' : props.theme.colors.dark[600] + '80')};
  border: 1px solid ${(props) => (props.$color ? props.$color + '80' : props.theme.colors.dark[600])};
  border-radius: 12px;
  font-size: 0.75rem;
  color: ${(props) => (props.$color ? props.$color : props.theme.colors.light[300])};
  font-weight: 500;

  @media (max-width: 640px) {
    padding: 0.1875rem 0.625rem;
    font-size: 0.6875rem;
    border-radius: 10px;
  }
`

export const TypeBadge = styled(Badge)`
  background: ${(props) => props.$color + '33'};
  border-color: ${(props) => props.$color + '80'};
  color: ${(props) => props.$color};
  font-weight: 600;
`
