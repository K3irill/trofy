export interface Category {
  id: string;
  name: string;
  icon: string;
  total: number;
  unlocked: number;
  achievements: AchievementPreview[];
}

export interface AchievementPreview {
  id: string;
  icon: string;
  unlocked: boolean;
}

export const categories: Category[] = [
  {
    id: 'transport',
    name: 'Транспорт',
    icon: '🚗',
    total: 12,
    unlocked: 4,
    achievements: [
      { id: '1', icon: '🚗', unlocked: true },
      { id: '2', icon: '🏍', unlocked: true },
      { id: '3', icon: '🚂', unlocked: true },
      { id: '4', icon: '🚁', unlocked: true },
      { id: '5', icon: '✈', unlocked: false },
      { id: '6', icon: '🚠', unlocked: false },
      { id: '7', icon: '🚲', unlocked: false },
      { id: '8', icon: '⛴', unlocked: false },
    ],
  },
  {
    id: 'travel',
    name: 'Путешествия',
    icon: '✈️',
    total: 10,
    unlocked: 3,
    achievements: [
      { id: '9', icon: '🌍', unlocked: true },
      { id: '10', icon: '🗺', unlocked: true },
      { id: '11', icon: '🗽', unlocked: true },
      { id: '12', icon: '🗼', unlocked: false },
      { id: '13', icon: '🏰', unlocked: false },
      { id: '14', icon: '🗽', unlocked: false },
      { id: '15', icon: '🌎', unlocked: false },
      { id: '16', icon: '🏯', unlocked: false },
      { id: '17', icon: '🏰', unlocked: false },
      { id: '18', icon: '🎡', unlocked: false },
    ],
  },
  {
    id: 'relationships',
    name: 'Отношения',
    icon: '💕',
    total: 8,
    unlocked: 2,
    achievements: [
      { id: '19', icon: '👩', unlocked: true },
      { id: '20', icon: '💑', unlocked: true },
      { id: '21', icon: '💏�', unlocked: false },
      { id: '22', icon: '💎', unlocked: false },
      { id: '23', icon: '👪', unlocked: false },
      { id: '24', icon: '👰', unlocked: false },
      { id: '25', icon: '🚬', unlocked: false },
      { id: '26', icon: '👼', unlocked: false },
    ],
  },
  {
    id: 'skills',
    name: 'Навыки',
    icon: '⭐',
    total: 15,
    unlocked: 5,
    achievements: [
      { id: '27', icon: '🎹', unlocked: true },
      { id: '28', icon: '🎸', unlocked: true },
      { id: '29', icon: '🎤', unlocked: true },
      { id: '30', icon: '🎺', unlocked: true },
      { id: '31', icon: '🎻', unlocked: true },
      { id: '32', icon: '🎨', unlocked: false },
      { id: '33', icon: '🎬', unlocked: false },
      { id: '34', icon: '🎭', unlocked: false },
      { id: '35', icon: '🪘', unlocked: false },
      { id: '36', icon: '🎪', unlocked: false },
      { id: '37', icon: '🎫', unlocked: false },
      { id: '38', icon: '🎯', unlocked: false },
      { id: '39', icon: '🎱', unlocked: false },
      { id: '40', icon: '🎲', unlocked: false },
      { id: '41', icon: '🥁', unlocked: false },
    ],
  },
  {
    id: 'sports',
    name: 'Спорт',
    icon: '🏆',
    total: 10,
    unlocked: 4,
    achievements: [
      { id: '42', icon: '⚽', unlocked: true },
      { id: '43', icon: '🏀', unlocked: true },
      { id: '44', icon: '🏈', unlocked: true },
      { id: '45', icon: '🏐', unlocked: true },
      { id: '46', icon: '🏏', unlocked: false },
      { id: '47', icon: '🏑', unlocked: false },
      { id: '48', icon: '🏒', unlocked: false },
      { id: '49', icon: '🏓', unlocked: false },
      { id: '50', icon: '🏏�', unlocked: false },
      { id: '51', icon: '🥊', unlocked: false },
    ],
  },
  {
    id: 'career',
    name: 'Карьера',
    icon: '💼',
    total: 8,
    unlocked: 3,
    achievements: [
      { id: '52', icon: '🎓', unlocked: true },
      { id: '53', icon: '📜', unlocked: true },
      { id: '54', icon: '🎖', unlocked: true },
      { id: '55', icon: '🎭', unlocked: false },
      { id: '56', icon: '🎬', unlocked: false },
      { id: '57', icon: '🎪', unlocked: false },
      { id: '58', icon: '🎫', unlocked: false },
      { id: '59', icon: '🎯', unlocked: false },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Образ жизни',
    icon: '🌟',
    total: 6,
    unlocked: 2,
    achievements: [
      { id: '60', icon: '🏠', unlocked: true },
      { id: '61', icon: '🏡', unlocked: true },
      { id: '62', icon: '🏢', unlocked: false },
      { id: '63', icon: '🏣', unlocked: false },
      { id: '64', icon: '🏤', unlocked: false },
      { id: '65', icon: '🏥', unlocked: false },
      { id: '66', icon: '🏦', unlocked: false },
    ],
  },
];
