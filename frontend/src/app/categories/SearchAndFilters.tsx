'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { categories } from './page.constants'

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

  &::before {
    content: '🔍';
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    pointer-events: none;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &:focus-within::before {
    transform: translateY(-50%) scale(1.1);
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

  &::after {
    content: '';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${(props) => props.theme.colors.light[300]};
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 1;
  }

  &:hover::after {
    border-top-color: ${(props) => props.theme.colors.primary};
    transform: translateY(-50%) scale(1.1);
  }
`

const FilterSelect = styled.select`
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
  padding-right: 2.5rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  appearance: none;
  width: 100%;
  position: relative;
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

  &:active {
    transform: translateY(0);
  }

  option {
    background: ${(props) => props.theme.colors.dark[800]};
    color: ${(props) => props.theme.colors.light[100]};
    padding: 0.75rem;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${(props) => props.theme.colors.dark[700]};
      color: ${(props) => props.theme.colors.primary};
    }

    &:checked {
      background: ${(props) => `${props.theme.colors.primary}1a`};
      color: ${(props) => props.theme.colors.primary};
      font-weight: 600;
    }
  }

  &::-ms-expand {
    display: none;
  }

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
  unlockedFilter: string
  onUnlockedFilterChange: (value: string) => void
  rarityFilter: string
  onRarityFilterChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  unlockedFilter,
  onUnlockedFilterChange,
  rarityFilter,
  onRarityFilterChange,
  sortBy,
  onSortChange,
}: SearchAndFiltersProps) => {
  return (
    <SearchFiltersContainer>
      <SearchInputWrapper>
        <SearchInput
          type="text"
          placeholder="Поиск по названию достижения..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchInputWrapper>
      <FiltersRow>
        <FilterSelectWrapper>
          <FilterSelect
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </FilterSelect>
        </FilterSelectWrapper>
        <FilterSelectWrapper>
          <FilterSelect
            value={unlockedFilter}
            onChange={(e) => onUnlockedFilterChange(e.target.value)}
          >
            <option value="">Все достижения</option>
            <option value="true">Разблокированные</option>
            <option value="false">Заблокированные</option>
          </FilterSelect>
        </FilterSelectWrapper>
        <FilterSelectWrapper>
          <FilterSelect
            value={rarityFilter}
            onChange={(e) => onRarityFilterChange(e.target.value)}
          >
            <option value="">Вся редкость</option>
            <option value="common">Обычные</option>
            <option value="rare">Редкие</option>
            <option value="epic">Эпические</option>
            <option value="legendary">Легендарные</option>
          </FilterSelect>
        </FilterSelectWrapper>
        <FilterSelectWrapper>
          <FilterSelect
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Сортировка</option>
            <option value="unlocked-asc">По завершенности (сначала завершенные)</option>
            <option value="unlocked-desc">По завершенности (сначала незавершенные)</option>
            {unlockedFilter === 'true' && (
              <>
                <option value="date-asc">По дате (старые сначала)</option>
                <option value="date-desc">По дате (новые сначала)</option>
              </>
            )}
          </FilterSelect>
        </FilterSelectWrapper>
      </FiltersRow>
    </SearchFiltersContainer>
  )
}
