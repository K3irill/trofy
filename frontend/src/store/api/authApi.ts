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

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation<TokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, { refresh_token: string }>({
      query: ({ refresh_token }) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refresh_token },
      }),
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
  useLinkPlatformMutation,
} = authApi
