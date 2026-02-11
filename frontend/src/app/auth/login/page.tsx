'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLoginMutation } from '@/store/api/authApi'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { clearError } from '@/store/slices/authSlice'
import { TEST_USER_CREDENTIALS } from '@/lib/auth/testUser'
import Container from '@/components/Container/Container'
import { LoginForm } from '@/components/auth/LoginForm'
import { Button } from '@/components/ui/Button'
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  AuthLink,
  TestUserButton,
} from '../auth.styled'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [login, { isLoading, error }] = useLoginMutation()

  // Редирект после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (loginData: { login: string; password: string }) => {
    try {
      await login(loginData).unwrap()
      // Редирект произойдет через useEffect при изменении isAuthenticated
    } catch (err) {
      // Ошибка обрабатывается в компоненте формы
    }
  }

  const handleTestLogin = () => {
    handleLogin({
      login: TEST_USER_CREDENTIALS.email,
      password: TEST_USER_CREDENTIALS.password,
    })
  }

  return (
    <Container>
      <AuthContainer>
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Вход в аккаунт</AuthTitle>
            <AuthSubtitle>Войдите, чтобы продолжить</AuthSubtitle>
          </AuthHeader>
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={
              error
                ? 'data' in error
                  ? (error.data as string)
                  : 'error' in error
                    ? String(error.error)
                    : undefined
                : undefined
            }
          />
          {process.env.NODE_ENV === 'development' && (
            <TestUserButton>
              <Button
                variant="secondary"
                size="md"
                onClick={handleTestLogin}
                disabled={isLoading}
              >
                Войти как тестовый пользователь
              </Button>
            </TestUserButton>
          )}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
              Нет аккаунта?{' '}
            </span>
            <AuthLink href="/auth/register">Зарегистрироваться</AuthLink>
          </div>
        </AuthCard>
      </AuthContainer>
    </Container>
  )
}
