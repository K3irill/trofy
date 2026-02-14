'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useGetUserByUsernameQuery, useGetUserStatsByUsernameQuery } from '@/store/api/userApi'
import { Profile } from '@/components/Profile'
import { ShowcaseAside } from '@/components/ShowcaseAside'
import { RecentTrophiesSection } from '@/components/RecentTrophiesSection'
import { InviteFriendSection } from '@/components/InviteFriendSection'
import { DailyMissionSection } from '@/components/DailyMissionSection'
import Container from '@/components/Container/Container'
import {
  Content,
  MainSection,
  AsideSection,
} from '../../page.styled'

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params?.username as string
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showcaseFilter, setShowcaseFilter] = useState<'best' | 'recent' | 'mine'>('best')

  const { data: user, isLoading, error } = useGetUserByUsernameQuery(username, {
    skip: !username,
  })
  const { data: stats } = useGetUserStatsByUsernameQuery(username, {
    skip: !username,
  })

  const isOwnProfile = isAuthenticated && currentUser && currentUser.username === username

  // Если пользователь не авторизован и выбран фильтр "mine", переключаем на "best"
  const handleFilterChange = (filter: 'best' | 'recent' | 'mine') => {
    if (!isAuthenticated && filter === 'mine') {
      setShowcaseFilter('best')
    } else {
      setShowcaseFilter(filter)
    }
  }

  // Если пользователь не найден или профиль приватный
  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      router.push('/404')
    } else if (error && 'status' in error && error.status === 403) {
      // Профиль приватный - можно показать специальную страницу
    }
  }, [error, router])

  if (isLoading) {
    return (
      <Container>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#f3f4f6' }}>
          Загрузка профиля...
        </div>
      </Container>
    )
  }

  if (error) {
    if ('status' in error && error.status === 403) {
      return (
        <Container>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#f3f4f6' }}>
            <h2>Профиль приватный</h2>
            <p>Этот пользователь скрыл свой профиль от просмотра.</p>
          </div>
        </Container>
      )
    }
    return (
      <Container>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#f3f4f6' }}>
          Пользователь не найден
        </div>
      </Container>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Container>
      <Content>
        <MainSection>
          <Profile
            user={user}
            isAuthenticated={isAuthenticated}
            isOwnProfile={isOwnProfile}
            stats={stats}
          />
          <RecentTrophiesSection username={username} isOwnProfile={isOwnProfile} />
          {isOwnProfile && (
            <>
              <DailyMissionSection />
              <InviteFriendSection />
            </>
          )}
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
