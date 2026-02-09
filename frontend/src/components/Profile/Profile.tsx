import { motion } from 'framer-motion'
import { User } from '@/types'
import { ProfileProps } from './types'
import {
  ProfileContainer,
  Avatar,
  Username,
  Level,
  XPBar,
  XPProgress,
  XPText,
  Stats,
  StatItem,
  StatValue,
  StatLabel,
} from './styled'

export const Profile = ({ user }: ProfileProps) => {
  const xpToNextLevel = Math.pow(user.level, 2) * 100
  const currentLevelXP = Math.pow(user.level - 1, 2) * 100
  const progress = ((user.xp - currentLevelXP) / (xpToNextLevel - currentLevelXP)) * 100

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Avatar>👤</Avatar>
      <Username>{user.username}</Username>
      <Level>Уровень {user.level}</Level>
      <XPBar>
        <XPProgress
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </XPBar>
      <XPText>{user.xp} / {xpToNextLevel} XP</XPText>
      <Stats>
        <StatItem>
          <StatValue>0</StatValue>
          <StatLabel>Достижений</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>0</StatValue>
          <StatLabel>Категорий</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{user.level}</StatValue>
          <StatLabel>Уровень</StatLabel>
        </StatItem>
      </Stats>
    </ProfileContainer>
  )
}
