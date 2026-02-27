'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useGetUserByUsernameQuery, useGetUserStatsByUsernameQuery } from '@/store/api/userApi'
import { Profile } from '@/components/Profile'
import { ShowcaseAside } from '@/components/ShowcaseAside'
import { RecentTrophiesSection } from '@/components/RecentTrophiesSection'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import {
  Content,
  MainSection,
  AsideSection,
  } from '../../page.styled'
import styled from 'styled-components'

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
  min-height: 200px;
`

const ErrorWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${(props) => props.theme.colors.light[100]};
`

const ErrorTitle = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const ErrorText = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1rem;
  margin: 0;
`

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
  const isProfileHidden = user && !user.privacy_settings?.show_profile && !isOwnProfile
  
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
        <LoaderWrapper>
          <BlockLoader text="Загрузка профиля..." />
        </LoaderWrapper>
      </Container>
    )
  }

  if (error) {
    if ('status' in error && error.status === 403) {
      return (
        <Container>
          <ErrorWrapper>
            <ErrorTitle>Профиль приватный</ErrorTitle>
            <ErrorText>Этот пользователь скрыл свой профиль от просмотра.</ErrorText>
          </ErrorWrapper>
        </Container>
      )
    }
    return (
      <Container>
        <ErrorWrapper>
          <ErrorText>Пользователь не найден</ErrorText>
        </ErrorWrapper>
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
          {!isProfileHidden && <RecentTrophiesSection username={username} isOwnProfile={isOwnProfile} />}
          {isOwnProfile && (
            <>
              {/* <DailyMissionSection />
              <InviteFriendSection /> */}
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
