import { baseApi } from './baseApi'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenResponse,
  RefreshTokenRequest,
  LinkPlatformRequest,
} from '@/types/auth'
import type { User } from '@/types'

// Тестовые данные для разработки
import { createTestAuthResponse, TEST_USER_CREDENTIALS } from '@/lib/auth/testUser'

const isTestMode = process.env.NODE_ENV === 'development'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: async (credentials, _api, _extraOptions, baseQuery) => {
        // В режиме разработки используем тестовые данные
        if (isTestMode) {
          const isValid =
            (credentials.login === TEST_USER_CREDENTIALS.email ||
              credentials.login === TEST_USER_CREDENTIALS.phone) &&
            credentials.password === TEST_USER_CREDENTIALS.password

          if (isValid) {
            // Имитируем задержку сети
            await new Promise((resolve) => setTimeout(resolve, 500))
            const response = createTestAuthResponse()
            return { data: response as AuthResponse }
          } else {
            return {
              error: {
                status: 401,
                data: 'Неверный email/телефон или пароль',
              } as any,
            }
          }
        }

        // В продакшене используем реальный API через baseQuery
        const result = await baseQuery({
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        })
        return result as { data: AuthResponse } | { error: any }
      },
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      queryFn: async (data, _api, _extraOptions, baseQuery) => {
        // В режиме разработки используем тестовые данные
        if (isTestMode) {
          // Имитируем задержку сети
          await new Promise((resolve) => setTimeout(resolve, 500))
          const testUser = createTestAuthResponse()
          // Обновляем данные пользователя из формы регистрации
          testUser.user.username = data.username
          if (data.email) testUser.user.email = data.email
          if (data.phone) testUser.user.phone = data.phone
          return { data: testUser as AuthResponse }
        }

        // В продакшене используем реальный API через baseQuery
        const result = await baseQuery({
          url: '/auth/register',
          method: 'POST',
          body: data,
        })
        return result as { data: AuthResponse } | { error: any }
      },
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation<TokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    linkPlatform: builder.mutation<User, LinkPlatformRequest>({
      query: (data) => ({
        url: '/auth/link-platform',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLinkPlatformMutation,
} = authApi
