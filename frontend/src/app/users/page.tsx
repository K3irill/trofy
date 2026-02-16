'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoSearch, IoPeople, IoStar, IoTrophy, IoFlame, IoTime, IoCloseCircle } from 'react-icons/io5'
import Container from '@/components/Container/Container'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { useSearchUsersQuery, useGetTopUsersQuery } from '@/store/api/userApi'
import {
  PageHeader,
  Title,
  TitleIcon,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FiltersContainer,
  FilterButton,
  UsersGrid,
  UserCard,
  UserHeader,
  Avatar,
  UserInfo,
  Username,
  UserBio,
  UserStats,
  StatBadge,
  StatValue,
  StatLabel,
  TopUsersSection,
  TopUsersGrid,
  TopUserCard,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateSubtext,
} from './page.styled'

type SortBy = 'level' | 'achievements' | 'recent'

export default function UsersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('level')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: topUsers, isLoading: topUsersLoading } = useGetTopUsersQuery({ limit: 3 })
  const { data: searchResults, isLoading: searchLoading } = useSearchUsersQuery(
    { query: debouncedSearch, limit: 20 },
    { skip: !debouncedSearch || debouncedSearch.trim().length === 0 }
  )

  const showTopUsers = !debouncedSearch || debouncedSearch.trim().length === 0
  const users = showTopUsers ? topUsers : searchResults

  const sortedUsers = useMemo(() => {
    if (!users) return []

    const sorted = [...users]

    switch (sortBy) {
      case 'level':
        return sorted.sort((a, b) => (b.level || 0) - (a.level || 0))
      case 'achievements':
        // Нужно будет добавить статистику достижений
        return sorted
      case 'recent':
        // Нужно будет добавить дату последней активности
        return sorted
      default:
        return sorted
    }
  }, [users, sortBy])

  const handleUserClick = (username: string) => {
    router.push(`/user/${username}/`)
  }

  return (
    <Container>
      <PageHeader>
        <Title>
          <TitleIcon as={IoPeople} />
          Поиск людей
        </Title>

        <SearchContainer>
          <SearchIcon>
            <IoSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Поиск по имени пользователя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        {!showTopUsers && (
          <FiltersContainer>
            <FilterButton $active={sortBy === 'level'} onClick={() => setSortBy('level')}>
              <IoStar /> По уровню
            </FilterButton>
            <FilterButton $active={sortBy === 'achievements'} onClick={() => setSortBy('achievements')}>
              <IoTrophy /> По достижениям
            </FilterButton>
            <FilterButton $active={sortBy === 'recent'} onClick={() => setSortBy('recent')}>
              <IoTime /> Недавно активные
            </FilterButton>
          </FiltersContainer>
        )}
      </PageHeader>

      {showTopUsers && (
        <TopUsersSection>
          <Title style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            <TitleIcon as={IoFlame} />
            Топ пользователей
          </Title>
          {topUsersLoading ? (
            <BlockLoader text="Загрузка топ пользователей..." />
          ) : topUsers && topUsers.length > 0 ? (
            <TopUsersGrid>
              {topUsers.map((user, index) => (
                <TopUserCard
                  key={user.id}
                  $rank={index + 1}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleUserClick(user.username)}
                >
                  <UserHeader>
                    <Avatar $level={user.level}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <UserInfo>
                      <Username>{user.username}</Username>
                      {user.bio && <UserBio>{user.bio}</UserBio>}
                    </UserInfo>
                  </UserHeader>
                  <UserStats>
                    <StatBadge>
                      <StatValue>{user.level || 1}</StatValue>
                      <StatLabel>Уровень</StatLabel>
                    </StatBadge>
                    <StatBadge>
                      <StatValue>{user.xp || 0}</StatValue>
                      <StatLabel>XP</StatLabel>
                    </StatBadge>
                  </UserStats>
                </TopUserCard>
              ))}
            </TopUsersGrid>
          ) : null}
        </TopUsersSection>
      )}

      {!showTopUsers && (
        <>
          {searchLoading ? (
            <BlockLoader text="Поиск пользователей..." />
          ) : sortedUsers && sortedUsers.length > 0 ? (
            <UsersGrid>
              <AnimatePresence>
                {sortedUsers.map((user, index) => (
                  <UserCard
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleUserClick(user.username)}
                  >
                    <UserHeader>
                      <Avatar $level={user.level}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <UserInfo>
                        <Username>{user.username}</Username>
                        {user.bio && <UserBio>{user.bio}</UserBio>}
                      </UserInfo>
                    </UserHeader>
                    <UserStats>
                      <StatBadge>
                        <StatValue>{user.level || 1}</StatValue>
                        <StatLabel>Уровень</StatLabel>
                      </StatBadge>
                      <StatBadge>
                        <StatValue>{user.xp || 0}</StatValue>
                        <StatLabel>XP</StatLabel>
                      </StatBadge>
                    </UserStats>
                  </UserCard>
                ))}
              </AnimatePresence>
            </UsersGrid>
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <IoSearch />
              </EmptyStateIcon>
              <EmptyStateText>Пользователи не найдены</EmptyStateText>
              <EmptyStateSubtext>Попробуйте изменить запрос поиска</EmptyStateSubtext>
            </EmptyState>
          )}
        </>
      )}
    </Container>
  )
}
