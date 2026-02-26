'use client'

import { useParams } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useGetUserAchievementsByUsernameQuery } from '@/store/api/userApi'
import Container from '@/components/Container/Container'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoFolder, IoTrophy, IoCloseCircle } from 'react-icons/io5'
import {
  Header as PageHeader,
  Title,
  TitleIcon,
  Grid,
  PageHeaderWrap,
} from '@/app/categories/page.styled'
import { CategoryCardComponent, type Category } from '@/app/categories/CategoryCard'
import { Tumbler } from '@/app/categories/Tumbler'
import { SearchAndFilters } from '@/app/categories/SearchAndFilters'
import { AchievementCard } from '@/app/categories/AchievementCard'
import { AchievementGrid } from '@/app/categories/AchievementGrid.styled'
import { type Achievement } from '@/app/categories/api'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { CreateCategoryModal } from '@/components/CreateCategoryModal/CreateCategoryModal'
import { DeleteCategoryModal } from '@/components/DeleteCategoryModal/DeleteCategoryModal'
import { CreateAchievementModal } from '@/components/CreateAchievementModal/CreateAchievementModal'
import { DeleteAchievementModal } from '@/components/DeleteAchievementModal/DeleteAchievementModal'
import { useGetMeQuery } from '@/store/api/userApi'
import { useGetCategoryByIdQuery } from '@/store/api/achievementsApi'


type ViewMode = 'categories' | 'achievements'
type RarityFilter = 'all' | 'common' | 'rare' | 'epic' | 'legendary'
type SortBy = 'default' | 'completion-asc' | 'completion-desc'

export default function UserAchievementsPage() {
  const params = useParams()
  const router = useRouter()
  const username = params?.username as string
  const { user: currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )
  const [viewMode, setViewMode] = useState<ViewMode>('achievements')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [favoriteFilter, setFavoriteFilter] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false)
  const [isDeleteAchievementModalOpen, setIsDeleteAchievementModalOpen] = useState(false)
  const { data: currentUserData } = useGetMeQuery(undefined, { skip: !isAuthenticated })

  // Debounce для поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: achievements, isLoading, error } =
    useGetUserAchievementsByUsernameQuery(
      {
        username,
      },
      {
        skip: !username,
      }
    )

  // Проверяем, является ли текущий пользователь владельцем страницы
  const isOwnPage = useMemo(() => {
    return currentUser?.username === username
  }, [currentUser?.username, username])

  // Преобразование категорий в формат CategoryCardComponent
  const categories: Category[] = useMemo(() => {
    if (!achievements) return []
    
    const categoryMap = new Map<string, {
      id: string
      name: string
      icon: string
      total: number
      unlocked: number
      achievements: Array<{
        id: string
        icon: string
        unlocked: boolean
        progress?: number
        completion_date?: string
      }>
    }>()

    achievements.forEach((achievement) => {
      const categoryId = achievement.category.id
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: achievement.category.name,
          icon: achievement.category.icon_url || '📁',
          total: 0,
          unlocked: 0,
          achievements: [],
        })
      }
      const category = categoryMap.get(categoryId)!
      category.total++
      category.achievements.push({
        id: achievement.id,
        icon: achievement.icon_url || '',
        unlocked: achievement.is_achieved,
        progress: achievement.is_achieved ? 100 : undefined,
        completion_date: achievement.completion_date || undefined,
      })
      if (achievement.is_achieved) {
        category.unlocked++
      }
    })

    return Array.from(categoryMap.values())
  }, [achievements])

  // Преобразование и фильтрация достижений в формат AchievementCard
  const transformedAchievements: Achievement[] = useMemo(() => {
    if (!achievements) return []

    let filtered = achievements.filter((achievement) => {
      // Поиск
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase()
        const matchesSearch =
          achievement.title.toLowerCase().includes(query) ||
          achievement.description.toLowerCase().includes(query) ||
          achievement.category.name.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Фильтр по категории
      if (selectedCategory && achievement.category.id !== selectedCategory) {
        return false
      }

      // Фильтр по редкости
      if (rarityFilter && achievement.rarity !== rarityFilter) {
        return false
      }

      // Фильтр по статусу
      if (statusFilter) {
        const isAchieved = !!achievement.completion_date
        const progress = achievement.progress ?? (isAchieved ? 100 : undefined)
        const isInProgress = !isAchieved && progress !== undefined && progress > 0 && progress < 100
        const isNotAchieved = !isAchieved && (progress === undefined || progress === 0)

        switch (statusFilter) {
          case 'achieved':
            if (!isAchieved) return false
            break
          case 'in_progress':
            if (!isInProgress) return false
            break
          case 'not_achieved':
            if (!isNotAchieved) return false
            break
        }
      }

      // Фильтр по избранному (только для своих достижений)
      if (favoriteFilter === 'favorite' && isOwnPage) {
        if (!achievement.is_favorite) return false
      }

      return true
    })

    // Сортировка
    if (sortBy && sortBy !== 'default') {
      filtered.sort((a, b) => {
        const aIsAchieved = !!a.completion_date
        const aProgress = a.progress ?? (aIsAchieved ? 100 : undefined)
        const aIsInProgress = !aIsAchieved && aProgress !== undefined && aProgress > 0 && aProgress < 100
        const aIsNotAchieved = !aIsAchieved && (aProgress === undefined || aProgress === 0)

        const bIsAchieved = !!b.completion_date
        const bProgress = b.progress ?? (bIsAchieved ? 100 : undefined)
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

    // Преобразование в формат Achievement
    return filtered.map((achievement) => {
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
        is_favorite: achievement.is_favorite || false,
      }
    })
  }, [achievements, debouncedSearchQuery, selectedCategory, statusFilter, rarityFilter, sortBy, favoriteFilter, isOwnPage])

  // Фильтрация категорий
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery) return categories

    const query = debouncedSearchQuery.toLowerCase()
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.achievements.some(
          (achievement) =>
            achievements?.some(
              (a) =>
                a.id === achievement.id &&
                (a.title.toLowerCase().includes(query) ||
                  a.description.toLowerCase().includes(query))
            )
        )
    )
  }, [categories, debouncedSearchQuery, achievements])

  const handleAchievementClick = (achievement: Achievement) => {
    router.push(`/user/${username}/achievements/${achievement.categoryId}/${achievement.id}`)
  }

  const handleCategoryClick = (category: Category) => {
    router.push(`/user/${username}/achievements/${category.id}`)
  }

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category)
  }

  const handleCategoryDelete = (category: Category) => {
    setEditingCategory(category)
    setIsDeleteCategoryModalOpen(true)
  }

  const handleAchievementEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
  }

  const handleAchievementDelete = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setIsDeleteAchievementModalOpen(true)
  }

  const hasError = error !== undefined
  const showLoader = isLoading && (!achievements || achievements.length === 0)
  const hasData = viewMode === 'categories' 
    ? filteredCategories.length > 0 
    : transformedAchievements.length > 0

  return (
    <Container>
      <PageHeader>
        <PageHeaderWrap>
          <Title>
            {viewMode === 'categories' ? (
              <>
                <TitleIcon as={IoFolder} />
                {isOwnPage ? 'Категории моих достижений' : `Категории достижений ${username}`}
              </>
            ) : (
              <>
                <TitleIcon as={IoTrophy} />
                {isOwnPage ? 'Мои достижения' : `Достижения ${username}`}
              </>
            )}
          </Title>
          <Tumbler mode={viewMode} onChange={setViewMode} />
        </PageHeaderWrap>
      </PageHeader>

      <AnimatePresence mode="wait">
        {viewMode === 'categories' ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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
                <div style={{ fontSize: '1.25rem' }}>
                  {('status' in (error || {}) && (error as any)?.status === 403) ||
                  ('status' in (error || {}) && (error as any)?.status === 404)
                    ? 'Достижения недоступны'
                    : 'Ошибка загрузки категорий'}
                </div>
              </div>
            ) : filteredCategories.length === 0 ? (
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
                {filteredCategories.map((category) => (
                  <CategoryCardComponent
                    key={category.id}
                    category={category}
                    onClick={() => handleCategoryClick(category)}
                    isAuthenticated={isAuthenticated}
                    currentUserId={currentUserData?.id}
                    onEdit={handleCategoryEdit}
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
              favoriteFilter={favoriteFilter}
              onFavoriteFilterChange={setFavoriteFilter}
              isOwnProfile={isOwnPage}
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
                <div style={{ fontSize: '1.25rem' }}>
                  {('status' in (error || {}) && (error as any)?.status === 403) ||
                  ('status' in (error || {}) && (error as any)?.status === 404)
                    ? 'Достижения недоступны'
                    : 'Ошибка загрузки достижений'}
                </div>
              </div>
            ) : transformedAchievements.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <IoTrophy style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Достижения не найдены
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  Попробуйте изменить параметры поиска или фильтры
                </div>
              </div>
            ) : (
              <AchievementGrid mode="grid3">
                {transformedAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClick={() => handleAchievementClick(achievement)}
                    currentUserId={currentUserData?.id}
                    onEdit={handleAchievementEdit}
                  />
                ))}
              </AchievementGrid>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthenticated && currentUserData && (
        <>
          {editingCategory && (
            <>
              <CreateCategoryModal
                isOpen={!!editingCategory && !isDeleteCategoryModalOpen}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                onSuccess={() => {
                  setEditingCategory(null)
                }}
              />
              <DeleteCategoryModal
                isOpen={isDeleteCategoryModalOpen}
                onClose={() => {
                  setIsDeleteCategoryModalOpen(false)
                  setEditingCategory(null)
                }}
                categoryName={editingCategory.name}
                categoryId={editingCategory.id}
                onSuccess={() => {
                  setIsDeleteCategoryModalOpen(false)
                  setEditingCategory(null)
                }}
              />
            </>
          )}
          {editingAchievement && (
            <>
              <CreateAchievementModal
                isOpen={!!editingAchievement && !isDeleteAchievementModalOpen}
                achievement={editingAchievement}
                onClose={() => setEditingAchievement(null)}
                onSuccess={() => {
                  setEditingAchievement(null)
                }}
              />
              <DeleteAchievementModal
                isOpen={isDeleteAchievementModalOpen}
                onClose={() => {
                  setIsDeleteAchievementModalOpen(false)
                  setEditingAchievement(null)
                }}
                achievementName={editingAchievement.name}
                achievementId={editingAchievement.id}
                onSuccess={() => {
                  setIsDeleteAchievementModalOpen(false)
                  setEditingAchievement(null)
                }}
              />
            </>
          )}
        </>
      )}
    </Container>
  )
}
