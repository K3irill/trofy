import { AchievementCard } from '@/components/AchievementCard';
import {
  Container,
  Header,
  Title,
  Grid,
  EmptyState,
  EmptyIcon,
} from './UserAchievementsSection.styled';

interface UserAchievementsProps {
  achievements: {
    id: string;
    title: string;
    description: string;
    icon_url: string;
    rarity: string;
    xp_reward: number;
    created_at: string;
    unlocked?: boolean;
  }[];
  count: number;
}

export const UserAchievementsSection = ({ achievements, count }: UserAchievementsProps) => {
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <Container>
      <Header>
        <Title>
          ✅
          Мои достижения
        </Title>
        <Title>
          🔒
          Доступные ({count - unlockedAchievements.length})
        </Title>
      </Header>

      {unlockedAchievements.length > 0 ? (
        <Grid>
          {unlockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={true}
            />
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <EmptyIcon>🏆</EmptyIcon>
          <div>У вас пока нет достижений</div>
        </EmptyState>
      )}

      {lockedAchievements.length > 0 && (
        <Header>
          <Title>
            🔒
            Доступные ({lockedAchievements.length})
          </Title>
        </Header>

        <Grid>
          {lockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={false}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};
