'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { IoClose, IoLockClosed, IoLockOpen, IoPersonAdd, IoPersonRemove, IoImageOutline, IoCloseCircle } from 'react-icons/io5'
import { useCreateCustomCategoryMutation } from '@/store/api/achievementsApi'
import { useSearchUsersQuery } from '@/store/api/userApi'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  height: 90vh;
  max-height: 90vh;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  
  @media (max-height: 600px) {
    height: 95vh;
    max-height: 95vh;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: ${(props) => props.theme.glass.border};
  position: relative;
  flex-shrink: 0;
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  flex: 1;
  text-align: center;
`

const CloseButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }
`

const ModalContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.dark[800]};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.primary};
    border-radius: 4px;
    
    &:hover {
      background: ${(props) => props.theme.colors.primary}cc;
    }
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[200]};
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

const PrivacySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border-radius: 12px;
  border: ${(props) => props.theme.glass.border};
`

const PrivacyToggle = styled.button<{ $isPublic: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${(props) => (props.$isPublic ? `${props.theme.colors.primary}20` : `${props.theme.colors.secondary}20`)};
  border: 2px solid ${(props) => (props.$isPublic ? props.theme.colors.primary : props.theme.colors.secondary)};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  svg {
    font-size: 1.25rem;
  }
`

const UsersSearchInput = styled(Input)`
  margin-top: 0.5rem;
`

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.5rem;
`

const UserItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.dark[800]};
  border: ${(props) => props.theme.glass.border};
  border-radius: 8px;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const UserAvatar = styled.div<{ $avatarUrl?: string | null }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  background: ${(props) => props.$avatarUrl ? 'transparent' : props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.dark[900]};
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  
  ${(props) => props.$avatarUrl && `
    background-image: url(${props.$avatarUrl.startsWith('http') ? props.$avatarUrl : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${props.$avatarUrl}`});
    background-size: cover;
    background-position: center;
  `}
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`

const UserName = styled.span`
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 500;
`

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.secondary};
  }
`

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.dark[800]};
  border-radius: 8px;
  border: ${(props) => props.theme.glass.border};
`

const SearchResultItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
  }
`

const FileInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: 2px dashed ${(props) => props.theme.colors.primary}40;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  text-align: center;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}20`};
    border-color: ${(props) => props.theme.colors.primary};
  }

  input[type='file'] {
    display: none;
  }
`

const ImagePreview = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${(props) => props.theme.colors.primary};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
`

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: ${(props) => props.theme.colors.light[100]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.25rem;

  &:hover {
    background: ${(props) => props.theme.colors.secondary};
    transform: scale(1.1);
  }
`

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: ${(props) => props.theme.glass.border};
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  position: sticky;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
`

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateCategoryModal({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) {
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  const [createCategory, { isLoading }] = useCreateCustomCategoryMutation()
  const { showToast, ToastComponent } = useToast()

  const { data: searchResults } = useSearchUsersQuery(
    { query: debouncedSearchQuery, limit: 10 },
    { skip: !debouncedSearchQuery || debouncedSearchQuery.trim().length === 0 || isPublic }
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(userSearchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [userSearchQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showToast('Введите название категории', 'error')
      return
    }

    if (name.trim().length < 3) {
      showToast('Название категории должно содержать минимум 3 символа', 'error')
      return
    }

    if (!imageFile) {
      showToast('Загрузите изображение категории', 'error')
      return
    }

    try {
      await createCategory({
        name: name.trim(),
        is_public: isPublic,
        allowed_user_ids: isPublic ? undefined : allowedUserIds,
        image: imageFile || undefined,
      }).unwrap()

      showToast('Категория успешно создана', 'success')
      setName('')
      setImageFile(null)
      setImagePreview(null)
      setIsPublic(true)
      setAllowedUserIds([])
      setUserSearchQuery('')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      showToast(error?.data?.message || 'Ошибка при создании категории', 'error')
    }
  }

  const handleAddUser = (userId: string, username: string) => {
    if (!allowedUserIds.includes(userId)) {
      setAllowedUserIds([...allowedUserIds, userId])
    }
    setUserSearchQuery('')
  }

  const handleRemoveUser = (userId: string) => {
    setAllowedUserIds(allowedUserIds.filter((id) => id !== userId))
  }

  const filteredSearchResults = searchResults?.filter((user) => !allowedUserIds.includes(user.id))

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Создать категорию</ModalTitle>
                <CloseButton onClick={onClose}>
                  <IoClose />
                </CloseButton>
              </ModalHeader>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                <ModalContent>
                  <ScrollableContent>
                    <FormGroup>
                      <Label>Название категории *</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите название категории (минимум 3 символа)"
                      required
                      minLength={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Изображение категории</Label>
                    <FileInputWrapper>
                      {!imagePreview ? (
                        <FileInputLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setImageFile(file)
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setImagePreview(reader.result as string)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <IoImageOutline size={32} />
                            <span>Нажмите для загрузки изображения</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>JPG, PNG, WebP до 10MB</span>
                          </div>
                        </FileInputLabel>
                      ) : (
                        <ImagePreview
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <PreviewImage src={imagePreview} alt="Preview" />
                          <RemoveImageButton
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview(null)
                            }}
                          >
                            <IoCloseCircle />
                          </RemoveImageButton>
                        </ImagePreview>
                      )}
                    </FileInputWrapper>
                  </FormGroup>

                  <PrivacySection>
                    <Label>Приватность</Label>
                    <PrivacyToggle
                      type="button"
                      $isPublic={isPublic}
                      onClick={() => setIsPublic(!isPublic)}
                    >
                      {isPublic ? <IoLockOpen /> : <IoLockClosed />}
                      {isPublic ? 'Публичная категория' : 'Приватная категория'}
                    </PrivacyToggle>

                    {!isPublic && (
                      <>
                        <Label>Дать доступ пользователям:</Label>
                        <UsersSearchInput
                          type="text"
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          placeholder="Поиск по username..."
                        />

                        {filteredSearchResults && filteredSearchResults.length > 0 && (
                          <SearchResults>
                            {filteredSearchResults.map((user) => (
                              <SearchResultItem
                                key={user.id}
                                type="button"
                                onClick={() => handleAddUser(user.id, user.username)}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <UserAvatar $avatarUrl={user.avatar_url}>
                                  {user.avatar_url ? (
                                    <img
                                      src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${user.avatar_url}`}
                                      alt={user.username}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    user.username[0].toUpperCase()
                                  )}
                                </UserAvatar>
                                <UserName>{user.username}</UserName>
                              </SearchResultItem>
                            ))}
                          </SearchResults>
                        )}

                        {allowedUserIds.length > 0 && (
                          <UsersList>
                            {allowedUserIds.map((userId) => {
                              const user = searchResults?.find((u) => u.id === userId)
                              if (!user) return null
                              return (
                                <UserItem
                                  key={userId}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                >
                                  <UserInfo>
                                    <UserAvatar $avatarUrl={user.avatar_url}>
                                      {user.avatar_url ? (
                                        <img
                                          src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${user.avatar_url}`}
                                          alt={user.username}
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                          }}
                                        />
                                      ) : (
                                        user.username[0].toUpperCase()
                                      )}
                                    </UserAvatar>
                                    <UserName>{user.username}</UserName>
                                  </UserInfo>
                                  <RemoveButton onClick={() => handleRemoveUser(userId)}>
                                    <IoPersonRemove />
                                  </RemoveButton>
                                </UserItem>
                              )
                            })}
                          </UsersList>
                        )}
                      </>
                    )}
                  </PrivacySection>
                  </ScrollableContent>
                </ModalContent>

                <ModalActions>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={onClose}
                    style={{ flex: 1 }}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isLoading || !name.trim() || name.trim().length < 3 || !imageFile}
                    style={{ flex: 1 }}
                  >
                    {isLoading ? 'Создание...' : 'Создать'}
                  </Button>
                </ModalActions>
              </form>
              <ToastComponent />
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>,
    document.body
  )
}
