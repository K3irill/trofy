import { motion } from 'framer-motion';
import {
  Container,
  Title,
  Grid,
  Card,
  Rank,
  CardContent,
  TitleRow,
  AchievementTitle,
  UserRow,
  UserName,
  XP,
} from './TopAchievements.styled';

export interface TopAchievementProps {
  name: string;
  user: string;
  xp: number;
  title: string;
  rank: number;
}

export const TopAchievementCard = ({ name, user, xp, title, rank }: TopAchievementProps) => {
  return (
    <Card
      rank={rank}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Rank>{rank}</Rank>
      <CardContent>
        <TitleRow>
          <AchievementTitle>{title}</AchievementTitle>
        </TitleRow>
        <UserRow>
          <UserName>{user}</UserName>
          <XP>+{xp.toLocaleString()} XP</XP>
        </UserRow>
      </CardContent>
    </Card>
  );
};
