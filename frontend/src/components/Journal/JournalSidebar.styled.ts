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
  flex-shrink: 0;

  .mobile-view {
    display: none;
  }

  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    padding: 1rem;
    border-radius: 12px;

    .desktop-view {
      display: none;
    }

    .mobile-view {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    padding: 0;
    border-radius: 0;
    width: 100%;
    background: transparent;
    border: none;
    position: static;
  }
`

export const SidebarSection = styled.div`
  margin-bottom: 2rem;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 1024px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 640px) {
    margin-bottom: 0.5rem;
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

  @media (max-width: 640px) {
    display: none;
  }
`

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 640px) {
    flex-direction: row;
    gap: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
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
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.colors.dark[600]}80;
    color: ${(props) => props.theme.colors.light[100]};
  }

  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.375rem;
    flex-shrink: 0;
    min-width: fit-content;
    border-radius: 20px;
    background: ${(props) => (props.$active ? props.theme.colors.primary + '33' : props.theme.colors.dark[700] + '80')};
    border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary + '80' : props.theme.colors.dark[600] + '60')};

    svg {
      font-size: 0.75rem;
    }

    span {
      font-size: 0.75rem;

      &:last-child {
        display: none;
      }
    }
  }
`

export const TagItem = styled(FolderItem) <{ $color?: string }>`
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
  flex-shrink: 0;

  &:hover {
    background: ${(props) => props.theme.colors.primary}4d;
    transform: scale(1.1);
  }

  @media (max-width: 1024px) {
    &.desktop-add-btn {
      display: none;
    }

    &.mobile-add-btn {
      padding: 0.375rem;
      font-size: 0.875rem;
      background: ${(props) => props.theme.colors.primary}33;
      border: 1px solid ${(props) => props.theme.colors.primary}80;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  }

  @media (max-width: 640px) {
    padding: ${(props) => (props.$small ? '0.25rem' : '0.375rem')};
    font-size: ${(props) => (props.$small ? '0.75rem' : '0.875rem')};
    border-radius: 20px;
    flex-shrink: 0;
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

  @media (max-width: 1024px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 300px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    border: 2px solid ${(props) => props.theme.colors.dark[600]};
    background: ${(props) => props.theme.colors.dark[800]};
  }
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

export const MobileSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`

export const MobileSelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`
