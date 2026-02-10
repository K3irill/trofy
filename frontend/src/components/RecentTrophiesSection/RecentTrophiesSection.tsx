'use client'

import { SectionMarker } from '@/components/SectionMarker'
import {
  Container,
  SectionHeader,
  SectionTitle,
  ShowAllButton,
  TrophiesGrid,
  TrophyItem,
  TrophyIcon,
  TrophyContent,
  TrophyName,
  TrophyDate,
  TrophyRarity,
} from './styled'

interface Trophy {
  id: string
  name: string
  rarity: 'base' | 'rare' | 'epic' | 'legendary'
  date: string
  icon: string
}

const recentTrophies: Trophy[] = [
  { id: '1', name: 'Первое путешествие', rarity: 'rare', date: '2 дня назад', icon: '✈️' },
  { id: '2', name: 'Права категории B', rarity: 'base', date: '5 дней назад', icon: '🚗' },
  { id: '3', name: 'Прыжок с парашютом', rarity: 'epic', date: '1 неделя назад', icon: '🪂' },
  { id: '4', name: 'Первый марафон', rarity: 'rare', date: '2 недели назад', icon: '🏃' },
  { id: '5', name: 'Высшее образование', rarity: 'legendary', date: '1 месяц назад', icon: '🎓' },
]

export const RecentTrophiesSection = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SectionMarker />
          <SectionTitle>Мои последние <b>достижения</b></SectionTitle>
        </div>
        <ShowAllButton whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
          Показать все →
        </ShowAllButton>
      </SectionHeader>

      <TrophiesGrid>
        {recentTrophies.map((trophy, index) => (
          <TrophyItem
            key={trophy.id}
            rarity={trophy.rarity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <TrophyIcon rarity={trophy.rarity}>{trophy.icon}</TrophyIcon>
            <TrophyContent>
              <TrophyName>{trophy.name}</TrophyName>
              <TrophyDate>{trophy.date}</TrophyDate>
              <TrophyRarity rarity={trophy.rarity}>{trophy.rarity.toUpperCase()}</TrophyRarity>
            </TrophyContent>
          </TrophyItem>
        ))}
      </TrophiesGrid>
    </Container>
  )
}
