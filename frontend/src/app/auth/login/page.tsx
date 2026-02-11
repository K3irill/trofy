'use client'

import Container from '@/components/Container/Container'
import { LoginForm } from '@/components/auth/LoginForm'
import { useLogin } from '@/hooks/useLogin'
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  AuthLink,
} from '../auth.styled'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    touchedFields,
    onLoginSubmit,
    isLoading,
    loginError,
  } = useLogin()

  return (
    <Container>
      <AuthContainer>
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Вход в аккаунт</AuthTitle>
            <AuthSubtitle>Войдите, чтобы продолжить</AuthSubtitle>
          </AuthHeader>
          <LoginForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onLoginSubmit}
            isLoading={isLoading}
            error={loginError || undefined}
            errors={errors}
            touchedFields={touchedFields}
          />
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
