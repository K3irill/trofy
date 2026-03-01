'use client'

import { useState, FormEvent } from 'react'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  SubmitButton,
  TogglePasswordButton,
  ToggleContainer,
  ToggleButton,
} from './authForms.styled'

interface RegisterFormProps {
  onSubmit: (data: {
    email?: string
    phone?: string
    password: string
    username: string
  }) => void
  isLoading: boolean
  error?: string
}

export function RegisterForm({ onSubmit, isLoading, error: externalError }: RegisterFormProps) {
  const [authType, setAuthType] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    phone?: string
    username?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateEmail = (email: string) => {
    // Проверка на русские буквы
    if (/[а-яА-ЯёЁ]/.test(email)) {
      return false
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''))
  }

  const hasRussianLetters = (text: string) => {
    return /[а-яА-ЯёЁ]/.test(text)
  }

  const validate = () => {
    const newErrors: typeof errors = {}

    if (authType === 'email') {
      if (!email.trim()) {
        newErrors.email = 'Введите email'
      } else if (hasRussianLetters(email)) {
        newErrors.email = 'Email может содержать только латинские буквы'
      } else if (!validateEmail(email)) {
        newErrors.email = 'Введите корректный email'
      }
    } else {
      if (!phone.trim()) {
        newErrors.phone = 'Введите телефон'
      } else if (!validatePhone(phone)) {
        newErrors.phone = 'Введите корректный телефон'
      }
    }

    if (!username.trim()) {
      newErrors.username = 'Введите имя пользователя'
    } else if (hasRussianLetters(username)) {
      newErrors.username = 'Имя пользователя может содержать только латинские буквы, цифры и _'
    } else if (username.length < 3) {
      newErrors.username = 'Имя пользователя должно содержать минимум 3 символа'
    }

    if (!password) {
      newErrors.password = 'Введите пароль'
    } else if (hasRussianLetters(password)) {
      newErrors.password = 'Пароль может содержать только латинские буквы'
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        [authType]: authType === 'email' ? email.trim() : phone.trim(),
        password,
        username: username.trim(),
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ToggleContainer>
        <ToggleButton
          type="button"
          $active={authType === 'email'}
          onClick={() => {
            setAuthType('email')
            setErrors({})
          }}
          disabled={isLoading}
        >
          Email
        </ToggleButton>
        <ToggleButton
          type="button"
          $active={authType === 'phone'}
          onClick={() => {
            setAuthType('phone')
            setErrors({})
          }}
          disabled={isLoading}
        >
          Телефон
        </ToggleButton>
      </ToggleContainer>

      {authType === 'email' ? (
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            placeholder="example@mail.com"
            disabled={isLoading}
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
      ) : (
        <FormGroup>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (errors.phone) setErrors({ ...errors, phone: undefined })
            }}
            placeholder="+7 (999) 123-45-67"
            disabled={isLoading}
            $hasError={!!errors.phone}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>
      )}

      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            if (errors.username) setErrors({ ...errors, username: undefined })
          }}
          placeholder="Ваш username"
          disabled={isLoading}
          $hasError={!!errors.username}
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Пароль</Label>
        <div style={{ position: 'relative' }}>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            placeholder="Минимум 6 символов"
            disabled={isLoading}
            $hasError={!!errors.password}
          />
          <TogglePasswordButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <IoEye /> : <IoEyeOff />}
          </TogglePasswordButton>
        </div>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
        <div style={{ position: 'relative' }}>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
            }}
            placeholder="Повторите пароль"
            disabled={isLoading}
            $hasError={!!errors.confirmPassword}
          />
          <TogglePasswordButton
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
          </TogglePasswordButton>
        </div>
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
      </FormGroup>

      {externalError && (
        <ErrorMessage style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          {externalError}
        </ErrorMessage>
      )}

      <SubmitButton>
        <Button variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </SubmitButton>
    </Form>
  )
}
