'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppSelector } from '@/store/hooks'

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
import { categories } from './page.constants'
import { CategoryCardComponent } from './CategoryCard'
import { Tumbler } from './Tumbler'
import { ViewModeSelector, type AchievementViewMode } from './ViewModeSelector'
import { SearchAndFilters } from './SearchAndFilters'
import { AchievementCard } from './AchievementCard'
import { AchievementGrid } from './AchievementGrid.styled'
import { type Achievement } from './api'

import Container from '@/components/Container/Container'

export default function CategoriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [mode, setMode] = useState<'categories' | 'achievements'>('categories')
  const [viewMode, setViewMode] = useState<AchievementViewMode>('grid3')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [unlockedFilter, setUnlockedFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')

  // Собираем все достижения из всех категорий для мок-данных
  const allAchievements = useMemo(() => {
    const all: Achievement[] = []
    const rarities: Array<'common' | 'rare' | 'epic' | 'legendary'> = ['common', 'rare', 'epic', 'legendary']
    const dates = ['2024-01-15', '2024-02-20', '2024-03-10', '2024-04-05', '2024-05-12']

    categories.forEach((category) => {
      category.achievements.forEach((achievement, index) => {
        // Распределяем редкость по индексу для демонстрации
        const rarityIndex = index % rarities.length
        const dateIndex = index % dates.length
        // Для авторизованных пользователей все достижения незавершены (если нет реальных данных)
        // Для неавторизованных показываем мок-данные как есть
        const isUnlocked = isAuthenticated ? false : achievement.unlocked
        all.push({
          id: achievement.id,
          name: achievement.name || 'Достижение',
          description: achievement.description,
          icon: achievement.icon,
          categoryId: category.id,
          categoryName: category.name,
          unlocked: isUnlocked,
          rarity: rarities[rarityIndex],
          completionDate: isUnlocked ? dates[dateIndex] : undefined,
        })
      })
    })
    return all
  }, [isAuthenticated])

  // Фильтрация и сортировка достижений (локально, пока нет API)
  const filteredAndSortedAchievements = useMemo(() => {
    let filtered = allAchievements

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (achievement) =>
          achievement.name.toLowerCase().includes(query) ||
          achievement.description?.toLowerCase().includes(query)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (achievement) => achievement.categoryId === selectedCategory
      )
    }

    // Фильтр по разблокированности доступен только для авторизованных пользователей
    if (isAuthenticated && unlockedFilter) {
      const unlocked = unlockedFilter === 'true'
      filtered = filtered.filter(
        (achievement) => achievement.unlocked === unlocked
      )
    }

    if (rarityFilter) {
      filtered = filtered.filter(
        (achievement) => achievement.rarity === rarityFilter
      )
    }

    // Сортировка
    if (sortBy === 'unlocked-asc') {
      filtered = [...filtered].sort((a, b) => {
        if (a.unlocked === b.unlocked) return 0
        return a.unlocked ? -1 : 1
      })
    } else if (sortBy === 'unlocked-desc') {
      filtered = [...filtered].sort((a, b) => {
        if (a.unlocked === b.unlocked) return 0
        return a.unlocked ? 1 : -1
      })
    } else if (sortBy === 'date-asc') {
      filtered = [...filtered].sort((a, b) => {
        if (!a.completionDate && !b.completionDate) return 0
        if (!a.completionDate) return 1
        if (!b.completionDate) return -1
        return a.completionDate.localeCompare(b.completionDate)
      })
    } else if (sortBy === 'date-desc') {
      filtered = [...filtered].sort((a, b) => {
        if (!a.completionDate && !b.completionDate) return 0
        if (!a.completionDate) return 1
        if (!b.completionDate) return -1
        return b.completionDate.localeCompare(a.completionDate)
      })
    }

    return filtered
  }, [allAchievements, searchQuery, selectedCategory, unlockedFilter, rarityFilter, sortBy, isAuthenticated])

  // TODO: Реализовать вызов API при изменении поиска/фильтров
  // useEffect(() => {
  //   const fetchAchievements = async () => {
  //     const result = await searchAchievements({
  //       query: searchQuery || undefined,
  //       categoryId: selectedCategory || undefined,
  //     })
  //     setAchievements(result.achievements)
  //   }
  //   fetchAchievements()
  // }, [searchQuery, selectedCategory])

  return (
    <>
      <Container>
        <PageHeader>
          <PageHeaderWrap>
            <Title>
              {mode === 'categories' ? '📂 Категории достижений' : '🏆 Все достижения'}
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
              <Grid>
                {categories.map((category) => {
                  // Для авторизованных пользователей все достижения незавершены
                  const processedCategory = isAuthenticated
                    ? {
                      ...category,
                      unlocked: 0,
                      achievements: category.achievements.map((a) => ({ ...a, unlocked: false })),
                    }
                    : category

                  return (
                    <CategoryCardComponent
                      key={category.id}
                      category={processedCategory}
                      onClick={() => router.push(`/categories/${category.id}`)}
                      isAuthenticated={isAuthenticated}
                    />
                  )
                })}
              </Grid>
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
                unlockedFilter={unlockedFilter}
                onUnlockedFilterChange={setUnlockedFilter}
                rarityFilter={rarityFilter}
                onRarityFilterChange={setRarityFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isAuthenticated={isAuthenticated}
              />
              {filteredAndSortedAchievements.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    Достижения не найдены
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    Попробуйте изменить параметры поиска или фильтры
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                <ListContainer>
                  {filteredAndSortedAchievements.map((achievement) => (
                    <ListItem
                      key={achievement.id}
                      rarity={achievement.rarity}
                      unlocked={achievement.unlocked}
                      onClick={() =>
                        router.push(`/categories/${achievement.categoryId}/${achievement.id}`)
                      }
                    >
                      <ListItemIcon>{achievement.icon}</ListItemIcon>
                      <ListItemContent>
                        <ListItemName>{achievement.name}</ListItemName>
                        <ListItemStats>
                          <StatItem>
                            <StatLabel>Категория:</StatLabel>
                            <StatValue>{achievement.categoryName}</StatValue>
                          </StatItem>
                          <StatItem>
                            <StatLabel>Статус:</StatLabel>
                            <StatValue>
                              {achievement.unlocked ? 'Разблокировано' : 'Заблокировано'}
                            </StatValue>
                          </StatItem>
                          <StatItem>
                            <StatLabel>Редкость:</StatLabel>
                            <StatValue
                              style={{
                                color: achievement.rarity
                                  ? (() => {
                                    // Используем цвета из темы через inline стиль
                                    // В реальном приложении лучше использовать styled-components
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
                      <ProgressRing progress={achievement.unlocked ? 100 : 0} />
                    </ListItem>
                  ))}
                </ListContainer>
              ) : (
                <AchievementGrid mode={viewMode}>
                  {filteredAndSortedAchievements.map((achievement) => (
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
