'use client'

import { SectionMarker } from '@/components/SectionMarker'
import { useGetRecentAchievementsQuery } from '@/store/api/userApi'
import { formatRelativeDate } from '@/lib/utils/dateUtils'
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
import { renderIcon } from '@/lib/utils/iconUtils'

export const RecentTrophiesSection = () => {
  const { data: achievements, isLoading } = useGetRecentAchievementsQuery(6)
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

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          Загрузка...
        </div>
      ) : !achievements || achievements.length === 0 || achievements
        .filter((achievement) => achievement.is_achieved).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          У вас пока нет достижений
        </div>
      ) : (
        <TrophiesGrid>
          {achievements
            .filter((achievement) => achievement.is_achieved)
            .map((achievement, index) => (
              <TrophyItem
                key={achievement.id}
                rarity={achievement.rarity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <TrophyIcon rarity={achievement.rarity}>
                  {achievement.icon_url && renderIcon(achievement.icon_url, 'trophy')}
                </TrophyIcon>
                <TrophyContent>
                  <TrophyName>{achievement.title}</TrophyName>
                  <TrophyDate>
                    {achievement.unlocked_at
                      ? formatRelativeDate(achievement.unlocked_at)
                      : 'Дата недоступна'}
                  </TrophyDate>
                  <TrophyRarity rarity={achievement.rarity}>
                    {achievement.rarity.toUpperCase()}
                  </TrophyRarity>
                </TrophyContent>
              </TrophyItem>
            ))}
        </TrophiesGrid>
      )}
    </Container>
  )
}
