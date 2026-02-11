import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

import { useLoginMutation } from '@/store/api/authApi'
import { LoginFormSchema, loginSchema } from '@/lib/schemas/loginSchema'
import { setUser } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { saveTokens } from '@/lib/auth/tokenStorage'

export function useLogin() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [loginUser, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<LoginFormSchema>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      login: 'test2@trofy.art',
      password: 'test-trofy'
    }
  })

  const { password, login } = watch()

  const onLoginSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    try {
      setLoginError(null)
      const result = await loginUser(data).unwrap()

      saveTokens(result.tokens)

      dispatch(setUser(result.user))
      setIsNavigating(true)
      router.replace('/')
    } catch (error: unknown) {
      setIsNavigating(false)
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data: { message?: string } }
        setLoginError(apiError.data.message || 'Ошибка входа')
      } else {
        setLoginError('Произошла ошибка. Попробуйте снова.')
      }
      console.error('Login failed:', error)
    }
  }

  useEffect(() => {
    setFocus('login')
  }, [setFocus])

  return {
    register,
    handleSubmit,
    watch,
    setFocus,
    isSubmitting,
    errors,
    touchedFields,
    password,
    login,
    loginError,
    setLoginError,
    onLoginSubmit,
    isLoading,
    isNavigating,
    setIsNavigating,
  }
}
