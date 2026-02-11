'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Profile } from '@/components/Profile'
import { ShowcaseAside } from '@/components/ShowcaseAside'
import { RecentTrophiesSection } from '@/components/RecentTrophiesSection'
import { InviteFriendSection } from '@/components/InviteFriendSection'
import { DailyMissionSection } from '@/components/DailyMissionSection'
import {
  Content,
  MainSection,
  AsideSection,
} from './page.styled'
import Container from '@/components/Container/Container'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showcaseFilter, setShowcaseFilter] = useState<'best' | 'recent' | 'mine'>('best')

  // Если пользователь не авторизован и выбран фильтр "mine", переключаем на "best"
  const handleFilterChange = (filter: 'best' | 'recent' | 'mine') => {
    if (!isAuthenticated && filter === 'mine') {
      setShowcaseFilter('best')
    } else {
      setShowcaseFilter(filter)
    }
  }

  // Создаем пустого пользователя для неавторизованных
  const emptyUser = {
    id: '',
    username: 'Гость',
    xp: 0,
    level: 1,
    profile_theme: {
      profile_color: 'dark' as const,
    },
    privacy_settings: {
      show_achievements: true,
      show_level: true,
      show_profile: true,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const displayUser = isAuthenticated && user ? user : emptyUser

  return (
    <Container>
      <Content>
        <MainSection>
          <Profile
            user={displayUser}
            isAuthenticated={isAuthenticated}
            onLoginClick={() => router.push('/auth/login')}
          />
          {isAuthenticated && user && (
            <>
              <DailyMissionSection />
              <RecentTrophiesSection />
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
