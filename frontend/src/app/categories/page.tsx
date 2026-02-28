'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoFolder, IoTrophy, IoCloseCircle, IoSearch, IoAdd, IoPersonRemove, IoClose, IoEye } from 'react-icons/io5'
import { useAppSelector } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api/userApi'
import { CreateCategoryModal } from '@/components/CreateCategoryModal/CreateCategoryModal'
import { CreateAchievementModal } from '@/components/CreateAchievementModal/CreateAchievementModal'
import {
  useGetCategoriesQuery,
  useGetCategoriesWithStatsQuery,
  useGetAchievementsQuery,
  type Achievement as ApiAchievementType,
} from '@/store/api/achievementsApi'

import {
  Header as PageHeader,
  Title,
  TitleIcon,
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
  PageHeaderTop,
  PageHeaderControls,
  ControlsWrap,
  UserFilterContainer,
  UserFilterTitle,
  ExcludedUsersList,
  ExcludedUserTag,
  RemoveUserButton,
  AddUserFilterInput,
  FilterModeSelector,
  FilterModeButton,
} from './page.styled'
import { CategoryCardComponent } from './CategoryCard'
import { Tumbler } from './Tumbler'
import { FilterTumbler } from './FilterTumbler'
import { ViewModeSelector, type AchievementViewMode } from './ViewModeSelector'
import { SearchAndFilters } from './SearchAndFilters'
import { CategorySearchAndFilters } from './CategorySearchAndFilters'
import { AchievementCard } from './AchievementCard'
import { AchievementGrid } from './AchievementGrid.styled'
import { type Achievement } from './api'
import { renderIcon } from '@/lib/utils/iconUtils'

import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'

// Преобразование достижения из API формата в формат компонента
const transformAchievement = (apiAchievement: ApiAchievementType): Achievement => {
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
    is_custom: apiAchievement.is_custom,
    creator_id: apiAchievement.creator_id,
    creator_username: apiAchievement.creator_username,
    is_public: apiAchievement.is_public,
  }
}

export default function CategoriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: currentUser } = useGetMeQuery(undefined, { skip: !isAuthenticated })
  const [mode, setMode] = useState<'categories' | 'achievements'>('categories')
  const [filterMode, setFilterMode] = useState<'all' | 'my' | 'global' | 'custom'>('all')
  const [viewMode, setViewMode] = useState<AchievementViewMode>('grid3')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [privacyFilter, setPrivacyFilter] = useState('')
  const [favoriteOnly, setFavoriteOnly] = useState(false)
  const [excludedUsernames, setExcludedUsernames] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('excludedUsernames')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })
  const [includedOnlyUsernames, setIncludedOnlyUsernames] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('includedOnlyUsernames')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })
  const [newFilterUsername, setNewFilterUsername] = useState('')
  const [userFilterMode, setUserFilterMode] = useState<'exclude' | 'includeOnly'>('exclude')
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [isCreateAchievementModalOpen, setIsCreateAchievementModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; icon_url: string | null; is_custom: boolean; creator_id?: string; is_public?: boolean; allowed_user_ids?: string[] } | null>(null)
  const [editingAchievement, setEditingAchievement] = useState<Partial<ApiAchievementType> | null>(null)

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Сохранение фильтров в localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('excludedUsernames', JSON.stringify(excludedUsernames))
      localStorage.setItem('includedOnlyUsernames', JSON.stringify(includedOnlyUsernames))
    }
  }, [excludedUsernames, includedOnlyUsernames])

  // Запрос категорий
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery(
    mode === 'achievements' || isAuthenticated
      ? undefined
      : {
          favoriteOnly: favoriteOnly,
        },
    {
      skip: mode === 'achievements' || isAuthenticated,
    }
  )

  const {
    data: categoriesWithStatsData,
    isLoading: categoriesWithStatsLoading,
    error: categoriesWithStatsError,
    refetch: refetchCategoriesWithStats,
  } = useGetCategoriesWithStatsQuery(
    mode === 'achievements' || !isAuthenticated
      ? undefined
      : {
          favoriteOnly: favoriteOnly,
        },
    {
      skip: mode === 'achievements' || !isAuthenticated,
    }
  )

  // Преобразуем usernames в IDs для фильтрации достижений (используем creator_username из категорий)
  const excludeUserIds = useMemo(() => {
    if (excludedUsernames.length === 0) return []
    const allCategories = categoriesData || categoriesWithStatsData || []
    const userIds: string[] = []
    allCategories.forEach((cat) => {
      if (cat.creator_username && excludedUsernames.includes(cat.creator_username.toLowerCase()) && cat.creator_id) {
        if (!userIds.includes(cat.creator_id)) {
          userIds.push(cat.creator_id)
        }
      }
    })
    return userIds
  }, [excludedUsernames, categoriesData, categoriesWithStatsData])

  // Преобразование категорий для компонента
  const categories = useMemo(() => {
    if (mode !== 'categories') return []

    interface CategoryItem {
      id: string
      name: string
      icon: string
      total: number
      unlocked: number
      is_custom: boolean
      creator_id?: string
      creator_username?: string
      is_public?: boolean
      is_liked?: boolean
      is_favorite?: boolean
      achievements: Array<{
        id: string
        icon: string
        unlocked: boolean
        progress?: number
        completion_date?: string
      }>
    }

    let allCategories: CategoryItem[] = []

    if (isAuthenticated) {
      if (categoriesWithStatsData) {
        allCategories = categoriesWithStatsData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon_url || '📁',
          total: cat.total,
          unlocked: cat.unlocked,
          is_custom: cat.is_custom,
          creator_id: cat.creator_id,
          creator_username: cat.creator_username,
          is_public: cat.is_public,
          is_liked: Boolean(cat.is_liked),
          is_favorite: Boolean(cat.is_favorite),
          achievements: cat.achievements_preview.map((ach) => ({
            id: ach.id,
            icon: ach.icon_url || '',
            unlocked: ach.unlocked,
            progress: ach.progress,
            completion_date: ach.completion_date,
          })),
        }))
      }
    } else {
      // Для неавторизованных пользователей
      if (categoriesData && Array.isArray(categoriesData)) {
        allCategories = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon_url || '📁',
          total: cat.achievements_count,
          unlocked: 0,
          is_custom: cat.is_custom,
          creator_id: cat.creator_id,
          creator_username: cat.creator_username,
          is_public: cat.is_public,
          is_liked: Boolean(cat.is_liked),
          is_favorite: Boolean(cat.is_favorite),
          achievements: [],
        }))
      }
    }

    // Фильтрация по filterMode
    let filtered = allCategories
    if (filterMode === 'my' && currentUser) {
      // Только мои пользовательские категории
      filtered = filtered.filter((cat) => {
        const isMyCategory = cat.is_custom && cat.creator_id === currentUser.id
        return isMyCategory
      })
    } else if (filterMode === 'global') {
      // Только глобальные категории
      filtered = filtered.filter((cat) => !cat.is_custom)
    } else if (filterMode === 'custom') {
      // Все пользовательские категории (не приватные - фильтрация уже на бэкенде)
      filtered = filtered.filter((cat) => cat.is_custom)
    }

    // Фильтрация по пользователям
    if (includedOnlyUsernames.length > 0) {
      // Показать только категории указанных пользователей
      filtered = filtered.filter((cat) => {
        if (!cat.creator_username) return false
        return includedOnlyUsernames.includes(cat.creator_username.toLowerCase())
      })
    } else if (excludedUsernames.length > 0) {
      // Скрыть категории указанных пользователей
      filtered = filtered.filter((cat) => {
        if (!cat.creator_username) return true
        return !excludedUsernames.includes(cat.creator_username.toLowerCase())
      })
    }

    // Фильтрация по поисковому запросу
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter((cat) =>
        cat.name.toLowerCase().includes(query)
      )
    }

    // Фильтрация по приватности
    if (privacyFilter === 'public') {
      filtered = filtered.filter((cat) => cat.is_public !== false)
    } else if (privacyFilter === 'private') {
      filtered = filtered.filter((cat) => cat.is_public === false)
    }

    // Сортировка категорий
    const sorted = [...filtered]
    if (sortBy === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru'))
    } else if (sortBy === 'total-asc') {
      sorted.sort((a, b) => a.total - b.total)
    } else if (sortBy === 'total-desc') {
      sorted.sort((a, b) => b.total - a.total)
    } else if (sortBy === 'progress-asc') {
      sorted.sort((a, b) => {
        const progressA = a.total > 0 ? (a.unlocked / a.total) * 100 : 0
        const progressB = b.total > 0 ? (b.unlocked / b.total) * 100 : 0
        return progressA - progressB
      })
    } else if (sortBy === 'progress-desc') {
      sorted.sort((a, b) => {
        const progressA = a.total > 0 ? (a.unlocked / a.total) * 100 : 0
        const progressB = b.total > 0 ? (b.unlocked / b.total) * 100 : 0
        return progressB - progressA
      })
    }

    return sorted
  }, [categoriesData, categoriesWithStatsData, isAuthenticated, mode, filterMode, currentUser, debouncedSearchQuery, sortBy, privacyFilter, excludedUsernames, includedOnlyUsernames])

  // Параметры для запроса достижений
  const achievementsParams = useMemo(() => {
    const params: {
      limit?: number
      query?: string
      categoryId?: string
      rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
      unlocked?: boolean
      sortBy?: 'unlocked-asc' | 'unlocked-desc' | 'date-asc' | 'date-desc' | 'xp-asc' | 'xp-desc'
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
    // API фильтр не используется, так как статусы определяются на фронтенде

    // Старые типы сортировки отправляем на API, новые обрабатываем на фронтенде
    if (sortBy !== 'default' && ['unlocked-asc', 'unlocked-desc', 'date-asc', 'date-desc', 'xp-asc', 'xp-desc'].includes(sortBy)) {
      params.sortBy = sortBy as 'unlocked-asc' | 'unlocked-desc' | 'date-asc' | 'date-desc' | 'xp-asc' | 'xp-desc'
    }

    return params
  }, [debouncedSearchQuery, selectedCategory, rarityFilter, sortBy])

  // Запрос достижений
  const {
    data: achievementsData,
    isLoading: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useGetAchievementsQuery(mode === 'achievements' ? achievementsParams : undefined, {
    skip: mode === 'categories',
  })

  // Преобразование и фильтрация достижений
  const achievements = useMemo(() => {
    if (!achievementsData) return []

    let filtered = achievementsData.achievements.map(transformAchievement)

    // Фильтрация по filterMode (пользовательские/глобальные)
    if (filterMode === 'my' && currentUser) {
      // Только мои пользовательские достижения
      filtered = filtered.filter((achievement) => {
        const apiAchievement: ApiAchievementType | undefined = achievementsData.achievements.find((a) => a.id === achievement.id)
        return apiAchievement?.is_custom && apiAchievement?.creator_id === currentUser.id
      })
    } else if (filterMode === 'global') {
      // Только глобальные достижения
      filtered = filtered.filter((achievement) => {
        const apiAchievement: ApiAchievementType | undefined = achievementsData.achievements.find((a) => a.id === achievement.id)
        return !apiAchievement?.is_custom
      })
    } else if (filterMode === 'custom') {
      // Все пользовательские достижения (не приватные - фильтрация уже на бэкенде)
      filtered = filtered.filter((achievement) => {
        const apiAchievement: ApiAchievementType | undefined = achievementsData.achievements.find((a) => a.id === achievement.id)
        return apiAchievement?.is_custom
      })
    }

    // Фильтрация по исключенным пользователям (по creator_id)
    if (excludeUserIds.length > 0) {
      filtered = filtered.filter((achievement) => {
        const apiAchievement: ApiAchievementType | undefined = achievementsData.achievements.find((a) => a.id === achievement.id)
        if (!apiAchievement?.creator_id) return true
        return !excludeUserIds.includes(apiAchievement.creator_id)
      })
    }

    // Фильтрация по статусу на фронтенде (только для авторизованных)
    if (isAuthenticated && statusFilter) {
      filtered = filtered.filter((achievement) => {
        const isAchieved = !!achievement.completion_date
        const progress = achievement.progress ?? undefined
        const isInProgress = !isAchieved && progress !== undefined && progress > 0 && progress <= 100
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

    // Сортировка на фронтенде
    if (sortBy && sortBy !== 'default') {
      filtered.sort((a, b) => {
        const aIsAchieved = !!a.completion_date
        const aProgress = a.progress ?? undefined
        const aIsInProgress = !aIsAchieved && aProgress !== undefined && aProgress > 0 && aProgress <= 100
        const aIsNotAchieved = !aIsAchieved && (aProgress === undefined || aProgress === 0)

        const bIsAchieved = !!b.completion_date
        const bProgress = b.progress ?? undefined
        const bIsInProgress = !bIsAchieved && bProgress !== undefined && bProgress > 0 && bProgress <= 100
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
  }, [achievementsData, statusFilter, sortBy, isAuthenticated, filterMode, currentUser])

  const hasError = mode === 'categories'
    ? (isAuthenticated ? categoriesWithStatsError : categoriesError)
    : achievementsError

  // Показываем лоадер только если действительно загружаем и данных еще нет
  // Если categories уже заполнен, не показываем лоадер даже если isLoading === true
  const showLoader = mode === 'categories'
    ? ((isAuthenticated ? categoriesWithStatsLoading : categoriesLoading) &&
      categories.length === 0)
    : (achievementsLoading && achievements.length === 0 && !achievementsData)


useEffect(()=>{

  console.log({categories: categories[categories.length - 1]})
  console.log({categoriesWithStatsData})
}, [categoriesWithStatsData, categories])
  return (
    <>
      <Container>
        <PageHeader>
          <PageHeaderWrap>
            <PageHeaderTop>
              <Title>
                {mode === 'categories' ? (
                  <>
                    <TitleIcon as={IoFolder} />
                     {
                      filterMode === 'all' ? 'Все категории достижений' :
                      filterMode === 'global' ? 'Глобальные категории достижений' :
                      filterMode === 'custom' ? 'Пользовательские категории достижений' :
                      filterMode === 'my' ? 'Мои категории достижений' :
                      'Все категории достижений'
                    }
                  </>
                ) : (
                  <>
                    <TitleIcon as={IoTrophy} />
                    {
                      filterMode === 'all' ? 'Все достижения' :
                      filterMode === 'global' ? 'Глобальные достижения' :
                      filterMode === 'custom' ? 'Пользовательские достижения' :
                      filterMode === 'my' ? 'Мои достижения' :
                      'Все достижения'
                    }
                  </>
                )}
              </Title>
              {isAuthenticated && (
                <>
                  {mode === 'categories' ? (
                    <motion.button
                      onClick={() => setIsCreateCategoryModalOpen(true)}
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
                      Создать категорию
                    </motion.button>
                  ) : (
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
                </>
              )}
            </PageHeaderTop>
            <PageHeaderControls>
            
                <FilterTumbler isAuth={isAuthenticated} mode={filterMode} onChange={setFilterMode} />
             
              <ControlsWrap>

                <Tumbler mode={mode} onChange={setMode} />
                {mode === 'achievements' && (
                  <ViewModeSelector mode={viewMode} onChange={setViewMode} />
                )}
              </ControlsWrap>
            </PageHeaderControls>
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
              <CategorySearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                privacyFilter={privacyFilter}
                onPrivacyFilterChange={setPrivacyFilter}
                favoriteOnly={favoriteOnly}
                onFavoriteOnlyChange={setFavoriteOnly}
                isAuthenticated={isAuthenticated}
              />
              {/* {isAuthenticated && (
                <UserFilterContainer>
                  <UserFilterTitle>
                    <IoPersonRemove />
                    <span>Фильтр категорий по пользователям</span>
                  </UserFilterTitle>
                  <FilterModeSelector>
                    <FilterModeButton
                      $active={userFilterMode === 'exclude'}
                      onClick={() => setUserFilterMode('exclude')}
                    >
                      <IoPersonRemove />
                      <span>Скрыть</span>
                    </FilterModeButton>
                    <FilterModeButton
                      $active={userFilterMode === 'includeOnly'}
                      onClick={() => setUserFilterMode('includeOnly')}
                    >
                      <IoEye />
                      <span>Показать только</span>
                    </FilterModeButton>
                  </FilterModeSelector>
                  {userFilterMode === 'exclude' && excludedUsernames.length > 0 && (
                    <ExcludedUsersList>
                      {excludedUsernames.map((username) => (
                        <ExcludedUserTag key={username}>
                          <span>{username}</span>
                          <RemoveUserButton
                            onClick={() => {
                              setExcludedUsernames((prev) => prev.filter((u) => u !== username))
                            }}
                            title="Убрать из списка"
                          >
                            <IoClose />
                          </RemoveUserButton>
                        </ExcludedUserTag>
                      ))}
                    </ExcludedUsersList>
                  )}
                  {userFilterMode === 'includeOnly' && includedOnlyUsernames.length > 0 && (
                    <ExcludedUsersList>
                      {includedOnlyUsernames.map((username) => (
                        <ExcludedUserTag key={username}>
                          <span>{username}</span>
                          <RemoveUserButton
                            onClick={() => {
                              setIncludedOnlyUsernames((prev) => prev.filter((u) => u !== username))
                            }}
                            title="Убрать из списка"
                          >
                            <IoClose />
                          </RemoveUserButton>
                        </ExcludedUserTag>
                      ))}
                    </ExcludedUsersList>
                  )}
                  <AddUserFilterInput
                    type="text"
                    placeholder={userFilterMode === 'exclude' ? 'Введите username для скрытия...' : 'Введите username для показа...'}
                    value={newFilterUsername}
                    onChange={(e) => setNewFilterUsername(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newFilterUsername.trim()) {
                        const username = newFilterUsername.trim().toLowerCase()
                        if (userFilterMode === 'exclude') {
                          if (!excludedUsernames.includes(username)) {
                            setExcludedUsernames((prev) => [...prev, username])
                            setNewFilterUsername('')
                          }
                        } else {
                          if (!includedOnlyUsernames.includes(username)) {
                            setIncludedOnlyUsernames((prev) => [...prev, username])
                            setNewFilterUsername('')
                          }
                        }
                      }
                    }}
                  />
                </UserFilterContainer>
              )} */}
              {showLoader ? (
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
                      currentUserId={currentUser?.id}
                      isLiked={category.is_liked}
                      isFavorite={category.is_favorite}
                      onEdit={(cat) => {
                        // Преобразуем CategoryItem в формат Category для модалки
                        // Минимальные данные, полные данные загрузятся через useGetCategoryByIdQuery
                        const categoryForEdit = {
                          id: cat.id,
                          name: cat.name,
                          icon_url: cat.icon || null,
                          is_custom: cat.is_custom || false,
                          creator_id: cat.creator_id,
          creator_username: cat.creator_username,
                          achievements_count: cat.total,
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                        }
                        setEditingCategory(categoryForEdit)
                      }}
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
              {showLoader ? (
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
                    // Для неавторизованных пользователей progress будет undefined
                    const isAchieved = !!achievement.completion_date
                    const progress = achievement.progress ?? undefined
                    const isInProgress = !isAchieved && progress !== undefined && progress > 0 && progress <= 100
                    const status: 'not_achieved' | 'in_progress' | 'achieved' = isAchieved
                      ? 'achieved'
                      : isInProgress
                        ? 'in_progress'
                        : 'not_achieved'

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
                                {isAchieved
                                  ? 'Достигнуто'
                                  : isInProgress && progress !== undefined
                                    ? `В работе ${progress}%`
                                    : 'Не достигнуто'}
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
                        <ProgressRing progress={isAchieved ? 100 : isInProgress && progress !== undefined ? progress : 0} />
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
                      currentUserId={currentUser?.id}
                      onEdit={(ach) => {
                        // Преобразуем Achievement из ./api в формат для модалки
                        const rarityMap: Record<string, 'common' | 'rare' | 'epic' | 'legendary'> = {
                          'common': 'common',
                          'rare': 'rare',
                          'epic': 'epic',
                          'legendary': 'legendary',
                        }
                        const achievementForEdit: Partial<ApiAchievementType> = {
                          id: ach.id,
                          title: ach.name,
                          description: ach.description || '',
                          icon_url: ach.icon || null,
                          rarity: (ach.rarity && rarityMap[ach.rarity]) || 'common',
                          category: {
                            id: ach.categoryId,
                            name: ach.categoryName,
                            icon_url: null,
                          },
                          xp_reward: 100, // Будет загружено из API
                          is_public: true, // Будет загружено из API
                        }
                        setEditingAchievement(achievementForEdit)
                      }}
                    />
                  ))}
                </AchievementGrid>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {isAuthenticated && (
        <>
          <CreateCategoryModal
            isOpen={isCreateCategoryModalOpen}
            onClose={() => setIsCreateCategoryModalOpen(false)}
            onSuccess={() => {
              // Явно обновляем данные категорий
              if (isAuthenticated && mode === 'categories') {
                refetchCategoriesWithStats()
              }
            }}
          />
          <CreateAchievementModal
            isOpen={isCreateAchievementModalOpen}
            onClose={() => setIsCreateAchievementModalOpen(false)}
            onSuccess={() => {
              // Явно обновляем данные достижений
              if (mode === 'achievements') {
                refetchAchievements()
              }
            }}
          />
          {editingCategory && (
            <CreateCategoryModal
              isOpen={!!editingCategory}
              category={editingCategory}
              onClose={() => setEditingCategory(null)}
              onSuccess={() => {
                setEditingCategory(null)
                if (isAuthenticated && mode === 'categories') {
                  refetchCategoriesWithStats()
                }
              }}
            />
          )}
          {editingAchievement && (
            <CreateAchievementModal
              isOpen={!!editingAchievement}
              achievement={editingAchievement}
              onClose={() => setEditingAchievement(null)}
              onSuccess={() => {
                setEditingAchievement(null)
                if (mode === 'achievements') {
                  refetchAchievements()
                }
              }}
            />
          )}
        </>
      )}
    </>
  )
}
