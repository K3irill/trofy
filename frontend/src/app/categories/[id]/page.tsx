'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/Header/Header'

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
import { categories } from '../page.constants'
import { AchievementCard } from './AchievementCard'
import { ViewModeSelector, AchievementViewMode } from './ViewModeSelector'
import Container from '@/components/Container/Container'

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [viewMode, setViewMode] = useState<AchievementViewMode>('grid6')

  const categoryId = params?.id as string
  const category = categories.find((cat) => cat.id === categoryId)

  // Отладка
  if (process.env.NODE_ENV === 'development') {
    console.log('Category ID:', categoryId)
    console.log('Available categories:', categories.map(c => c.id))
    console.log('Found category:', category)
  }

  if (!category) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <div style={{ fontSize: '1.125rem' }}>Категория не найдена</div>
        </div>
      </Container>
    )
  }

  const allAchievements = category.achievements

  const renderAchievements = (achievements: typeof allAchievements) => {
    if (viewMode === 'list') {
      return (
        <AchievementListContainer>
          {achievements.map((achievement) => (
            <AchievementListItem
              key={achievement.id}
              unlocked={achievement.unlocked}
              onClick={() => router.push(`/categories/${category.id}/${achievement.id}`)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementListIcon unlocked={achievement.unlocked}>
                {achievement.icon}
              </AchievementListIcon>
              <AchievementListContent>
                <AchievementListName>{achievement.name || `Достижение ${achievement.id}`}</AchievementListName>
                <AchievementListStatus unlocked={achievement.unlocked}>
                  {achievement.unlocked ? 'Разблокировано' : 'Заблокировано'}
                </AchievementListStatus>
              </AchievementListContent>
            </AchievementListItem>
          ))}
        </AchievementListContainer>
      )
    }

    return (
      <AchievementGrid mode={viewMode}>
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={() => router.push(`/categories/${category.id}/${achievement.id}`)}
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
          <CategoryIconLarge>{category.icon}</CategoryIconLarge>
          <CategoryDetails>
            <CategoryName>{category.name}</CategoryName>
            <CategoryStats>
              <Stat>
                <StatValue>{category.unlocked}</StatValue>
                <StatLabelText>Разблокировано</StatLabelText>
              </Stat>
              <Stat>
                <StatValue>{category.total}</StatValue>
                <StatLabelText>Всего</StatLabelText>
              </Stat>
              <Stat>
                <StatValue>{Math.round((category.unlocked / category.total) * 100)}%</StatValue>
                <StatLabelText>Прогресс</StatLabelText>
              </Stat>
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
            {renderAchievements(allAchievements)}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  )
}
