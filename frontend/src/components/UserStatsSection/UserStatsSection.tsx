import {
  Container,
  Header,
  Title,
  Stats,
  StatCard,
  StatLabel,
  StatValue,
} from './UserStatsSection.styled';

export interface UserStatsProps {
  totalAchievements: number;
  totalXP: number;
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
}

export const UserStatsSection = ({
  totalAchievements,
  totalXP,
  currentLevel,
  currentXP,
  xpToNextLevel,
}: UserStatsProps) => {
  return (
    <Container>
      <Header>
        <Title>📊 Статистика</Title>
      </Header>
      <Stats>
        <StatCard>
          <StatLabel>Достижений</StatLabel>
          <StatValue>{totalAchievements}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Общий XP</StatLabel>
          <StatValue>{totalXP.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Уровень</StatLabel>
          <StatValue>{currentLevel}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Прогресс</StatLabel>
          <StatValue>{currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>До следующего</StatLabel>
          <StatValue>{xpToNextLevel.toLocaleString()} XP</StatValue>
        </StatCard>
      </Stats>
    </Container>
  );
};
