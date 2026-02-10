import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Rarity } from '@/types'
import { AchievementCardProps } from './types'
import {
  CardContainer,
  CardBody,
  IconContainer,
  Title,
  Description,
  XPReward,
  RarityBadge,
} from './styled'

export const AchievementCard = ({ achievement, unlocked = false, onClick }: AchievementCardProps) => {
  const icons = {
    [Rarity.BASE]: '🧑‍💼',
    [Rarity.RARE]: '💎',
    [Rarity.EPIC]: '⚡',
    [Rarity.LEGENDARY]: '👑',
  }

  return (
    <CardContainer onClick={onClick}>
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.3}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.02}
        transitionSpeed={250}
      >
        <CardBody
          opacity={unlocked ? 1 : 0.5}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RarityBadge rarity={achievement.rarity}>{achievement.rarity}</RarityBadge>
          <IconContainer rarity={achievement.rarity}>
            {icons[achievement.rarity as keyof typeof icons]}
          </IconContainer>
          <Title>{achievement.title}</Title>
          <Description>{achievement.description}</Description>
          <XPReward>+{achievement.xp_reward} XP</XPReward>
        </CardBody>
      </Tilt>
    </CardContainer>
  )
}
