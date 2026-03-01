'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IoTrophy, IoTime, IoPerson } from 'react-icons/io5'
import { useGetShowcaseAchievementsQuery } from '@/store/api/achievementsApi'
import { useGetRecentAchievementsQuery } from '@/store/api/userApi'
import { useGetMeQuery } from '@/store/api/userApi'
import { formatDistanceToNow, format, isToday } from 'date-fns'
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
  TrophyHeaderWrap,
  ShowcaseTitleContent,
  TrophiesEmptyState,
} from './styled'

interface ShowcaseAsideProps {
  filter?: 'best' | 'recent' | 'mine'
  onFilterChange?: (filter: 'best' | 'recent' | 'mine') => void
  isAuthenticated?: boolean
}

export const ShowcaseAside = ({ filter = 'best', onFilterChange, isAuthenticated = true }: ShowcaseAsideProps) => {
  const router = useRouter()
  // Если не авторизован и выбран фильтр "mine", используем "best"
  const activeFilter = (!isAuthenticated && filter === 'mine') ? 'best' : filter

  // Определяем, десктоп ли это (> 1024px)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1024
    }
    return false
  })

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 1024)
    }
    
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  const { data: currentUser } = useGetMeQuery(undefined, { skip: !isAuthenticated })

  // Для десктопа показываем 5, для планшета 10 (как сейчас)
  const limit = isDesktop ? 5 : 10

  // Функция форматирования даты: если сегодня - время, иначе - дата
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Недавно'
    const date = new Date(dateString)
    if (isToday(date)) {
      // Если сегодня - показываем относительное время
      return formatDistanceToNow(date, { addSuffix: true, locale: ru })
    } else {
      // Если не сегодня - показываем дату
      return format(date, 'd MMMM yyyy', { locale: ru })
    }
  }

  // Получаем лучшие достижения (глобальные, среди всех пользователей)
  const { data: bestAchievementsData, isLoading: isLoadingBest } = useGetShowcaseAchievementsQuery(
    {
      type: 'best',
      limit: 10, // Всегда запрашиваем 10, но показываем только нужное количество
    },
    { skip: activeFilter !== 'best' }
  )

  // Получаем последние достижения (глобальные, среди всех пользователей)
  const { data: recentAchievementsData, isLoading: isLoadingRecent } = useGetShowcaseAchievementsQuery(
    {
      type: 'recent',
      limit: 10, // Всегда запрашиваем 10, но показываем только нужное количество
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
    const seen = new Set<string>()
    return bestAchievementsData
      .filter((achievement) => {
        if (seen.has(achievement.id)) return false
        seen.add(achievement.id)
        // Фильтруем достижения закрытых пользователей (если owner имеет privacy_settings)
        if (!achievement.is_current_user && achievement.owner && (achievement.owner as any).privacy_settings) {
          const privacy = (achievement.owner as any).privacy_settings
          if (privacy.show_profile === false) return false
        }
        return true
      })
      .map((achievement) => ({
        id: achievement.id,
        name: achievement.title,
        rarity: achievement.rarity,
        owner: achievement.is_current_user ? 'Вы' : achievement.owner.username,
        ownerUsername: achievement.is_current_user ? (currentUser?.username || '') : achievement.owner.username,
        date: formatDate(achievement.completion_date || achievement.unlocked_at),
        icon: achievement.icon_url || '🏆',
        categoryId: achievement.category.id,
      }))
  }, [bestAchievementsData, currentUser])

  const recentTrophies = useMemo(() => {
    if (!recentAchievementsData) return []
    // Убираем дубликаты по ID
    const seen = new Set<string>()
    const unique = recentAchievementsData.filter((achievement) => {
      if (seen.has(achievement.id)) return false
      seen.add(achievement.id)
      // Фильтруем достижения закрытых пользователей (если owner имеет privacy_settings)
      if (!achievement.is_current_user && achievement.owner && (achievement.owner as any).privacy_settings) {
        const privacy = (achievement.owner as any).privacy_settings
        if (privacy.show_profile === false) return false
      }
      return true
    })
    // Сортируем по completion_date (самые новые первыми)
    const sorted = [...unique].sort((a, b) => {
      const dateA = a.completion_date ? new Date(a.completion_date).getTime() : 0
      const dateB = b.completion_date ? new Date(b.completion_date).getTime() : 0
      return dateB - dateA // По убыванию (новые первыми)
    })

    return sorted.map((achievement) => ({
      id: achievement.id,
      name: achievement.title,
      rarity: achievement.rarity,
      owner: achievement.is_current_user ? 'Вы' : achievement.owner.username,
      ownerUsername: achievement.is_current_user ? (currentUser?.username || '') : achievement.owner.username,
      date: formatDate(achievement.completion_date || achievement.unlocked_at),
      icon: achievement.icon_url || '🏆',
      categoryId: achievement.category.id,
    }))
  }, [recentAchievementsData, currentUser])

  const myTrophies = useMemo(() => {
    if (!myAchievementsData || !currentUser) return []
    // myAchievementsData - это массив RecentAchievement из /users/me/achievements/recent
    // Это достижения текущего пользователя, поэтому всегда "Вы"
    const seen = new Set<string>()
    return myAchievementsData
      .filter((achievement) => {
        if (seen.has(achievement.id)) return false
        seen.add(achievement.id)
        return achievement.is_achieved
      })
      .map((achievement) => ({
        id: achievement.id,
        name: achievement.title,
        rarity: achievement.rarity,
        owner: 'Вы',
        ownerUsername: currentUser?.username || '',
        date: formatDate(achievement.unlocked_at),
        icon: achievement.icon_url || '🏆',
        categoryId: achievement.category.id,
      }))
  }, [myAchievementsData, currentUser])

  const getTrophies = useMemo(() => {
    let result: typeof trophies = []
    switch (activeFilter) {
      case 'recent':
        result = recentTrophies
        break
      case 'mine':
        result = myTrophies
        break
      default:
        result = trophies
    }
    // На десктопе всегда ограничиваем до 5, на планшете все
    // Применяем ограничение всегда, чтобы избежать проблем с кэшированием
    const limited = isDesktop ? result.slice(0, 5) : result
    // Убеждаемся, что возвращаем новый массив, чтобы избежать проблем с React
    return [...limited]
  }, [activeFilter, trophies, recentTrophies, myTrophies, isDesktop])

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
          <ShowcaseTitleContent>
            {getIcon()} {getTitle()}
          </ShowcaseTitleContent>
        </ShowcaseTitle>
        {onFilterChange && (
          <ToggleContainer>
            <SwitchOption
              active={activeFilter === 'best'}
              onClick={() => handleFilterChange('best')}
              position="left"
            >
              <IoTrophy /> Лучшие
            </SwitchOption>
            <SwitchOption
              active={activeFilter === 'recent'}
              onClick={() => handleFilterChange('recent')}
              position={isAuthenticated ? 'center' : 'right'}
            >
              <IoTime /> Последние
            </SwitchOption>
            {isAuthenticated && (
              <SwitchOption
                active={activeFilter === 'mine'}
                onClick={() => handleFilterChange('mine')}
                position="right"
              >
                <IoPerson /> Мои
              </SwitchOption>
            )}

          </ToggleContainer>
        )}
      </ShowcaseHeader>

      <TrophiesList>
        <TrophiesScrollTrack>
          {isLoading ? (
            <TrophiesEmptyState>
              Загрузка...
            </TrophiesEmptyState>
          ) : getTrophies.length === 0 ? (
            <TrophiesEmptyState>
              {!isAuthenticated && activeFilter !== 'best' ? 'Войдите, чтобы увидеть достижения' : 'Достижения не найдены'}
            </TrophiesEmptyState>
          ) : (
            getTrophies.map((trophy, index) => (
              <TrophyItem
                key={`${activeFilter}-${trophy.id}-${index}`}
                rarity={trophy.rarity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                layout
                onClick={() => {
                  if (trophy.categoryId && trophy.ownerUsername) {
                    router.push(`/user/${trophy.ownerUsername}/achievements/${trophy.categoryId}/${trophy.id}`)
                  }
                }}
              >
                <TrophyHeader rarity={trophy.rarity}>
                  <TrophyHeaderWrap>
                    <TrophyIcon>{renderIcon(trophy.icon, 'trophy')}</TrophyIcon>
                    <TrophyRarity rarity={trophy.rarity}>
                      {trophy.rarity.toUpperCase()}
                    </TrophyRarity>
                  </TrophyHeaderWrap>
                  <TrophyHeaderInfo>
                    <TrophyOwner>{trophy.owner}</TrophyOwner>
                    <TrophyDate>{trophy.date}</TrophyDate>
                  </TrophyHeaderInfo>
                </TrophyHeader>
                <TrophyContent>
                  <TrophyInfo>
                    <TrophyName>{trophy.name}</TrophyName>

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
