'use client'

import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { ShowcaseAside } from '@/components/ShowcaseAside'
import { DailyMissionSection } from '@/components/DailyMissionSection'
import Container from '@/components/Container/Container'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { IoFlame, IoStar, IoTrendingUp, IoPeople, IoTime, IoTrophy } from 'react-icons/io5'

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  padding: 2rem 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const AsideSection = styled.aside`
  @media (max-width: 1024px) {
    display: none;
  }
`

const FeedHeader = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`

const FeedTitle = styled.h1`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const FeedSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  margin: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
`

const StatValue = styled.div`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
`

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`

const FeedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FeedCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}40;
    transform: translateY(-2px);
  }
`

const FeedCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
`

const FeedCardTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`

const FeedCardDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
`

export default function FeedPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [showcaseFilter, setShowcaseFilter] = useState<'best' | 'recent' | 'mine'>('best')

  const handleFilterChange = (filter: 'best' | 'recent' | 'mine') => {
    if (!isAuthenticated && filter === 'mine') {
      setShowcaseFilter('best')
    } else {
      setShowcaseFilter(filter)
    }
  }

  const stats = [
    { icon: IoFlame, value: '1,234', label: 'Активных пользователей', color: '#ff6b6b' },
    { icon: IoTrophy, value: '5,678', label: 'Достижений выполнено', color: '#4ecdc4' },
    { icon: IoStar, value: '890', label: 'Новых сегодня', color: '#ffe66d' },
    { icon: IoTrendingUp, value: '+12%', label: 'Рост за неделю', color: '#95e1d3' },
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

  return (
    <Container>
      <Content>
        <MainSection>
          <FeedHeader
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FeedTitle>
              <IoFlame />
              Лента активности
            </FeedTitle>
            <FeedSubtitle>Следите за последними событиями и достижениями сообщества</FeedSubtitle>
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
