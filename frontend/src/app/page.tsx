'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { ShowcaseAside } from '@/components/ShowcaseAside'
import { DailyMissionSection } from '@/components/DailyMissionSection'
import {
  Content,
  MainSection,
  AsideSection,
} from './page.styled'
import Container from '@/components/Container/Container'
import styled from 'styled-components'

const WelcomeSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
`

const WelcomeTitle = styled.h1`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
`

const WelcomeText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
  margin: 0;
  line-height: 1.6;
`

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showcaseFilter, setShowcaseFilter] = useState<'best' | 'recent' | 'mine'>('best')

  // Редирект на ленту
  useEffect(() => {
    router.push('/feed')
  }, [router])

  // Если пользователь не авторизован и выбран фильтр "mine", переключаем на "best"
  const handleFilterChange = (filter: 'best' | 'recent' | 'mine') => {
    if (!isAuthenticated && filter === 'mine') {
      setShowcaseFilter('best')
    } else {
      setShowcaseFilter(filter)
    }
  }

  return (
    <Container>
      <Content>
        <MainSection>
          <WelcomeSection>
            <WelcomeTitle>Добро пожаловать в Trofy</WelcomeTitle>
            <WelcomeText>
              Отслеживайте свои достижения, соревнуйтесь с друзьями и достигайте новых высот!
            </WelcomeText>
          </WelcomeSection>
          {isAuthenticated && user && (
            <>
              <DailyMissionSection />
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
