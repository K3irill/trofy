'use client'

import { useMemo } from 'react'
import { IoTrophy, IoTime, IoPerson } from 'react-icons/io5'
import { useGetShowcaseAchievementsQuery } from '@/store/api/achievementsApi'
import { useGetRecentAchievementsQuery } from '@/store/api/userApi'
import { useGetMeQuery } from '@/store/api/userApi'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { renderIcon } from '@/lib/utils/iconUtils'
import {
  ShowcaseContainer,
  ShowcaseHeader,
  ShowcaseTitle,
  ToggleContainer,
  SwitchOption,
  TrophiesList,
  TrophiesScrollTrack,
  TrophyItem,
  TrophyContent,
  TrophyHeader,
  TrophyIcon,
  TrophyInfo,
  TrophyName,
  TrophyRarity,
  TrophyOwner,
  TrophyDate,
  TrophyHeaderInfo,
} from './styled'

interface ShowcaseAsideProps {
  filter?: 'best' | 'recent' | 'mine'
  onFilterChange?: (filter: 'best' | 'recent' | 'mine') => void
  isAuthenticated?: boolean
}

export const ShowcaseAside = ({ filter = 'best', onFilterChange, isAuthenticated = true }: ShowcaseAsideProps) => {
  // Если не авторизован и выбран фильтр "mine", используем "best"
  const activeFilter = (!isAuthenticated && filter === 'mine') ? 'best' : filter

  const { data: currentUser } = useGetMeQuery(undefined, { skip: !isAuthenticated })

  // Получаем лучшие достижения (глобальные, среди всех пользователей)
  const { data: bestAchievementsData, isLoading: isLoadingBest } = useGetShowcaseAchievementsQuery(
    {
      type: 'best',
      limit: 10,
    },
    { skip: activeFilter !== 'best' }
  )

  // Получаем последние достижения (глобальные, среди всех пользователей)
  const { data: recentAchievementsData, isLoading: isLoadingRecent } = useGetShowcaseAchievementsQuery(
    {
      type: 'recent',
      limit: 10,
    },
    { skip: activeFilter !== 'recent' }
  )

  // Получаем мои достижения (только текущего пользователя)
  const { data: myAchievementsData, isLoading: isLoadingMine } = useGetRecentAchievementsQuery(10, {
    skip: !isAuthenticated || activeFilter !== 'mine',
  })

  const isLoading = isLoadingBest || isLoadingRecent || isLoadingMine

  const trophies = useMemo(() => {
    if (!bestAchievementsData) return []
    return bestAchievementsData.map((achievement) => ({
      id: achievement.id,
      name: achievement.title,
      rarity: achievement.rarity,
      owner: achievement.is_current_user ? 'Вы' : achievement.owner.username,
      date: achievement.unlocked_at
        ? formatDistanceToNow(new Date(achievement.unlocked_at), { addSuffix: true, locale: ru })
        : 'Недавно',
      icon: achievement.icon_url || '🏆',
    }))
  }, [bestAchievementsData])

  const recentTrophies = useMemo(() => {
    if (!recentAchievementsData) return []
    // Сортируем по completion_date (самые новые первыми)
    const sorted = [...recentAchievementsData].sort((a, b) => {
      const dateA = a.completion_date ? new Date(a.completion_date).getTime() : 0
      const dateB = b.completion_date ? new Date(b.completion_date).getTime() : 0
      return dateB - dateA // По убыванию (новые первыми)
    })

    return sorted.map((achievement) => ({
      id: achievement.id,
      name: achievement.title,
      rarity: achievement.rarity,
      owner: achievement.is_current_user ? 'Вы' : achievement.owner.username,
      date: achievement.completion_date
        ? formatDistanceToNow(new Date(achievement.completion_date), { addSuffix: true, locale: ru })
        : achievement.unlocked_at
          ? formatDistanceToNow(new Date(achievement.unlocked_at), { addSuffix: true, locale: ru })
          : 'Недавно',
      icon: achievement.icon_url || '🏆',
    }))
  }, [recentAchievementsData])

  const myTrophies = useMemo(() => {
    if (!myAchievementsData || !currentUser) return []
    // myAchievementsData - это массив RecentAchievement из /users/me/achievements/recent
    // Это достижения текущего пользователя, поэтому всегда "Вы"
    return myAchievementsData
      .filter((achievement) => achievement.is_achieved)
      .map((achievement) => ({
        id: achievement.id,
        name: achievement.title,
        rarity: achievement.rarity,
        owner: 'Вы',
        date: achievement.unlocked_at
          ? formatDistanceToNow(new Date(achievement.unlocked_at), { addSuffix: true, locale: ru })
          : 'Недавно',
        icon: achievement.icon_url || '🏆',
      }))
  }, [myAchievementsData, currentUser])

  const getTrophies = () => {
    switch (activeFilter) {
      case 'recent':
        return recentTrophies
      case 'mine':
        return myTrophies
      default:
        return trophies
    }
  }

  const getTitle = () => {
    switch (activeFilter) {
      case 'recent':
        return 'Последние трофеи'
      case 'mine':
        return 'Мои трофеи'
      default:
        return 'Лучшие трофеи'
    }
  }

  const getIcon = () => {
    switch (activeFilter) {
      case 'recent':
        return <IoTime />
      case 'mine':
        return <IoPerson />
      default:
        return <IoTrophy />
    }
  }

  const handleFilterChange = (newFilter: 'best' | 'recent' | 'mine') => {
    if (onFilterChange) {
      onFilterChange(newFilter)
    }
  }

  return (
    <ShowcaseContainer
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ShowcaseHeader>
        <ShowcaseTitle>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {getIcon()} {getTitle()}
          </span>
        </ShowcaseTitle>
        {onFilterChange && (
          <ToggleContainer>
            <SwitchOption
              active={activeFilter === 'best'}
              onClick={() => handleFilterChange('best')}
              position="left"
            >
              <IoTrophy style={{ marginRight: '0.25rem' }} /> Лучшие
            </SwitchOption>
            <SwitchOption
              active={activeFilter === 'recent'}
              onClick={() => handleFilterChange('recent')}
              position={isAuthenticated ? 'center' : 'right'}
            >
              <IoTime style={{ marginRight: '0.25rem' }} /> Последние
            </SwitchOption>
            {isAuthenticated && (
              <SwitchOption
                active={activeFilter === 'mine'}
                onClick={() => handleFilterChange('mine')}
                position="right"
              >
                <IoPerson style={{ marginRight: '0.25rem' }} /> Мои
              </SwitchOption>
            )}

          </ToggleContainer>
        )}
      </ShowcaseHeader>

      <TrophiesList>
        <TrophiesScrollTrack>
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary, #666)' }}>
              Загрузка...
            </div>
          ) : getTrophies().length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary, #666)' }}>
              {!isAuthenticated && activeFilter !== 'best' ? 'Войдите, чтобы увидеть достижения' : 'Достижения не найдены'}
            </div>
          ) : (
            getTrophies().map((trophy, index) => (
              <TrophyItem
                key={trophy.id}
                rarity={trophy.rarity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <TrophyHeader rarity={trophy.rarity}>
                  <TrophyIcon>{renderIcon(trophy.icon, 'trophy')}</TrophyIcon>
                  <TrophyHeaderInfo>
                    <TrophyOwner>{trophy.owner}</TrophyOwner>
                    <TrophyDate>{trophy.date}</TrophyDate>
                  </TrophyHeaderInfo>
                </TrophyHeader>
                <TrophyContent>
                  <TrophyInfo>
                    <TrophyName>{trophy.name}</TrophyName>
                    <TrophyRarity rarity={trophy.rarity}>
                      {trophy.rarity.toUpperCase()}
                    </TrophyRarity>
                  </TrophyInfo>
                  <TrophyOwner>{trophy.owner}</TrophyOwner>
                  <TrophyDate>{trophy.date}</TrophyDate>
                </TrophyContent>
              </TrophyItem>
            ))
          )}
          {/* Дублируем для бесконечного скролла на мобилке */}
          {/* <DuplicateItems>
            {getTrophies().map((trophy, index) => (
              <TrophyItem
                key={`${trophy.id}-duplicate`}
                rarity={trophy.rarity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <TrophyHeader rarity={trophy.rarity}>
                  <TrophyIcon>{trophy.icon}</TrophyIcon>
                  <TrophyHeaderInfo>
                    <TrophyOwner>👤 {trophy.owner}</TrophyOwner>
                    <TrophyDate>📅 {trophy.date}</TrophyDate>
                  </TrophyHeaderInfo>
                </TrophyHeader>
                <TrophyContent>
                  <TrophyInfo>
                    <TrophyName>{trophy.name}</TrophyName>
                    <TrophyRarity rarity={trophy.rarity}>
                      {trophy.rarity.toUpperCase()}
                    </TrophyRarity>
                  </TrophyInfo>
                  <TrophyOwner>👤 {trophy.owner}</TrophyOwner>
                  <TrophyDate>📅 {trophy.date}</TrophyDate>
                </TrophyContent>
              </TrophyItem>
            ))}
          </DuplicateItems> */}
        </TrophiesScrollTrack>
      </TrophiesList>
    </ShowcaseContainer>
  )
}
