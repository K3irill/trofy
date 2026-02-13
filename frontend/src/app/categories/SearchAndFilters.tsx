'use client'

import styled from 'styled-components'
import { IoSearch, IoImage } from 'react-icons/io5'
import { useGetCategoriesQuery } from '@/store/api/achievementsApi'
import { isImageUrl } from '@/lib/utils/iconUtils'
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

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const FilterSelectWrapper = styled.div`
  position: relative;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`

interface SearchAndFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  rarityFilter: string
  onRarityFilterChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  isAuthenticated?: boolean
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  rarityFilter,
  onRarityFilterChange,
  sortBy,
  onSortChange,
  isAuthenticated = false,
}: SearchAndFiltersProps) => {
  const { data: categoriesData = [] } = useGetCategoriesQuery()

  const categoryOptions: ThemedSelectOption[] = [
    { value: '', label: 'Все категории' },
    ...categoriesData.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ]

  const statusOptions: ThemedSelectOption[] = [
    { value: '', label: 'Все статусы' },
    { value: 'achieved', label: 'Достигнуто' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'not_achieved', label: 'Не достигнуто' },
  ]

  const rarityOptions: ThemedSelectOption[] = [
    { value: '', label: 'Вся редкость' },
    { value: 'common', label: 'Обычные' },
    { value: 'rare', label: 'Редкие' },
    { value: 'epic', label: 'Эпические' },
    { value: 'legendary', label: 'Легендарные' },
  ]

  const sortOptions: ThemedSelectOption[] = [
    { value: 'default', label: 'Сортировка' },
    { value: 'achieved-first', label: 'Достигнуто' },
    { value: 'not-achieved-first', label: 'Не достигнуто' },
    { value: 'in-progress-first', label: 'В работе' },
    ...(statusFilter === 'achieved'
      ? [
        { value: 'date-asc', label: 'По дате (старые сначала)' },
        { value: 'date-desc', label: 'По дате (новые сначала)' },
      ]
      : []),
  ]

  return (
    <SearchFiltersContainer>
      <SearchInputWrapper>
        <IoSearch className="search-icon" />
        <SearchInput
          type="text"
          placeholder="Поиск по названию достижения..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchInputWrapper>
      <FiltersRow>
        <FilterSelectWrapper>
          <ThemedSelect
            options={categoryOptions}
            value={categoryOptions.find((opt) => opt.value === selectedCategory)}
            onChange={(option) => onCategoryChange(option?.value || '')}
            isClearable
            placeholder="Все категории"
          />
        </FilterSelectWrapper>
        {isAuthenticated && (
          <FilterSelectWrapper>
            <ThemedSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === statusFilter)}
              onChange={(option) => onStatusFilterChange(option?.value || '')}
              isClearable
              placeholder="Все статусы"
            />
          </FilterSelectWrapper>
        )}
        <FilterSelectWrapper>
          <ThemedSelect
            options={rarityOptions}
            value={rarityOptions.find((opt) => opt.value === rarityFilter)}
            onChange={(option) => onRarityFilterChange(option?.value || '')}
            isClearable
            placeholder="Вся редкость"
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
