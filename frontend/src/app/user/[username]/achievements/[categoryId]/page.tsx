'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoSearchOutline, IoDocumentTextOutline } from 'react-icons/io5'
import { useAppSelector } from '@/store/hooks'
import {
  useGetCategoryByIdQuery,
} from '@/store/api/achievementsApi'
import { useGetUserAchievementsByUsernameQuery } from '@/store/api/userApi'
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
} from '@/app/categories/[id]/page.styled'
import { AchievementCard } from '@/app/categories/AchievementCard'
import { ViewModeSelector, AchievementViewMode } from '@/app/categories/ViewModeSelector'
import { SearchAndFilters } from '@/app/categories/SearchAndFilters'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { type Achievement } from '@/app/categories/api'

export default function UserCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [viewMode, setViewMode] = useState<AchievementViewMode>('grid3')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const { isAuthenticated, user: currentUser } = useAppSelector((state) => state.auth)

  const username = params?.username as string
  const categoryId = params?.categoryId as string

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Получаем категорию
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId,
  })

  // Получаем все достижения пользователя
  const { 
    data: allUserAchievements, 
    isLoading: isLoadingAchievements,
    error: achievementsError,
  } = useGetUserAchievementsByUsernameQuery(
    { username },
    { skip: !username }
  )

  // Фильтруем достижения по категории
  const achievements = useMemo(() => {
    if (!allUserAchievements || !categoryId) return []
    return allUserAchievements.filter(achievement => achievement.category.id === categoryId)
  }, [allUserAchievements, categoryId])

  // Преобразуем в формат Achievement и применяем фильтры
  const transformedAchievements: Achievement[] = useMemo(() => {
    let filtered = achievements.map((achievement) => {
      const isAchieved = !!achievement.completion_date
      const progress = achievement.progress ?? (isAchieved ? 100 : undefined)
      
      return {
        id: achievement.id,
        name: achievement.title,
        description: achievement.description,
        icon: achievement.icon_url || '',
        categoryId: achievement.category.id,
        categoryName: achievement.category.name,
        unlocked: achievement.is_achieved,
        rarity: achievement.rarity,
        completionDate: achievement.completion_date || undefined,
        progress: progress,
        completion_date: achievement.completion_date || undefined,
      }
    })

    // Фильтрация по поисковому запросу
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (achievement) =>
          achievement.name.toLowerCase().includes(query) ||
          achievement.description.toLowerCase().includes(query)
      )
    }

    // Фильтрация по редкости
    if (rarityFilter) {
      filtered = filtered.filter((achievement) => achievement.rarity === rarityFilter)
    }

    // Фильтрация по статусу (только для авторизованных)
    if (isAuthenticated && statusFilter) {
      filtered = filtered.filter((achievement) => {
        const isAchieved = !!achievement.completion_date
        const progress = achievement.progress ?? undefined
        const isInProgress = !isAchieved && progress !== undefined && progress > 0 && progress < 100
        const isNotAchieved = !isAchieved && (progress === undefined || progress === 0)

        switch (statusFilter) {
          case 'achieved':
            return isAchieved
          case 'in_progress':
            return isInProgress
          case 'not_achieved':
            return isNotAchieved
          default:
            return true
        }
      })
    }

    // Сортировка
    if (sortBy && sortBy !== 'default') {
      filtered.sort((a, b) => {
        const aIsAchieved = !!a.completion_date
        const aProgress = a.progress ?? undefined
        const aIsInProgress = !aIsAchieved && aProgress !== undefined && aProgress > 0 && aProgress < 100
        const aIsNotAchieved = !aIsAchieved && (aProgress === undefined || aProgress === 0)

        const bIsAchieved = !!b.completion_date
        const bProgress = b.progress ?? undefined
        const bIsInProgress = !bIsAchieved && bProgress !== undefined && bProgress > 0 && bProgress < 100
        const bIsNotAchieved = !bIsAchieved && (bProgress === undefined || bProgress === 0)

        switch (sortBy) {
          case 'achieved-first':
            if (aIsAchieved && !bIsAchieved) return -1
            if (!aIsAchieved && bIsAchieved) return 1
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
  }, [achievements, debouncedSearchQuery, rarityFilter, statusFilter, sortBy, isAuthenticated])

  const isLoading = isLoadingCategory || isLoadingAchievements
  const hasCategoryData = !!category

  // Показываем лоадер только если действительно загружаем и данных еще нет
  if (isLoading && !hasCategoryData) {
    return (
      <Container>
        <BlockLoader text="Загрузка категории..." />
      </Container>
    )
  }

  if (!category) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <IoSearchOutline style={{ fontSize: '4rem', color: 'var(--text-secondary, #666)', marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.125rem' }}>Категория не найдена</div>
        </div>
      </Container>
    )
  }

  const unlockedCount = achievements.filter(a => a.is_achieved).length
  const totalCount = achievements.length
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const renderAchievements = (achievementsList: Achievement[]) => {
    // Показываем лоадер только если действительно загружаем и данных еще нет
    if (isLoadingAchievements && !allUserAchievements) {
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
            const progress = achievement.progress ?? undefined
            const isInProgress = !isCompleted && progress !== undefined && progress > 0 && progress < 100
            const status = isCompleted ? 'achieved' : isInProgress ? 'in_progress' : 'not_achieved'

            return (
              <AchievementListItem
                key={achievement.id}
                $status={status}
                onClick={() => router.push(`/user/${username}/achievements/${category.id}/${achievement.id}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementListIcon $status={status}>
                  {renderIcon(achievement.icon, 'trophy')}
                </AchievementListIcon>
                <AchievementListContent>
                  <AchievementListName>{achievement.name}</AchievementListName>
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
            achievement={achievement}
            onClick={() => router.push(`/user/${username}/achievements/${category.id}/${achievement.id}`)}
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
            <BackButton onClick={() => router.push(`/user/${username}/achievements`)} initial={{ x: -20 }} animate={{ x: 0 }}>
              ← Назад
            </BackButton>
            <ViewModeSelector mode={viewMode} onChange={setViewMode} />
          </PageHeaderWrap>
        </PageHeader>

        <CategoryInfo>
          <CategoryIconLarge>
            {renderIcon(category.icon_url, 'folder')}
          </CategoryIconLarge>
          <CategoryDetails>
            <CategoryName>{category.name}</CategoryName>
            <CategoryStats>
              {isAuthenticated && (
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
            {renderAchievements(transformedAchievements)}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  )
}
