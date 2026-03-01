'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetMeQuery, useUpdateMeMutation, useLazyCheckUsernameQuery, useChangePasswordMutation } from '@/store/api/userApi'
import { useToast } from '@/hooks/useToast'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import {
  SettingsSection,
  SettingsRowTitle,
  SettingsRowDescription,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  SuccessMessage,
  Button,
  TogglePasswordButton,
  UsernameStatus,
  LoadingSpinner,
} from './SettingsModal.styled'
import styled from 'styled-components'

const SaveButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`

const PasswordSection = styled(SettingsSection)`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.dark[700]};
`

export function AccountSettings() {
  const router = useRouter()
  const { data: me, refetch } = useGetMeQuery()
  const [updateMe, { isLoading: isUpdatingMe }] = useUpdateMeMutation()
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()
  const [checkUsername] = useLazyCheckUsernameQuery()
  const { showToast, ToastComponent } = useToast()

  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [usernameError, setUsernameError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [passwordError, setPasswordError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (me) {
      setUsername(me.username || '')
      setNickname(me.nickname || '')
    }
  }, [me])

  // Проверка доступности username с debounce
  useEffect(() => {
    if (!username || username === me?.username) {
      setUsernameStatus('idle')
      setUsernameError('')
      return
    }

    // Валидация формата
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus('idle')
      setUsernameError('Username может содержать только английские буквы, цифры и подчеркивания')
      return
    }

    if (username.length < 3) {
      setUsernameStatus('idle')
      setUsernameError('Username должен содержать минимум 3 символа')
      return
    }

    setUsernameError('')
    setUsernameStatus('checking')

    const timer = setTimeout(async () => {
      try {
        const result = await checkUsername(username).unwrap()
        if (result.available) {
          setUsernameStatus('available')
          setUsernameError('')
        } else {
          setUsernameStatus('taken')
          setUsernameError(result.message || 'Username уже занят')
        }
      } catch (error: any) {
        setUsernameStatus('taken')
        setUsernameError(error?.data?.message || 'Ошибка проверки username')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, me?.username, checkUsername])

  const handleSaveAccount = async () => {
    setSuccessMessage('')
    
    const updates: any = {}
    let hasChanges = false
    const oldUsername = me?.username
    let usernameChanged = false

    if (username !== me?.username) {
      if (usernameStatus !== 'available' && username !== me?.username) {
        setUsernameError('Проверьте доступность username')
        return
      }
      updates.username = username
      hasChanges = true
      usernameChanged = true
    }

    if (nickname !== (me?.nickname || '')) {
      updates.nickname = nickname
      hasChanges = true
    }

    if (!hasChanges) {
      setSuccessMessage('Нет изменений для сохранения')
      return
    }

    try {
      await updateMe(updates).unwrap()
      await refetch()
      setSuccessMessage('Данные аккаунта успешно обновлены')
      showToast('Данные аккаунта успешно обновлены', 'success')
      
      // Если username изменился, редиректим на новый профиль
      if (usernameChanged && username && oldUsername) {
        // Проверяем, находимся ли мы на странице профиля старого username
        const currentPath = window.location.pathname
        if (currentPath.startsWith(`/user/${oldUsername}`)) {
          // Заменяем старый username на новый в URL
          const newPath = currentPath.replace(`/user/${oldUsername}`, `/user/${username}`)
          router.push(newPath)
        } else {
          // Если не на странице профиля, просто переходим на новый профиль
          router.push(`/user/${username}`)
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Ошибка обновления данных'
      showToast(errorMessage, 'error')
      if (error?.data?.message?.includes('username')) {
        setUsernameError(errorMessage)
      }
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setSuccessMessage('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Заполните все поля')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Новый пароль должен содержать минимум 6 символов')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают')
      return
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap()
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccessMessage('Пароль успешно изменен')
      showToast('Пароль успешно изменен', 'success')
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Ошибка смены пароля'
      setPasswordError(errorMessage)
      showToast(errorMessage, 'error')
    }
  }

  return (
    <>
      <SettingsSection>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <div style={{ position: 'relative' }}>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setSuccessMessage('')
              }}
              placeholder="username"
              $hasError={!!usernameError}
              disabled={isUpdatingMe}
            />
            {usernameStatus === 'checking' && (
              <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <LoadingSpinner>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                </LoadingSpinner>
              </div>
            )}
            {usernameStatus === 'available' && username !== me?.username && (
              <UsernameStatus $available={true}>✓</UsernameStatus>
            )}
            {usernameStatus === 'taken' && (
              <UsernameStatus $available={false}>✗</UsernameStatus>
            )}
          </div>
          {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
          <SettingsRowDescription style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Username может содержать только английские буквы, цифры и подчеркивания. Минимум 3 символа.
          </SettingsRowDescription>
        </FormGroup>

        {/* <FormGroup>
          <Label htmlFor="nickname">Никнейм (имя)</Label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              setSuccessMessage('')
            }}
            placeholder="Ваше имя"
            disabled={isUpdatingMe}
          />
          <SettingsRowDescription style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Ваше отображаемое имя. Может быть на любом языке.
          </SettingsRowDescription>
        </FormGroup> */}

        <SaveButton
          type="button"
          onClick={handleSaveAccount}
          disabled={isUpdatingMe || usernameStatus === 'checking' || (username !== me?.username && usernameStatus !== 'available')}
        >
          {isUpdatingMe ? 'Сохранение...' : 'Сохранить изменения'}
        </SaveButton>
      </SettingsSection>

      <PasswordSection>
        <SettingsRowTitle style={{ marginBottom: '1rem' }}>Смена пароля</SettingsRowTitle>

        <FormGroup>
          <Label htmlFor="currentPassword">Текущий пароль</Label>
          <div style={{ position: 'relative' }}>
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setPasswordError('')
              }}
              placeholder="Введите текущий пароль"
              $hasError={!!passwordError}
              disabled={isChangingPassword}
            />
            <TogglePasswordButton
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              disabled={isChangingPassword}
            >
              {showCurrentPassword ? <IoEye /> : <IoEyeOff />}
            </TogglePasswordButton>
          </div>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="newPassword">Новый пароль</Label>
          <div style={{ position: 'relative' }}>
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordError('')
              }}
              placeholder="Минимум 6 символов"
              $hasError={!!passwordError}
              disabled={isChangingPassword}
            />
            <TogglePasswordButton
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isChangingPassword}
            >
              {showNewPassword ? <IoEye /> : <IoEyeOff />}
            </TogglePasswordButton>
          </div>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
          <div style={{ position: 'relative' }}>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setPasswordError('')
              }}
              placeholder="Повторите новый пароль"
              $hasError={!!passwordError}
              disabled={isChangingPassword}
            />
            <TogglePasswordButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isChangingPassword}
            >
              {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
            </TogglePasswordButton>
          </div>
        </FormGroup>

        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

        <SaveButton
          type="button"
          onClick={handleChangePassword}
          disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
        >
          {isChangingPassword ? 'Смена пароля...' : 'Изменить пароль'}
        </SaveButton>
      </PasswordSection>

      <ToastComponent />
    </>
  )
}
