import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import achievementsReducer from './slices/achievementsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    achievements: achievementsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
