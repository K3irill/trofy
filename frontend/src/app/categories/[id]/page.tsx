'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppSelector } from '@/store/hooks'
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
import Container from '@/components/Container/Container'

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [viewMode, setViewMode] = useState<AchievementViewMode>('grid6')
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const categoryId = params?.id as string

  // Получаем категорию со статистикой для авторизованных, без статистики для неавторизованных
  const { data: categoryWithStats, isLoading: isLoadingCategoryWithStats } = useGetCategoryByIdWithStatsQuery(
    categoryId,
    { skip: !categoryId || !isAuthenticated }
  )
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId || isAuthenticated, // Пропускаем если авторизован (используем with-stats)
  })

  // Получаем достижения в категории
  const { data: achievementsData, isLoading: isLoadingAchievements } = useGetAchievementsByCategoryQuery(
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

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem' }}>⏳</div>
          <div style={{ fontSize: '1.125rem' }}>Загрузка...</div>
        </div>
      </Container>
    )
  }

  if (!activeCategory) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <div style={{ fontSize: '1.125rem' }}>Категория не найдена</div>
        </div>
      </Container>
    )
  }

  const achievements = achievementsData?.achievements || []
  const unlockedCount = categoryWithStats?.unlocked || 0
  const totalCount = categoryWithStats?.total || ('achievements_count' in activeCategory ? activeCategory.achievements_count : 0) || 0
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const renderAchievements = (achievementsList: ApiAchievement[]) => {
    if (isLoadingAchievements) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Загрузка достижений...</div>
        </div>
      )
    }

    if (achievementsList.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <div>Достижения не найдены</div>
        </div>
      )
    }

    if (viewMode === 'list') {
      return (
        <AchievementListContainer>
          {achievementsList.map((achievement) => (
            <AchievementListItem
              key={achievement.id}
              $unlocked={achievement.unlocked}
              onClick={() => router.push(`/categories/${activeCategory.id}/${achievement.id}`)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementListIcon $unlocked={achievement.unlocked}>
                {renderIcon(achievement.icon_url, '🏆')}
              </AchievementListIcon>
              <AchievementListContent>
                <AchievementListName>{achievement.title}</AchievementListName>
                <AchievementListStatus $unlocked={achievement.unlocked}>
                  {achievement.unlocked ? 'Разблокировано' : 'Не открыто'}
                </AchievementListStatus>
              </AchievementListContent>
            </AchievementListItem>
          ))}
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
            <ViewModeSelector mode={viewMode} onChange={setViewMode} />
          </PageHeaderWrap>
        </PageHeader>

        <CategoryInfo>
          <CategoryIconLarge>
            {renderIcon(activeCategory.icon_url, '📁')}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAchievements(achievements)}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  )
}
