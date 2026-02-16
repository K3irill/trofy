import styled from 'styled-components'

export const SidebarContainer = styled.div`
  width: 250px;
  padding: 1.5rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  height: fit-content;
  position: sticky;
  top: 2rem;
`

export const SidebarSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const FolderItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.light[300])};
  background: ${(props) => (props.$active ? props.theme.colors.primary + '33' : 'transparent')};
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary + '80' : 'transparent')};

  &:hover {
    background: ${(props) => props.theme.colors.dark[600]}80;
    color: ${(props) => props.theme.colors.light[100]};
  }

  svg {
    font-size: 1rem;
  }
`

export const TagItem = styled(FolderItem)<{ $color?: string }>`
  color: ${(props) => (props.$active ? (props.$color || props.theme.colors.primary) : props.theme.colors.light[300])};
  background: ${(props) =>
    props.$active ? (props.$color || props.theme.colors.primary) + '33' : 'transparent'};
  border-color: ${(props) =>
    props.$active ? (props.$color || props.theme.colors.primary) + '80' : 'transparent'};
`

export const AddButton = styled.button<{ $small?: boolean }>`
  background: ${(props) => props.theme.colors.primary}33;
  border: 1px solid ${(props) => props.theme.colors.primary}80;
  color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => (props.$small ? '0.25rem' : '0.375rem')};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: ${(props) => (props.$small ? '0.875rem' : '1rem')};

  &:hover {
    background: ${(props) => props.theme.colors.primary}4d;
    transform: scale(1.1);
  }
`

export const AddForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  margin-top: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 6px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`
