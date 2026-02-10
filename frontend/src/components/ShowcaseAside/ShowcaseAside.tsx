'use client'


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

interface Trophy {
  id: string
  name: string
  rarity: 'base' | 'rare' | 'epic' | 'legendary'
  owner: string
  date: string
  icon: string
}

const trophies: Trophy[] = [
  { id: '1', name: 'Эльбрус', rarity: 'legendary', owner: 'AlexM', date: '2 дня назад', icon: '🏔️' },
  { id: '2', name: 'Sky Diver', rarity: 'epic', owner: 'NinjaX', date: '1 неделя назад', icon: '🪂' },
  { id: '3', name: 'Night Owl', rarity: 'rare', owner: 'WolfPack', date: '3 дня назад', icon: '🦉' },
  { id: '4', name: 'First Flight', rarity: 'base', owner: 'Birdie', date: '5 дней назад', icon: '✈️' },
  { id: '5', name: 'Road Master', rarity: 'rare', owner: 'Speedy', date: '1 день назад', icon: '🚗' },
]

const recentTrophies: Trophy[] = [
  { id: '6', name: 'Прыжок с парашютом', rarity: 'epic', owner: 'Adrenaline', date: 'Сегодня', icon: '🪂' },
  { id: '7', name: 'Права категории B', rarity: 'base', owner: 'Novice', date: 'Вчера', icon: '🚗' },
  { id: '8', name: 'Первое путешествие', rarity: 'rare', owner: 'Explorer', date: '2 дня назад', icon: '✈️' },
  { id: '9', name: 'Марафон 10км', rarity: 'rare', owner: 'Runner', date: '3 дня назад', icon: '🏃' },
  { id: '10', name: 'Высшее образование', rarity: 'legendary', owner: 'Scholar', date: '1 неделя назад', icon: '🎓' },
]

const myTrophies: Trophy[] = [
  { id: '11', name: 'Путешественник', rarity: 'rare', owner: 'Вы', date: '2 дня назад', icon: '✈️' },
  { id: '12', name: 'Водитель', rarity: 'base', owner: 'Вы', date: '5 дней назад', icon: '🚗' },
  { id: '13', name: 'Спортсмен', rarity: 'rare', owner: 'Вы', date: '1 неделя назад', icon: '🏃' },
  { id: '14', name: 'Высшее образование', rarity: 'legendary', owner: 'Вы', date: '1 месяц назад', icon: '🎓' },
  { id: '15', name: 'Альпинист', rarity: 'epic', owner: 'Вы', date: '2 месяца назад', icon: '🏔️' },
]

interface ShowcaseAsideProps {
  filter?: 'best' | 'recent' | 'mine'
  onFilterChange?: (filter: 'best' | 'recent' | 'mine') => void
}

export const ShowcaseAside = ({ filter = 'best', onFilterChange }: ShowcaseAsideProps) => {
  const getTrophies = () => {
    switch (filter) {
      case 'recent':
        return recentTrophies
      case 'mine':
        return myTrophies
      default:
        return trophies
    }
  }

  const getTitle = () => {
    switch (filter) {
      case 'recent':
        return 'Последние трофеи'
      case 'mine':
        return 'Мои трофеи'
      default:
        return 'Лучшие трофеи'
    }
  }

  const getIcon = () => {
    switch (filter) {
      case 'recent':
        return '🆕'
      case 'mine':
        return '👤'
      default:
        return '🏆'
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
        <ShowcaseTitle>{getIcon()} {getTitle()}</ShowcaseTitle>
        {onFilterChange && (
          <ToggleContainer>
            <SwitchOption
              active={filter === 'best'}
              onClick={() => handleFilterChange('best')}
              position="left"
            >
              🏆 Лучшие
            </SwitchOption>
            <SwitchOption
              active={filter === 'recent'}
              onClick={() => handleFilterChange('recent')}
              position="center"
            >
              🆕 Последние
            </SwitchOption>
            <SwitchOption
              active={filter === 'mine'}
              onClick={() => handleFilterChange('mine')}
              position="right"
            >
              👤 Мои
            </SwitchOption>

          </ToggleContainer>
        )}
      </ShowcaseHeader>

      <TrophiesList>
        <TrophiesScrollTrack>
          {getTrophies().map((trophy, index) => (
            <TrophyItem
              key={trophy.id}
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
