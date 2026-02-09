import { Achievement } from '@/types';

export interface AchievementCardProps {
  achievement: Achievement;
  unlocked?: boolean;
  onClick?: () => void;
}
