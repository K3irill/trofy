import { IoGlobe, IoPerson, IoPeople, IoGrid } from 'react-icons/io5'
import { FilterTumblerContainer, FilterButton } from './page.styled'

interface FilterTumblerProps {
  mode: 'all' | 'my' | 'global' | 'custom'
  onChange: (mode: 'all' | 'my' | 'global' | 'custom') => void
  isAuth?: boolean
}

export const FilterTumbler = ({ mode, onChange, isAuth = false }: FilterTumblerProps) => {
  const filters = [
    { value: 'all' as const, label: 'Все', icon: IoGrid, requiresAuth: false },
    { value: 'global' as const, label: 'Глобальные', icon: IoGlobe, requiresAuth: false },
    { value: 'custom' as const, label: 'Пользовательские', icon: IoPeople, requiresAuth: false },
    { value: 'my' as const, label: 'Мои', icon: IoPerson, requiresAuth: true },
  ]

  return (
    <FilterTumblerContainer>
      {filters.filter(item => !item.requiresAuth || isAuth).map((filter) => {
        const Icon = filter.icon
        return (
          <FilterButton
            key={filter.value}
            $active={mode === filter.value}
            onClick={() => onChange(filter.value)}
          >
            <Icon />
            <span>{filter.label}</span>
          </FilterButton>
        )
      })}
    </FilterTumblerContainer>
  )
}
