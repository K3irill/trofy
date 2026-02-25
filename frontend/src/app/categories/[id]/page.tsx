'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoSearchOutline, IoDocumentTextOutline, IoAdd } from 'react-icons/io5'
import { useAppSelector } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api/userApi'
import { CreateAchievementModal } from '@/components/CreateAchievementModal/CreateAchievementModal'
import {
  useGetCategoryByIdWithStatsQuery,
  useGetCategoryByIdQuery,
  useGetAchievementsByCategoryQuery,
  type Achievement as ApiAchievement,
} from '@/store/api/achievementsApi'
import { renderIcon } from '@/lib/utils/iconUtils'

import {
  Header as PageHeader,
  BackButton,
  CategoryInfo,
  CategoryIconLarge,
  CategoryDetails,
  CategoryName,
  CategoryStats,
  Stat,
  StatValue,
  StatLabelText,
  AchievementGrid,
  AchievementListContainer,
  AchievementListItem,
  AchievementListIcon,
  AchievementListContent,
  AchievementListName,
  AchievementListStatus,
  PageHeaderWrap,
} from './page.styled'
import { AchievementCard } from './AchievementCard'
import { ViewModeSelector, AchievementViewMode } from './ViewModeSelector'
import { SearchAndFilters } from '@/app/categories/SearchAndFilters'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [viewMode, setViewMode] = useState<AchievementViewMode>(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width <= 767) return 'grid3' // Мобилка: 2 колонки
      if (width <= 1024) return 'grid3' // Планшет: 3 колонки
      return 'grid6' // Десктоп: 6 колонок
    }
    return 'grid6'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [isCreateAchievementModalOpen, setIsCreateAchievementModalOpen] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: currentUser } = useGetMeQuery(undefined, { skip: !isAuthenticated })

  const categoryId = params?.id as string

  // Автоматическое переключение режима при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width <= 767) {
        // Мобилка: grid3, grid2, list
        if (viewMode === 'grid6') {
          setViewMode('grid3')
        }
      } else if (width <= 1024) {
        // Планшет: grid3, grid2, list
        if (viewMode === 'grid6') {
          setViewMode('grid3')
        }
      } else {
        // Десктоп: grid6, grid3, list
        if (viewMode === 'grid2') {
          setViewMode('grid3')
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode])

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Получаем категорию со статистикой для авторизованных, без статистики для неавторизованных
  const { data: categoryWithStats, isLoading: isLoadingCategoryWithStats } = useGetCategoryByIdWithStatsQuery(
    categoryId,
    { skip: !categoryId || !isAuthenticated }
  )
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId || isAuthenticated, // Пропускаем если авторизован (используем with-stats)
  })

  // Получаем достижения в категории
  const { 
    data: achievementsData, 
    isLoading: isLoadingAchievements,
    error: achievementsError,
    isFetching: isFetchingAchievements,
  } = useGetAchievementsByCategoryQuery(
    {
      categoryId,
      params: {
        limit: 100,
      },
    },
    { skip: !categoryId }
  )

  const activeCategory = categoryWithStats || category
  const isLoading = isLoadingCategoryWithStats || isLoadingCategory
  const hasCategoryData = !!activeCategory
  const achievements = achievementsData?.achievements || []

  // Проверяем, является ли текущий пользователь создателем категории
  const isCategoryOwner = useMemo(() => {
    if (!activeCategory || !currentUser) return false
    return activeCategory.is_custom && activeCategory.creator_id === currentUser.id
  }, [activeCategory, currentUser])

  // Фильтрация и сортировка достижений (должен быть до условных return)
  const filteredAndSortedAchievements = useMemo(() => {
    let filtered = [...achievements]

    // Фильтрация по поисковому запросу
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (achievement) =>
          achievement.title.toLowerCase().includes(query) ||
          achievement.description.toLowerCase().includes(query)
      )
    }

    // Фильтрация по статусу
    if (statusFilter && isAuthenticated) {
      filtered = filtered.filter((achievement) => {
        const isCompleted = !!achievement.completion_date
        const progress = achievement.progress || 0
        const isInProgress = !isCompleted && progress > 0 && progress <= 100
        const isNotAchieved = !isCompleted && progress === 0

        switch (statusFilter) {
          case 'achieved':
            return isCompleted
          case 'in_progress':
            return isInProgress
          case 'not_achieved':
            return isNotAchieved
          default:
            return true
        }
      })
    }

    // Фильтрация по редкости
    if (rarityFilter) {
      filtered = filtered.filter((achievement) => achievement.rarity === rarityFilter)
    }

    // Сортировка
    if (sortBy && sortBy !== 'default') {
      filtered.sort((a, b) => {
        const aIsCompleted = !!a.completion_date
        const aProgress = a.progress || 0
        const aIsInProgress = !aIsCompleted && aProgress > 0 && aProgress <= 100
        const aIsNotAchieved = !aIsCompleted && aProgress === 0

        const bIsCompleted = !!b.completion_date
        const bProgress = b.progress || 0
        const bIsInProgress = !bIsCompleted && bProgress > 0 && bProgress <= 100
        const bIsNotAchieved = !bIsCompleted && bProgress === 0

        switch (sortBy) {
          case 'achieved-first':
            if (aIsCompleted && !bIsCompleted) return -1
            if (!aIsCompleted && bIsCompleted) return 1
            return 0
          case 'not-achieved-first':
            if (aIsNotAchieved && !bIsNotAchieved) return -1
            if (!aIsNotAchieved && bIsNotAchieved) return 1
            return 0
          case 'in-progress-first':
            if (aIsInProgress && !bIsInProgress) return -1
            if (!aIsInProgress && bIsInProgress) return 1
            return 0
          case 'date-asc':
            if (!a.completion_date || !b.completion_date) return 0
            return new Date(a.completion_date).getTime() - new Date(b.completion_date).getTime()
          case 'date-desc':
            if (!a.completion_date || !b.completion_date) return 0
            return new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime()
          default:
            return 0
        }
      })
    }

    return filtered
  }, [achievements, debouncedSearchQuery, statusFilter, rarityFilter, sortBy, isAuthenticated])

  // Показываем лоадер только если действительно загружаем и данных еще нет
  if (isLoading && !hasCategoryData) {
    return (
      <Container>
        <BlockLoader text="Загрузка категории..." />
      </Container>
    )
  }

  if (!activeCategory) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <IoSearchOutline style={{ fontSize: '4rem', color: 'var(--text-secondary, #666)', marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.125rem' }}>Категория не найдена</div>
        </div>
      </Container>
    )
  }

  const unlockedCount = categoryWithStats?.unlocked || 0
  const totalCount = categoryWithStats?.total || ('achievements_count' in activeCategory ? activeCategory.achievements_count : 0) || 0
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const renderAchievements = (achievementsList: ApiAchievement[]) => {
    // Показываем лоадер только если действительно загружаем и данных еще нет
    if ((isLoadingAchievements || isFetchingAchievements) && !achievementsData) {
      return (
        <div style={{ padding: '2rem' }}>
          <BlockLoader text="Загрузка достижений..." />
        </div>
      )
    }

    if (achievementsError) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          <div>Ошибка загрузки достижений</div>
        </div>
      )
    }

    if (achievementsList.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <IoDocumentTextOutline style={{ fontSize: '3rem', color: 'var(--text-secondary, #666)', marginBottom: '1rem' }} />
          <div>Достижения не найдены</div>
        </div>
      )
    }

    if (viewMode === 'list') {
      return (
        <AchievementListContainer>
          {achievementsList.map((achievement) => {
            const isCompleted = !!achievement.completion_date
            const progress = achievement.progress || 0
            const isInProgress = !isCompleted && progress > 0 && progress <= 100
            const status = isCompleted ? 'achieved' : isInProgress ? 'in_progress' : 'not_achieved'

            return (
              <AchievementListItem
                key={achievement.id}
                $status={status}
                onClick={() => router.push(`/categories/${activeCategory.id}/${achievement.id}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementListIcon $status={status}>
                  {renderIcon(achievement.icon_url, 'trophy')}
                </AchievementListIcon>
                <AchievementListContent>
                  <AchievementListName>{achievement.title}</AchievementListName>
                  <AchievementListStatus $status={status}>
                    {isCompleted ? 'Достигнуто' : isInProgress ? `В работе ${achievement.progress}%` : 'Не достигнуто'}
                  </AchievementListStatus>
                </AchievementListContent>
              </AchievementListItem>
            )
          })}
        </AchievementListContainer>
      )
    }

    return (
      <AchievementGrid mode={viewMode}>
        {achievementsList.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={{
              id: achievement.id,
              icon: achievement.icon_url || '🏆',
              unlocked: achievement.unlocked,
              name: achievement.title,
              description: achievement.description,
              progress: achievement.progress,
              completion_date: achievement.completion_date,
            }}
            onClick={() => router.push(`/categories/${activeCategory.id}/${achievement.id}`)}
          />
        ))}
      </AchievementGrid>
    )
  }

  return (
    <>
      <Container>
        <PageHeader>
            <PageHeaderWrap>
            <BackButton onClick={() => router.back()} initial={{ x: -20 }} animate={{ x: 0 }}>
              ← Назад
            </BackButton>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {isAuthenticated && isCategoryOwner && (
                <motion.button
                  onClick={() => setIsCreateAchievementModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '12px',
                    color: '#00d4ff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <IoAdd size={18} />
                  Создать достижение
                </motion.button>
              )}
              <ViewModeSelector mode={viewMode} onChange={setViewMode} />
            </div>
          </PageHeaderWrap>
        </PageHeader>

        <CategoryInfo>
          <CategoryIconLarge>
            {renderIcon(activeCategory.icon_url, 'folder')}
          </CategoryIconLarge>
          <CategoryDetails>
            <CategoryName>{activeCategory.name}</CategoryName>
            <CategoryStats>
              {isAuthenticated && categoryWithStats ? (
                <>
                  <Stat>
                    <StatValue>{unlockedCount}</StatValue>
                    <StatLabelText>Разблокировано</StatLabelText>
                  </Stat>
                  <Stat>
                    <StatValue>{totalCount}</StatValue>
                    <StatLabelText>Всего</StatLabelText>
                  </Stat>
                  <Stat>
                    <StatValue>{progress}%</StatValue>
                    <StatLabelText>Прогресс</StatLabelText>
                  </Stat>
                </>
              ) : (
                <Stat>
                  <StatValue>{totalCount}</StatValue>
                  <StatLabelText>Всего достижений</StatLabelText>
                </Stat>
              )}
            </CategoryStats>
          </CategoryDetails>
        </CategoryInfo>

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory=""
          onCategoryChange={() => {}}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          rarityFilter={rarityFilter}
          onRarityFilterChange={setRarityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isAuthenticated={isAuthenticated}
          hideCategoryFilter={true}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAchievements(filteredAndSortedAchievements)}
          </motion.div>
        </AnimatePresence>
      </Container>

      <CreateAchievementModal
        isOpen={isCreateAchievementModalOpen}
        onClose={() => setIsCreateAchievementModalOpen(false)}
        onSuccess={() => {
          // Достижения обновятся автоматически через RTK Query
        }}
        defaultCategoryId={categoryId}
      />
    </>
  )
}
