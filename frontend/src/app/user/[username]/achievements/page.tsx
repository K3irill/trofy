'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useGetUserAchievementsByUsernameQuery } from '@/store/api/userApi'
import Container from '@/components/Container/Container'
import { SectionMarker } from '@/components/SectionMarker'
import { useRouter } from 'next/navigation'
import { renderIcon } from '@/lib/utils/iconUtils'
import styled from 'styled-components'

const PageContainer = styled.div`
  padding: 2rem 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

const Title = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid
    ${(props) =>
    props.$active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  background: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : 'rgba(255, 255, 255, 0.05)'};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.dark[900]
      : props.theme.colors.light[100]};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$active ? 600 : 400)};

  &:hover {
    background: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.primary};
  }
`

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`

const AchievementCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateY(-4px);
  }
`

const AchievementIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AchievementTitle = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`

const AchievementDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`

const AchievementMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const RarityBadge = styled.span<{ $rarity: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$rarity) {
      case 'legendary':
        return 'rgba(255, 215, 0, 0.2)'
      case 'epic':
        return 'rgba(138, 43, 226, 0.2)'
      case 'rare':
        return 'rgba(30, 144, 255, 0.2)'
      default:
        return 'rgba(255, 255, 255, 0.1)'
    }
  }};
  color: ${(props) => {
    switch (props.$rarity) {
      case 'legendary':
        return '#FFD700'
      case 'epic':
        return '#8A2BE2'
      case 'rare':
        return '#1E90FF'
      default:
        return props.theme.colors.light[100]
    }
  }};
`

const XPBadge = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
`

const StatusBadge = styled.span<{ $achieved: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.$achieved
      ? 'rgba(34, 197, 94, 0.2)'
      : 'rgba(251, 191, 36, 0.2)'};
  color: ${(props) => (props.$achieved ? '#22C55E' : '#FBBF24')};
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
`

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.colors.light[100]};
`

export default function UserAchievementsPage() {
  const params = useParams()
  const router = useRouter()
  const username = params?.username as string
  const { user: currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'achieved' | 'in_progress'
  >('all')

  const { data: achievements, isLoading, error } =
    useGetUserAchievementsByUsernameQuery(
      {
        username,
        status: statusFilter === 'all' ? undefined : statusFilter,
      },
      {
        skip: !username,
      }
    )

  const handleAchievementClick = (categoryId: string, achievementId: string) => {
    router.push(`/categories/${categoryId}/${achievementId}`)
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Загрузка достижений...</LoadingState>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <EmptyState>
          {('status' in error && error.status === 403) ||
            ('status' in error && error.status === 404)
            ? 'Достижения недоступны'
            : 'Ошибка при загрузке достижений'}
        </EmptyState>
      </Container>
    )
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Container>
        <PageContainer>
          <Header>
            <SectionMarker />
            <Title>Достижения</Title>
          </Header>
          <Filters>
            <FilterButton
              $active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              Все
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'achieved'}
              onClick={() => setStatusFilter('achieved')}
            >
              Достигнутые
            </FilterButton>
            <FilterButton
              $active={statusFilter === 'in_progress'}
              onClick={() => setStatusFilter('in_progress')}
            >
              В процессе
            </FilterButton>
          </Filters>
          <EmptyState>Достижения не найдены</EmptyState>
        </PageContainer>
      </Container>
    )
  }

  return (
    <Container>
      <PageContainer>
        <Header>
          <SectionMarker />
          <Title>Достижения</Title>
        </Header>
        <Filters>
          <FilterButton
            $active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            Все
          </FilterButton>
          <FilterButton
            $active={statusFilter === 'achieved'}
            onClick={() => setStatusFilter('achieved')}
          >
            Достигнутые
          </FilterButton>
          <FilterButton
            $active={statusFilter === 'in_progress'}
            onClick={() => setStatusFilter('in_progress')}
          >
            В процессе
          </FilterButton>
        </Filters>
        <AchievementsGrid>
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              onClick={() =>
                handleAchievementClick(achievement.category.id, achievement.id)
              }
            >
              <AchievementIcon>
                {renderIcon(achievement.icon_url, '🏆')}
              </AchievementIcon>
              <AchievementTitle>{achievement.title}</AchievementTitle>
              <AchievementDescription>
                {achievement.description}
              </AchievementDescription>
              <AchievementMeta>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <RarityBadge $rarity={achievement.rarity}>
                    {achievement.rarity === 'legendary'
                      ? 'Легендарное'
                      : achievement.rarity === 'epic'
                        ? 'Эпическое'
                        : achievement.rarity === 'rare'
                          ? 'Редкое'
                          : 'Обычное'}
                  </RarityBadge>
                  <StatusBadge $achieved={achievement.is_achieved}>
                    {achievement.is_achieved ? 'Достигнуто' : 'В процессе'}
                  </StatusBadge>
                </div>
                <XPBadge>+{achievement.xp_reward} XP</XPBadge>
              </AchievementMeta>
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </PageContainer>
    </Container>
  )
}
