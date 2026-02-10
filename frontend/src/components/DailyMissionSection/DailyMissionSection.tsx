'use client'

import { motion } from 'framer-motion'
import { SectionMarker } from '@/components/SectionMarker'
import {
  Container,
  Header,
  Badge,
  Content,
  MissionTitle,
  MissionDescription,
  MissionStats,
  StatItem,
  StatValue,
  StatLabel,
  ProgressContainer,
  ProgressBar,
  ProgressFill,
  ProgressText,
  CTAButton,
  GlitchText,
} from './styled'

interface DailyMissionSectionProps {
  title?: string
  description?: string
  participants?: number
  progress?: number
}

export const DailyMissionSection = ({
  title = 'Весенний марафон',
  description = 'Сделай 5 фотографий с весенним настроением.',
  participants = 127,
  progress = 65,
}: DailyMissionSectionProps) => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <SectionMarker
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
        <Badge>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎯 МИССИЯ ДНЯ
          </motion.span>
        </Badge>
      </Header>

      <Content>
        <MissionTitle>
          <GlitchText>{title}</GlitchText>
        </MissionTitle>

        <MissionDescription>{description}</MissionDescription>

        <MissionStats>
          <StatItem>
            <StatValue>{participants}</StatValue>
            <StatLabel>Участников</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>12</StatValue>
            <StatLabel>Дней осталось</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>+500</StatValue>
            <StatLabel>XP награда</StatLabel>
          </StatItem>
        </MissionStats>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </ProgressBar>
          <ProgressText>
            {progress}% участников уже выполнили
          </ProgressText>
        </ProgressContainer>

        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Участвовать
        </CTAButton>
      </Content>
    </Container>
  )
}
