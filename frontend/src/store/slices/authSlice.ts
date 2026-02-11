import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '@/types'
import { saveTokens, clearTokens } from '@/lib/auth/tokenStorage'
import { authApi } from '../api/authApi'

// Инициализация состояния - читаем пользователя из localStorage на клиенте
const initialState: AuthState = {
  user:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload))
      }
    },
    logout: () => {
      clearTokens()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
      // Возвращаем начальное состояние
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    updateXP: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.xp = action.payload
        state.user.level = Math.floor(Math.sqrt(action.payload / 100)) + 1
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user))
        }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        saveTokens(action.payload.tokens)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Ошибка входа'
        state.isAuthenticated = false
      })

    // Register
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        saveTokens(action.payload.tokens)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Ошибка регистрации'
        state.isAuthenticated = false
      })

    // Logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      clearTokens()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
      return initialState
    })

    // GetMe
    builder
      .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload))
        }
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })

    // RefreshToken
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        saveTokens(action.payload)
      }
    )

    // LinkPlatform
    builder.addMatcher(
      authApi.endpoints.linkPlatform.matchFulfilled,
      (state, action) => {
        state.user = action.payload
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload))
        }
      }
    )
  },
})

export const { setLoading, setUser, logout, setError, updateXP, clearError } =
  authSlice.actions
export default authSlice.reducer
