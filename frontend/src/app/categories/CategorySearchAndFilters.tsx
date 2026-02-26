'use client'

import styled from 'styled-components'
import { IoSearch } from 'react-icons/io5'
import { ThemedSelect, ThemedSelectOption } from '@/components/Select/ThemedSelect'

const SearchFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

const SearchInput = styled.input`
  background: linear-gradient(
    145deg,
    ${(props) => props.theme.colors.dark[700]}e6 0%,
    ${(props) => props.theme.colors.dark[800]}f2 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 12px;
  padding: 0.875rem 1rem;
  padding-left: 2.75rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};

  &:hover {
    border-color: ${(props) => `${props.theme.colors.primary}66`};
    background: linear-gradient(
      145deg,
      ${(props) => props.theme.colors.dark[700]}f0 0%,
      ${(props) => props.theme.colors.dark[800]}f8 100%
    );
    box-shadow: ${(props) => props.theme.shadows.glass.light},
      ${(props) => `0 0 15px ${props.theme.colors.primary}20`};
    transform: translateY(-2px);
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    background: linear-gradient(
      145deg,
      ${(props) => props.theme.colors.dark[700]}f0 0%,
      ${(props) => props.theme.colors.dark[800]}f8 100%
    );
    box-shadow: ${(props) => props.theme.shadows.glow.primary},
      ${(props) => props.theme.shadows.glass.medium};
    transform: translateY(-2px);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
    opacity: 0.7;
  }
`

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;

  .search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    color: ${(props) => props.theme.colors.light[300]};
    pointer-events: none;
    z-index: 1;
    transition: transform 0.3s ease, color 0.3s ease;
  }

  &:focus-within .search-icon {
    transform: translateY(-50%) scale(1.1);
    color: ${(props) => props.theme.colors.primary};
  }
`

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    gap: 0.625rem;
  }
`

const FilterSelectWrapper = styled.div`
  position: relative;
  min-width: 200px;

  @media (max-width: 1024px) {
    width: 100%;
    min-width: unset;
  }
`

interface CategorySearchAndFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  privacyFilter: string
  onPrivacyFilterChange: (value: string) => void
}

export const CategorySearchAndFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  privacyFilter,
  onPrivacyFilterChange,
}: CategorySearchAndFiltersProps) => {
  const sortOptions: ThemedSelectOption[] = [
    { value: 'default', label: 'Сортировка' },
    { value: 'name-asc', label: 'По названию (А-Я)' },
    { value: 'name-desc', label: 'По названию (Я-А)' },
    { value: 'total-asc', label: 'По количеству (меньше)' },
    { value: 'total-desc', label: 'По количеству (больше)' },
    { value: 'progress-asc', label: 'По прогрессу (меньше)' },
    { value: 'progress-desc', label: 'По прогрессу (больше)' },
  ]

  const privacyOptions: ThemedSelectOption[] = [
    { value: '', label: 'Все категории' },
    { value: 'public', label: 'Публичные' },
    { value: 'private', label: 'Приватные' },
  ]

  return (
    <SearchFiltersContainer>
      <SearchInputWrapper>
        <IoSearch className="search-icon" />
        <SearchInput
          type="text"
          placeholder="Поиск по названию категории..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchInputWrapper>
      <FiltersRow>
        <FilterSelectWrapper>
          <ThemedSelect
            options={privacyOptions}
            value={privacyOptions.find((opt) => opt.value === privacyFilter)}
            onChange={(option) => onPrivacyFilterChange(option?.value || '')}
            isClearable
            placeholder="Все категории"
          />
        </FilterSelectWrapper>
        <FilterSelectWrapper>
          <ThemedSelect
            options={sortOptions}
            value={sortOptions.find((opt) => opt.value === sortBy)}
            onChange={(option) => onSortChange(option?.value || 'default')}
            placeholder="Сортировка"
          />
        </FilterSelectWrapper>
      </FiltersRow>
    </SearchFiltersContainer>
  )
}
