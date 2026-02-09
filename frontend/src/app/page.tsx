'use client'

import { Profile } from '@/components/Profile'

import { Button } from '@/components/ui/Button/Button'
import {
  Content,
  Section,
  SectionTitle,
  AchievementsGrid,
  TopAchievementsContainer,
  TopAchievementItem,
  TopAchievementRank,
  TopAchievementInfo,
  TopAchievementName,
  TopAchievementUser,
  TopAchievementXP,
} from './page.styled'
import { mockUser, mockAchievements } from './page.constants'
import { AchievementCard } from '@/components/AchievementCard/AchievementCard'
import Container from '@/components/Container/Container'


const topAchievements = [
  { rank: 1, name: 'DragonSlayer', user: 'GamerPro', xp: 15000, title: 'Драконоборец' },
  { rank: 2, name: 'NightOwl', user: 'ShadowNinja', xp: 12400, title: 'Ночной сов' },
  { rank: 3, name: 'SpeedRunner', user: 'FlashGamer', xp: 9850, title: 'Спидраннер' },
]

export default function Home() {
  return (
    <Container>
      <Content>
        <Section>
          <SectionTitle>Профиль</SectionTitle>
          <Profile user={mockUser} />
        </Section>

        <Section>
          <SectionTitle>🏅 Лучшие достижения</SectionTitle>
          <TopAchievementsContainer>
            {topAchievements.map((achievement, index) => (
              <TopAchievementItem
                key={achievement.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TopAchievementRank>{achievement.rank}</TopAchievementRank>
                <TopAchievementInfo>
                  <TopAchievementName>{achievement.title}</TopAchievementName>
                  <TopAchievementUser>{achievement.user}</TopAchievementUser>
                  <TopAchievementXP>+{achievement.xp.toLocaleString()} XP</TopAchievementXP>
                </TopAchievementInfo>
              </TopAchievementItem>
            ))}
          </TopAchievementsContainer>
        </Section>

        <Section>
          <SectionTitle>Достижения</SectionTitle>
          <AchievementsGrid>
            {mockAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={index < 2}
              />
            ))}
          </AchievementsGrid>
        </Section>

        <Section>
          <SectionTitle>Начни свой путь</SectionTitle>
          <Button size="lg" onClick={() => console.log('clicked')}>
            Создать профиль
          </Button>
        </Section>
      </Content>
    </Container>
  )
}
