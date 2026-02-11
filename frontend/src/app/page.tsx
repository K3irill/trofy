'use client'

import { useEffect, useState } from 'react'
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
import { mockUser } from './page.constants'
import Container from '@/components/Container/Container'
import { useNotificationContext } from '@/contexts/NotificationContext'

export default function Home() {
  const [showcaseFilter, setShowcaseFilter] = useState<'best' | 'recent' | 'mine'>('best')


  const { addToast } = useNotificationContext()
  useEffect(() => {
    addToast('Сообщение 2', 'success', 3000)

  }, [])

  return (
    <Container>
      <Content>
        <MainSection>
          <Profile user={mockUser} />
          <DailyMissionSection />
          <RecentTrophiesSection />
          <InviteFriendSection />
        </MainSection>

        <AsideSection>
          <ShowcaseAside
            filter={showcaseFilter}
            onFilterChange={setShowcaseFilter}
          />
        </AsideSection>
      </Content>
    </Container>
  )
}
