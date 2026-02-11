'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRegisterMutation } from '@/store/api/authApi'
import Container from '@/components/Container/Container'
import { RegisterForm } from '@/components/auth/RegisterForm'
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  AuthLink,
} from '../auth.styled'

export default function RegisterPage() {
  const router = useRouter()
  const [register, { isLoading, error }] = useRegisterMutation()

  const handleRegister = async (registerData: {
    email?: string
    phone?: string
    password: string
    username: string
  }) => {
    try {
      await register(registerData).unwrap()
      router.push('/')
    } catch (err) {
      // Ошибка обрабатывается в компоненте формы
    }
  }

  return (
    <Container>
      <AuthContainer>
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Создать аккаунт</AuthTitle>
            <AuthSubtitle>Начните свой путь к достижениям</AuthSubtitle>
          </AuthHeader>
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error?.data as string}
          />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
              Уже есть аккаунт?{' '}
            </span>
            <AuthLink href="/auth/login">Войти</AuthLink>
          </div>
        </AuthCard>
      </AuthContainer>
    </Container>
  )
}
