import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AchievementState, Achievement, Category, UserAchievement } from '@/types';

const initialState: AchievementState = {
  achievements: [],
  userAchievements: [],
  categories: [],
  loading: false,
  error: null,
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.achievements = action.payload;
      state.loading = false;
    },
    setUserAchievements: (state, action: PayloadAction<UserAchievement[]>) => {
      state.userAchievements = action.payload;
      state.loading = false;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    unlockAchievement: (state, action: PayloadAction<UserAchievement>) => {
      state.userAchievements.push(action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setAchievements,
  setUserAchievements,
  setCategories,
  unlockAchievement,
  setError,
} = achievementsSlice.actions;

export default achievementsSlice.reducer;
