'use client'

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { ShowcaseAside } from '@/components/ShowcaseAside'
import { DailyMissionSection } from '@/components/DailyMissionSection'
import Container from '@/components/Container/Container'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { IoFlame, IoStar, IoTrendingUp, IoPeople, IoTime, IoTrophy, IoGrid, IoPerson, IoSearch } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { useGetGlobalStatsQuery } from '@/store/api/userApi'

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  padding: 1rem 0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.5rem 0;
    width: 100%;
  }

  @media (max-width: 640px) {
    padding: 0.25rem 0;
    gap: 0.5rem;
  }
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 1024px) {
    gap: 1rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    gap: 0.75rem;
    width: 100%;
  }
`

const AsideSection = styled.aside`
  @media (max-width: 1024px) {
    display: none;
  }
`

const FeedHeader = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 1.25rem;
    margin-bottom: 0;
    border-radius: 12px;
    width: 100%;
  }

  @media (max-width: 640px) {
    padding: 0.875rem;
    border-radius: 10px;
    width: 100%;
  }
`

const FeedTitle = styled.h1`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }

  @media (max-width: 640px) {
    font-size: 1.125rem;
    gap: 0.375rem;
    flex-wrap: wrap;
    margin-bottom: 0.375rem;
  }
`

const FeedSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    gap: 0.5rem;
    width: 100%;
  }
`

const StatCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}40;
    transform: translateY(-2px);
  }

  @media (max-width: 1024px) {
    padding: 1.25rem;
    gap: 0.5rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    padding: 0.875rem;
    border-radius: 10px;
    gap: 0.5rem;
    width: 100%;
  }
`

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.5rem;

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    border-radius: 10px;
  }
`

const StatValue = styled.div`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  line-height: 1.3;

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`

const FeedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    gap: 1rem;
    width: 100%;
  }
`

const FeedCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}40;
    transform: translateY(-2px);
  }

  @media (max-width: 1024px) {
    padding: 1.5rem;
    border-radius: 12px;
    width: 100%;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    border-radius: 12px;
    width: 100%;
  }
`

const FeedCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`

const FeedCardIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.75rem;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    border-radius: 10px;
  }
`

const FeedCardTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`

const FeedCardDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.5;
  }
`

const QuickActions = styled(motion.div)`
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  opacity: 1 !important;
  visibility: visible !important;

  @media (max-width: 1024px) {
    gap: 0.75rem;
    width: 100%;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    width: 100%;
  }
`

const QuickActionButton = styled(motion.button)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => props.theme.colors.light[100]};
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}40;
    transform: translateY(-2px);
    background: ${(props) => props.theme.colors.dark.neomorphDark};
  }

  @media (max-width: 640px) {
    padding: 0.875rem;
    gap: 0.5rem;
    border-radius: 10px;
    width: 100%;
  }
`

const QuickActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.5rem;

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    border-radius: 10px;
  }
`

const QuickActionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`

const MobileShowcase = styled(motion.div)`
  display: none;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    display: block;
    width: 100%;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

const MobileShowcaseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    margin-bottom: 0.75rem;
  }
`

const MobileShowcaseTitle = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`

const MobileShowcaseContent = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;

  > * {
    background: ${(props) => props.theme.colors.dark.neomorphDark};
    border: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
    border-radius: 12px;
    padding: 1rem;

    @media (max-width: 640px) {
      padding: 0.75rem;
      border-radius: 10px;
    }
  }
`

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`

export default function FeedPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showcaseFilter, setShowcaseFilter] = useState<'best' | 'recent' | 'mine'>('best')

  const router = useRouter()
  const { data: globalStats, isLoading: isLoadingStats } = useGetGlobalStatsQuery()

  useEffect(() => {
    // router.push('/user')
  }, [router])



  const handleFilterChange = (filter: 'best' | 'recent' | 'mine') => {
    if (!isAuthenticated && filter === 'mine') {
      setShowcaseFilter('best')
    } else {
      setShowcaseFilter(filter)
    }
  }

  // Форматирование чисел с разделителями тысяч
  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU')
  }

  const stats = [
    { 
      icon: IoFlame, 
      value: isLoadingStats ? '...' : formatNumber(globalStats?.active_users || 0), 
      label: 'Активных пользователей', 
      color: '#ff6b6b' 
    },
    { 
      icon: IoTrophy, 
      value: isLoadingStats ? '...' : formatNumber(globalStats?.total_completed_achievements || 0), 
      label: 'Достижений выполнено', 
      color: '#4ecdc4' 
    },
    { 
      icon: IoStar, 
      value: isLoadingStats ? '...' : formatNumber(globalStats?.new_today || 0), 
      label: 'Новых сегодня', 
      color: '#ffe66d' 
    },
    { 
      icon: IoTrendingUp, 
      value: isLoadingStats ? '...' : `${globalStats?.weekly_growth && globalStats.weekly_growth > 0 ? '+' : ''}${globalStats?.weekly_growth || 0}%`, 
      label: 'Рост за неделю', 
      color: '#95e1d3' 
    },
  ]

  const feedItems = [
    {
      icon: IoPeople,
      title: 'Сообщество растет!',
      description:
        'На этой неделе к нам присоединилось более 100 новых пользователей. Добро пожаловать в Trofy!',
    },
    {
      icon: IoTime,
      title: 'Новые достижения',
      description:
        'Добавлены новые категории достижений. Исследуйте новые возможности и получайте награды!',
    },
    {
      icon: IoTrophy,
      title: 'Топ достижения недели',
      description:
        'Посмотрите самые впечатляющие достижения этой недели. Вдохновляйтесь и достигайте большего!',
    },
  ]

  const quickActions = [
    {
      icon: IoGrid,
      label: 'Категории',
      onClick: () => router.push('/categories'),
    },
    {
      icon: IoSearch,
      label: 'Поиск',
      onClick: () => router.push('/categories'),
    },
    ...(isAuthenticated
      ? [
        {
          icon: IoPerson,
          label: 'Профиль',
          onClick: () => router.push(`/user/${user?.username || ''}`),
        },
      ]
      : []),
  ]



  return (
    <Container>
      <Content>
        <MainSection>

          <MobileShowcase
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MobileShowcaseHeader>
              <MobileShowcaseTitle>
                <IoTrophy />
                Достижения
              </MobileShowcaseTitle>
            </MobileShowcaseHeader>
            <MobileShowcaseContent>
              <ShowcaseAside
                filter={isAuthenticated ? showcaseFilter : showcaseFilter === 'mine' ? 'best' : showcaseFilter}
                onFilterChange={handleFilterChange}
                isAuthenticated={isAuthenticated}
              />
            </MobileShowcaseContent>
          </MobileShowcase>

          <FeedHeader
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FeedTitle>
              <IoFlame />
              Добро пожаловать в Trofy
            </FeedTitle>
            <FeedSubtitle>Отслеживайте свои достижения, соревнуйтесь с друзьями и достигайте новых высот!</FeedSubtitle>
          </FeedHeader>



          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <StatIcon style={{ color: stat.color, background: `${stat.color}20` }}>
                  <stat.icon />
                </StatIcon>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>

          {isAuthenticated && <DailyMissionSection />}



          <SectionTitle>
            <IoTime />
            Новости и обновления
          </SectionTitle>

          <FeedContent>
            {feedItems.map((item, index) => (
              <FeedCard
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <FeedCardHeader>
                  <FeedCardIcon>
                    <item.icon />
                  </FeedCardIcon>
                  <FeedCardTitle>{item.title}</FeedCardTitle>
                </FeedCardHeader>
                <FeedCardDescription>{item.description}</FeedCardDescription>
              </FeedCard>
            ))}
          </FeedContent>
        </MainSection>

        <AsideSection>
          <ShowcaseAside
            filter={isAuthenticated ? showcaseFilter : showcaseFilter === 'mine' ? 'best' : showcaseFilter}
            onFilterChange={handleFilterChange}
            isAuthenticated={isAuthenticated}
          />
        </AsideSection>
      </Content>
    </Container>
  )
}
