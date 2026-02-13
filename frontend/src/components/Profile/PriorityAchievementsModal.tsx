'use client'

import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetAchievementsQuery, useGetCategoriesQuery, useGetRaritiesQuery } from '@/store/api/achievementsApi'
import styled from 'styled-components'
import { IoAddCircleOutline } from 'react-icons/io5'
import { HiOutlineSearch } from 'react-icons/hi'
import { renderIcon } from '@/lib/utils/iconUtils'
import { ThemedSelect, ThemedSelectOption } from '@/components/Select/ThemedSelect'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: ${(props) => props.theme.glass.border};
  position: relative;
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  flex: 1;
  text-align: center;
`

const CloseButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }
`

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

const FilterSelectWrapper = styled.div`
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`

const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
`

const AchievementItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    transform: translateX(4px);
  }
`

const AchievementIcon = styled.div<{ rarity: string }>`
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => {
    const colors: Record<string, string> = {
      common: props.theme.colors.rarity.base,
      rare: props.theme.colors.rarity.rare,
      epic: props.theme.colors.rarity.epic,
      legendary: props.theme.colors.rarity.legendary,
    }
    return colors[props.rarity] || props.theme.colors.rarity.base
  }};
  border-radius: 12px;
  opacity: 0.2;
`

const AchievementInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const AchievementTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[100]};
`

const AchievementDescription = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.light[300]};
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${(props) => props.theme.colors.light[300]};
`

interface PriorityAchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (achievementId: string) => void
  currentPriority: string[]
}

export const PriorityAchievementsModal = ({
  isOpen,
  onClose,
  onSelect,
  currentPriority,
}: PriorityAchievementsModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('')

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  const { data: categories } = useGetCategoriesQuery(undefined, {
    skip: !isOpen,
  })
  const { data: rarities } = useGetRaritiesQuery(undefined, {
    skip: !isOpen,
  })
  const { data: achievementsData, isLoading } = useGetAchievementsQuery(
    {
      query: debouncedSearchQuery || undefined,
      categoryId: selectedCategory || undefined,
      rarity: selectedRarity ? (selectedRarity as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY') : undefined,
      limit: 100,
    },
    {
      skip: !isOpen,
    }
  )

  const filteredAchievements = useMemo(() => {
    if (!achievementsData) return []
    return achievementsData.achievements.filter(
      (achievement) => {
        // Исключаем уже добавленные в приоритет
        if (currentPriority.includes(achievement.id)) return false

        // Показываем только "в работе" (есть прогресс, но нет completion_date) или недостигнутые (не unlocked)
        const isCompleted = achievement.completion_date !== undefined
        const isInProgress = achievement.unlocked && !isCompleted && (achievement.progress || 0) > 0
        const isNotStarted = !achievement.unlocked

        return !isCompleted && (isInProgress || isNotStarted)
      }
    )
  }, [achievementsData, currentPriority])

  const handleSelect = (achievementId: string) => {
    onSelect(achievementId)
    onClose()
  }

  if (typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Выберите достижение в приоритете</ModalTitle>
              <CloseButton onClick={onClose}>✕</CloseButton>
            </ModalHeader>

            <ModalContent>
              <SearchInput
                type="text"
                placeholder="Поиск достижений..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <FilterSelectWrapper>
                <ThemedSelect
                  options={[
                    { value: '', label: 'Все категории' },
                    ...(categories?.map((category) => ({
                      value: category.id,
                      label: category.name,
                    })) || []),
                  ]}
                  value={
                    selectedCategory
                      ? { value: selectedCategory, label: categories?.find((c) => c.id === selectedCategory)?.name || selectedCategory }
                      : { value: '', label: 'Все категории' }
                  }
                  onChange={(option) => setSelectedCategory(option?.value || '')}
                  placeholder="Все категории"
                />
              </FilterSelectWrapper>

              <FilterSelectWrapper>
                <ThemedSelect
                  options={[
                    { value: '', label: 'Все редкости' },
                    ...(rarities?.map((rarity) => ({
                      value: rarity.value,
                      label: rarity.label,
                    })) || []),
                  ]}
                  value={
                    selectedRarity
                      ? { value: selectedRarity, label: rarities?.find((r) => r.value === selectedRarity)?.label || selectedRarity }
                      : { value: '', label: 'Все редкости' }
                  }
                  onChange={(option) => setSelectedRarity(option?.value || '')}
                  placeholder="Все редкости"
                />
              </FilterSelectWrapper>

              {isLoading ? (
                <EmptyState>Загрузка...</EmptyState>
              ) : filteredAchievements.length === 0 ? (
                <EmptyState>
                  <HiOutlineSearch style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
                  <div>Достижения не найдены</div>
                </EmptyState>
              ) : (
                <AchievementsList>
                  {filteredAchievements.map((achievement) => (
                    <AchievementItem
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleSelect(achievement.id)}
                    >
                      <AchievementIcon rarity={achievement.rarity}>
                        {renderIcon(achievement.icon_url, 'trophy')}
                      </AchievementIcon>
                      <AchievementInfo>
                        <AchievementTitle>{achievement.title}</AchievementTitle>
                        <AchievementDescription>{achievement.description}</AchievementDescription>
                      </AchievementInfo>
                    </AchievementItem>
                  ))}
                </AchievementsList>
              )}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}
