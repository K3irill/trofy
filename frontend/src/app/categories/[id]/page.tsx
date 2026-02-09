'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header/Header'

import {
  Container,
  Header as PageHeader,
  Title,
  BackButton,
  CategoryInfo,
  CategoryIconLarge,
  CategoryDetails,
  CategoryName,
  CategoryStats,
  Stat,
  StatValue,
  StatLabel,
  SectionTitle,
  SectionIcon,
  AchievementGrid,
  UnlockedSection,
  LockedSection,
} from './page.styled'
import { categories } from '../page.constants'
import { CategoryCardComponent } from '../CategoryCard'

interface PageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: PageProps) {
  const router = useRouter()
  const category = categories.find((cat) => cat.id === params.id)

  if (!category) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <div style={{ color: '#9ca3af', fontSize: '1.125rem' }}>Категория не найдена</div>
        </div>
      </Container>
    )
  }

  const unlockedAchievements = category.achievements.filter((a) => a.unlocked)
  const lockedAchievements = category.achievements.filter((a) => !a.unlocked)

  return (
    <>
      <Header />
      <Container>
        <PageHeader>
          <BackButton onClick={() => router.back()} initial={{ x: -20 }} animate={{ x: 0 }}>
            ← Назад
          </BackButton>
        </PageHeader>

        <CategoryInfo>
          <CategoryIconLarge>{category.icon}</CategoryIconLarge>
          <CategoryDetails>
            <CategoryName>{category.name}</CategoryName>
            <CategoryStats>
              <Stat>
                <StatValue>{category.unlocked}</StatValue>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Разблокировано</div>
              </Stat>
              <Stat>
                <StatValue>{category.total}</StatValue>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Всего</div>
              </Stat>
              <Stat>
                <StatValue>{Math.round((category.unlocked / category.total) * 100)}%</StatValue>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Прогресс</div>
              </Stat>
            </CategoryStats>
          </CategoryDetails>
        </CategoryInfo>

        {unlockedAchievements.length > 0 && (
          <UnlockedSection initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SectionTitle>
              <SectionIcon>✅</SectionIcon>
              Выполненные ({unlockedAchievements.length}/{category.total})
            </SectionTitle>
            <AchievementGrid>
              {unlockedAchievements.map((achievement) => (
                <CategoryCardComponent
                  key={achievement.id}
                  category={category}
                  achievement={achievement}
                  unlocked={true}
                />
              ))}
            </AchievementGrid>
          </UnlockedSection>
        )}

        {lockedAchievements.length > 0 && (
          <LockedSection initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.6, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <SectionTitle>
              <SectionIcon>🔒</SectionIcon>
              Недоступные ({lockedAchievements.length}/{category.total - category.unlocked})
            </SectionTitle>
            <AchievementGrid>
              {lockedAchievements.map((achievement) => (
                <CategoryCardComponent
                  key={achievement.id}
                  category={category}
                  achievement={achievement}
                  unlocked={false}
                />
              ))}
            </AchievementGrid>
          </LockedSection>
        )}
      </Container>
    </>
  )
}
