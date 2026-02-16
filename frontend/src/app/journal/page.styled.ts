import styled from 'styled-components'

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  margin: 0;
`

export const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border: none;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${(props) => props.theme.colors.primary}4d;
  }
`

export const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`

export const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.25rem;
  pointer-events: none;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 3rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}1a;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

export const FiltersRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.625rem 1rem;
  background: ${(props) =>
    props.$active
      ? `${props.theme.colors.primary}33`
      : `linear-gradient(145deg, ${props.theme.colors.dark[700]}e6 0%, ${props.theme.colors.dark[800]}f2 100%)`};
  border: 2px solid ${(props) => (props.$active ? props.theme.colors.primary + '80' : props.theme.colors.dark[600] + '80')};
  border-radius: 8px;
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.light[300])};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}80;
    color: ${(props) => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`

export const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
`

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`

export const EmptyStateText = styled.div`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.light[300]};
  margin-bottom: 1rem;
`
