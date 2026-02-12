'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoFolder, IoTrophy, IoCloseCircle, IoSearch } from 'react-icons/io5'
import { useAppSelector } from '@/store/hooks'
import {
  useGetCategoriesQuery,
  useGetCategoriesWithStatsQuery,
  useGetAchievementsQuery,
  type Achievement as ApiAchievement,
} from '@/store/api/achievementsApi'

import {
  Header as PageHeader,
  Title,
  Grid,
  ListContainer,
  ListItem,
  ListItemIcon,
  ListItemContent,
  ListItemName,
  ListItemStats,
  ProgressRing,
  StatItem,
  StatLabel,
  StatValue,
  PageHeaderWrap,
} from './page.styled'
import { CategoryCardComponent } from './CategoryCard'
import { Tumbler } from './Tumbler'
import { ViewModeSelector, type AchievementViewMode } from './ViewModeSelector'
import { SearchAndFilters } from './SearchAndFilters'
import { AchievementCard } from './AchievementCard'
import { AchievementGrid } from './AchievementGrid.styled'
import { type Achievement } from './api'
import { renderIcon } from '@/lib/utils/iconUtils'

import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'

// Преобразование достижения из API формата в формат компонента
const transformAchievement = (apiAchievement: ApiAchievement): Achievement => {
  return {
    id: apiAchievement.id,
    name: apiAchievement.title,
    description: apiAchievement.description,
    icon: apiAchievement.icon_url || '',
    categoryId: apiAchievement.category.id,
    categoryName: apiAchievement.category.name,
    unlocked: apiAchievement.unlocked,
    rarity: apiAchievement.rarity,
    completionDate: apiAchievement.unlocked_at || undefined,
    progress: apiAchievement.progress,
    completion_date: apiAchievement.completion_date,
  }
}

export default function CategoriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [mode, setMode] = useState<'categories' | 'achievements'>('categories')
  const [viewMode, setViewMode] = useState<AchievementViewMode>('grid3')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Запрос категорий
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery(undefined, {
    skip: mode === 'achievements' || isAuthenticated,
  })

  const {
    data: categoriesWithStatsData,
    isLoading: categoriesWithStatsLoading,
    error: categoriesWithStatsError,
  } = useGetCategoriesWithStatsQuery(undefined, {
    skip: mode === 'achievements' || !isAuthenticated,
  })

  // Преобразование категорий для компонента
  const categories = useMemo(() => {
    if (isAuthenticated && categoriesWithStatsData) {
      return categoriesWithStatsData.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon_url || '📁',
        total: cat.total,
        unlocked: cat.unlocked,
        achievements: cat.achievements_preview.map((ach) => ({
          id: ach.id,
          icon: ach.icon_url || '',
          unlocked: ach.unlocked,
          progress: ach.progress,
          completion_date: ach.completion_date,
        })),
      }))
    } else if (!isAuthenticated && categoriesData) {
      return categoriesData.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon_url || '📁',
        total: cat.achievements_count,
        unlocked: 0,
        achievements: [],
      }))
    }
    return []
  }, [categoriesData, categoriesWithStatsData, isAuthenticated])

  // Параметры для запроса достижений
  const achievementsParams = useMemo(() => {
    const params: {
      limit?: number
      query?: string
      categoryId?: string
      rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
      unlocked?: boolean
      sortBy?: 'default' | 'unlocked-asc' | 'unlocked-desc' | 'date-asc' | 'date-desc' | 'xp-asc' | 'xp-desc'
    } = {
      limit: 1000,
    }

    if (debouncedSearchQuery) {
      params.query = debouncedSearchQuery
    }

    if (selectedCategory) {
      params.categoryId = selectedCategory
    }

    if (rarityFilter) {
      params.rarity = rarityFilter.toUpperCase() as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
    }

    // Фильтр по статусу обрабатывается на фронтенде после получения данных
    // Для совместимости с API оставляем unlocked фильтр
    if (isAuthenticated && statusFilter === 'unlocked') {
      params.unlocked = true
    } else if (isAuthenticated && statusFilter === 'locked') {
      params.unlocked = false
    }

    if (sortBy !== 'default') {
      params.sortBy = sortBy as 'unlocked-asc' | 'unlocked-desc' | 'date-asc' | 'date-desc' | 'xp-asc' | 'xp-desc'
    }

    return params
  }, [debouncedSearchQuery, selectedCategory, rarityFilter, statusFilter, sortBy, isAuthenticated])

  // Запрос достижений
  const {
    data: achievementsData,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useGetAchievementsQuery(mode === 'achievements' ? achievementsParams : undefined, {
    skip: mode === 'categories',
  })

  // Преобразование и фильтрация достижений
  const achievements = useMemo(() => {
    if (!achievementsData) return []

    let filtered = achievementsData.achievements.map(transformAchievement)

    // Фильтрация по статусу на фронтенде
    if (isAuthenticated && statusFilter) {
      filtered = filtered.filter((achievement) => {
        const isCompleted = !!achievement.completion_date
        const isInProgress = achievement.unlocked && !isCompleted && (achievement.progress || 0) > 0
        const isUnlocked = achievement.unlocked && !isInProgress && !isCompleted
        const isLocked = !achievement.unlocked

        switch (statusFilter) {
          case 'completed':
            return isCompleted
          case 'in_progress':
            return isInProgress
          case 'unlocked':
            return isUnlocked
          case 'locked':
            return isLocked
          default:
            return true
        }
      })
    }

    return filtered
  }, [achievementsData, statusFilter, isAuthenticated])

  const isLoading = mode === 'categories'
    ? (isAuthenticated ? categoriesWithStatsLoading : categoriesLoading)
    : achievementsLoading

  const hasError = mode === 'categories'
    ? (isAuthenticated ? categoriesWithStatsError : categoriesError)
    : achievementsError

  return (
    <>
      <Container>
        <PageHeader>
          <PageHeaderWrap>
            <Title>
              {mode === 'categories' ? (
                <>
                  <IoFolder style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Категории достижений
                </>
              ) : (
                <>
                  <IoTrophy style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Все достижения
                </>
              )}
            </Title>
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              {mode === 'achievements' && (
                <ViewModeSelector mode={viewMode} onChange={setViewMode} />
              )}
              <Tumbler mode={mode} onChange={setMode} />
            </div>
          </PageHeaderWrap>
        </PageHeader>

        <AnimatePresence mode="wait">
          {mode === 'categories' ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <BlockLoader text="Загрузка категорий..." />
              ) : hasError ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <IoCloseCircle style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }} />
                  <div style={{ fontSize: '1.25rem' }}>Ошибка загрузки категорий</div>
                </div>
              ) : categories.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <IoFolder style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                  <div style={{ fontSize: '1.25rem' }}>Категории не найдены</div>
                </div>
              ) : (
                <Grid>
                  {categories.map((category) => (
                    <CategoryCardComponent
                      key={category.id}
                      category={category}
                      onClick={() => router.push(`/categories/${category.id}`)}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </Grid>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                rarityFilter={rarityFilter}
                onRarityFilterChange={setRarityFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isAuthenticated={isAuthenticated}
              />
              {isLoading ? (
                <BlockLoader text="Загрузка достижений..." />
              ) : hasError ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <IoCloseCircle style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }} />
                  <div style={{ fontSize: '1.25rem' }}>Ошибка загрузки достижений</div>
                </div>
              ) : achievements.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <IoSearch style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    Достижения не найдены
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    Попробуйте изменить параметры поиска или фильтры
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                <ListContainer>
                  {achievements.map((achievement) => {
                    const isCompleted = !!achievement.completion_date
                    const isInProgress = achievement.unlocked && !isCompleted && (achievement.progress || 0) > 0
                    const status: 'locked' | 'unlocked' | 'in_progress' | 'completed' = isCompleted
                      ? 'completed'
                      : isInProgress
                        ? 'in_progress'
                        : achievement.unlocked
                          ? 'unlocked'
                          : 'locked'

                    return (
                      <ListItem
                        key={achievement.id}
                        rarity={achievement.rarity}
                        $status={status}
                        onClick={() =>
                          router.push(`/categories/${achievement.categoryId}/${achievement.id}`)
                        }
                      >
                        <ListItemIcon $status={status}>{renderIcon(achievement.icon, 'trophy')}</ListItemIcon>
                        <ListItemContent>
                          <ListItemName>{achievement.name}</ListItemName>
                          <ListItemStats>
                            <StatItem>
                              <StatLabel>Категория:</StatLabel>
                              <StatValue>{achievement.categoryName}</StatValue>
                            </StatItem>
                            <StatItem>
                              <StatLabel>Статус:</StatLabel>
                              <StatValue $status={status}>
                                {isCompleted
                                  ? 'Завершено'
                                  : isInProgress
                                    ? `В работе ${achievement.progress}%`
                                    : achievement.unlocked
                                      ? 'Открыто'
                                      : 'Не открыто'}
                              </StatValue>
                            </StatItem>
                            <StatItem>
                              <StatLabel>Редкость:</StatLabel>
                              <StatValue
                                style={{
                                  color: achievement.rarity
                                    ? (() => {
                                      const rarityColors: Record<string, string> = {
                                        common: '#9ca3af',
                                        rare: '#3b82f6',
                                        epic: '#a855f7',
                                        legendary: '#ffd700',
                                      }
                                      return rarityColors[achievement.rarity] || '#9ca3af'
                                    })()
                                    : '#9ca3af',
                                  fontWeight: 600,
                                }}
                              >
                                {achievement.rarity === 'common'
                                  ? 'Обычное'
                                  : achievement.rarity === 'rare'
                                    ? 'Редкое'
                                    : achievement.rarity === 'epic'
                                      ? 'Эпическое'
                                      : achievement.rarity === 'legendary'
                                        ? 'Легендарное'
                                        : 'Обычное'}
                              </StatValue>
                            </StatItem>
                          </ListItemStats>
                        </ListItemContent>
                        <ProgressRing progress={isCompleted ? 100 : isInProgress ? (achievement.progress || 0) : 0} />
                      </ListItem>
                    )
                  })}
                </ListContainer>
              ) : (
                <AchievementGrid mode={viewMode}>
                  {achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onClick={() =>
                        router.push(`/categories/${achievement.categoryId}/${achievement.id}`)
                      }
                    />
                  ))}
                </AchievementGrid>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  )
}
