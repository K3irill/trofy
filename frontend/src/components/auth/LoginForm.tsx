'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  Form,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  SubmitButton,
  TogglePasswordButton,
} from './authForms.styled'

interface LoginFormProps {
  onSubmit: (data: { login: string; password: string }) => void
  isLoading: boolean
  error?: string
}

export function LoginForm({ onSubmit, isLoading, error: externalError }: LoginFormProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ login?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { login?: string; password?: string } = {}

    if (!login.trim()) {
      newErrors.login = 'Введите email или телефон'
    }

    if (!password) {
      newErrors.password = 'Введите пароль'
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ login: login.trim(), password })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="login">Email или телефон</Label>
        <Input
          id="login"
          type="text"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value)
            if (errors.login) setErrors({ ...errors, login: undefined })
          }}
          placeholder="example@mail.com или +7 (999) 123-45-67"
          disabled={isLoading}
          $hasError={!!errors.login}
        />
        {errors.login && <ErrorMessage>{errors.login}</ErrorMessage>}
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
            placeholder="Введите пароль"
            disabled={isLoading}
            $hasError={!!errors.password}
          />
          <TogglePasswordButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </TogglePasswordButton>
        </div>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </FormGroup>

      {externalError && (
        <ErrorMessage style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          {externalError}
        </ErrorMessage>
      )}

      <SubmitButton>
        <Button type="submit" variant="primary" size="lg" disabled={isLoading} onClick={() => {}}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </SubmitButton>
    </Form>
  )
}
