import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import achievementsReducer from './slices/achievementsSlice'
import themeReducer from './slices/themeSlice'
import { baseApi } from './api/baseApi'
import { authMiddleware } from './middleware/authMiddleware'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    achievements: achievementsReducer,
    theme: themeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(baseApi.middleware)
      .concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
