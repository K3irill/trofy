'use client'

import { useState } from 'react'
import { UseFormRegister, UseFormHandleSubmit, FieldErrors, TouchedFields } from 'react-hook-form'
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
} from './authForms.styled'
import type { LoginFormSchema } from '@/lib/schemas/loginSchema'
import { BlockLoader } from '../Loader/BlockLoader'

interface LoginFormProps {
  register: UseFormRegister<LoginFormSchema>
  handleSubmit: UseFormHandleSubmit<LoginFormSchema>
  onSubmit: () => void
  isLoading: boolean
  error?: string
  errors: FieldErrors<LoginFormSchema>
  touchedFields: TouchedFields<LoginFormSchema>
}

export function LoginForm({
  register,
  handleSubmit,
  onSubmit,
  isLoading,
  error: externalError,
  errors,
  touchedFields,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="login">Email или телефон</Label>
        <Input
          id="login"
          type="text"
          placeholder="example@mail.com или +7 (999) 123-45-67"
          disabled={isLoading}
          $hasError={!!errors.login}
          {...register('login')}
        />
        {errors.login && touchedFields.login && <ErrorMessage>{errors.login.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Пароль</Label>
        <div style={{ position: 'relative' }}>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите пароль"
            disabled={isLoading}
            $hasError={!!errors.password}
            {...register('password')}
          />
          <TogglePasswordButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <IoEye /> : <IoEyeOff />}
          </TogglePasswordButton>
        </div>
        {errors.password && touchedFields.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
      </FormGroup>

      {externalError && (
        <ErrorMessage style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          {externalError}
        </ErrorMessage>
      )}

      <SubmitButton>
        <Button type="submit" variant="primary" size="lg" disabled={isLoading} onClick={() => { }}>
          {isLoading ? <>Вход... <BlockLoader size='button' text='' /></> : 'Войти'}
        </Button>
      </SubmitButton>
    </Form>
  )
}
