import { useState, useRef, useEffect } from 'react'
import { useUpdateMeMutation } from '@/store/api/userApi'
import { useAppSelector } from '@/store/hooks'
import type { User } from '@/types'

export function useProfileBio(user: User, isAuthenticated: boolean) {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [updateMe] = useUpdateMeMutation()
  const [status, setStatus] = useState('')
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const statusInputRef = useRef<HTMLTextAreaElement>(null)

  const displayStatus = isEditingStatus ? status : (user.bio || '')

  useEffect(() => {
    if (statusInputRef.current && isEditingStatus) {
      statusInputRef.current.style.height = 'auto'
      statusInputRef.current.style.height = `${statusInputRef.current.scrollHeight}px`
    }
  }, [status, isEditingStatus])

  const handleBlur = async () => {
    setIsEditingStatus(false)
    if (isAuthenticated && currentUser && status !== (user.bio || '')) {
      try {
        await updateMe({ bio: status }).unwrap()
      } catch (error) {
        console.error('Failed to update bio:', error)
      }
    }
    setStatus('')
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsEditingStatus(false)
      if (isAuthenticated && currentUser && status !== (user.bio || '')) {
        try {
          await updateMe({ bio: status }).unwrap()
        } catch (error) {
          console.error('Failed to update bio:', error)
        }
      }
      setStatus('')
    }
  }

  const handleFocus = () => {
    setStatus(user.bio || '')
  }

  const handleClick = () => {
    setIsEditingStatus(true)
    setStatus(user.bio || '')
  }

  return {
    status,
    setStatus,
    isEditingStatus,
    statusInputRef,
    displayStatus,
    handleBlur,
    handleKeyDown,
    handleFocus,
    handleClick,
  }
}
