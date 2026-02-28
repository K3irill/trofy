'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { IoClose, IoLockClosed, IoLockOpen, IoPersonAdd, IoPersonRemove, IoImageOutline, IoCloseCircle } from 'react-icons/io5'
import { useCreateCustomCategoryMutation, useUpdateCategoryMutation, useGetCategoryByIdQuery, type Category } from '@/store/api/achievementsApi'
import { useSearchUsersQuery } from '@/store/api/userApi'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { ImageCropModal } from '@/components/ImageCropModal/ImageCropModal'

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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
    padding-top: env(safe-area-inset-top, 0);
    min-height: 100vh;
    min-height: 100dvh;
  }
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
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
  
  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100dvh - env(safe-area-inset-top, 0));
    height: calc(100dvh - env(safe-area-inset-top, 0));
    border-radius: ${(props) => props.theme.glass.radius} ${(props) => props.theme.glass.radius} 0 0;
    margin-top: 0;
  }

  @media (max-height: 600px) {
    max-height: calc(100dvh - env(safe-area-inset-top, 0));
    height: calc(100dvh - env(safe-area-inset-top, 0));
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
  padding-right: 3rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding-right: 2.5rem;
  }
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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
  category?: Partial<Category> | null
}

export function CreateCategoryModal({ isOpen, onClose, onSuccess, category }: CreateCategoryModalProps) {
  const isEditMode = !!category
  
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageForCrop, setImageForCrop] = useState<string | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  const [createCategory, { isLoading: isCreating }] = useCreateCustomCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const { showToast, ToastComponent } = useToast()
  
  // Загружаем полные данные категории при редактировании
  const { data: categoryData } = useGetCategoryByIdQuery(category?.id || '', {
    skip: !category?.id || !isOpen,
  })
  
  const isLoading = isCreating || isUpdating

  // Заполняем форму при редактировании
  useEffect(() => {
    if (isEditMode && categoryData) {
      // Используем загруженные данные из API
      setName(categoryData.name)
      setIsPublic(categoryData.is_public ?? true)
      setAllowedUserIds(categoryData.allowed_user_ids || [])
      if (categoryData.icon_url) {
        setImagePreview(categoryData.icon_url.startsWith('http') ? categoryData.icon_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${categoryData.icon_url}`)
      }
    } else if (category && !categoryData) {
      // Если данные еще не загружены, используем переданные данные
      setName(category.name)
      setIsPublic(category.is_public ?? true)
      setAllowedUserIds(category.allowed_user_ids || [])
      if (category.icon_url) {
        setImagePreview(category.icon_url.startsWith('http') ? category.icon_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${category.icon_url}`)
      }
    } else if (!isEditMode) {
      // Сброс формы при создании
      setName('')
      setImageFile(null)
      setImagePreview(null)
      setIsPublic(true)
      setAllowedUserIds([])
      setUserSearchQuery('')
    }
  }, [category, categoryData, isEditMode, isOpen])

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
      showToast('Название категории должно содержать минимум 2 символа', 'error')
      return
    }

    if (!isEditMode && !imageFile) {
      showToast('Загрузите изображение категории', 'error')
      return
    }

    try {
      if (isEditMode && (category || categoryData)) {
        const categoryId = category?.id || categoryData?.id
        if (!categoryId) {
          showToast('Ошибка: ID категории не найден', 'error')
          return
        }
        
        await updateCategory({
          id: categoryId,
          name: name.trim(),
          is_public: isPublic,
          allowed_user_ids: isPublic ? undefined : allowedUserIds,
          image: imageFile || undefined,
        }).unwrap()

        showToast('Категория успешно обновлена', 'success')
      } else {
        await createCategory({
          name: name.trim(),
          is_public: isPublic,
          allowed_user_ids: isPublic ? undefined : allowedUserIds,
          image: imageFile || undefined,
        }).unwrap()

        showToast('Категория успешно создана', 'success')
      }
      
      setName('')
      setImageFile(null)
      setImagePreview(null)
      setIsPublic(true)
      setAllowedUserIds([])
      setUserSearchQuery('')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      showToast(error?.data?.message || (isEditMode ? 'Ошибка при обновлении категории' : 'Ошибка при создании категории'), 'error')
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

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onClose()
                }
              }}
            >
              <ModalContainer
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>{isEditMode ? 'Редактировать категорию' : 'Создать категорию'}</ModalTitle>
                  <CloseButton onClick={onClose}>
                    <IoClose size={24} />
                  </CloseButton>
                </ModalHeader>

                <ScrollableContent>
                  <form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label>Название категории</Label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите название категории"
                        required
                        minLength={3}
                        maxLength={50}
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
                                  const reader = new FileReader()
                                  reader.onloadend = () => {
                                    const imageSrc = reader.result as string
                                    setImageForCrop(imageSrc)
                                    setIsCropModalOpen(true)
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
                            <motion.button
                              onClick={() => {
                                if (imagePreview) {
                                  setImageForCrop(imagePreview)
                                  setIsCropModalOpen(true)
                                }
                              }}
                              style={{
                                position: 'absolute',
                                bottom: '0.5rem',
                                left: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(0, 212, 255, 0.2)',
                                border: '1px solid rgba(0, 212, 255, 0.5)',
                                borderRadius: '8px',
                                color: '#00d4ff',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <IoImageOutline size={16} />
                              Обрезать
                            </motion.button>
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
                        <ToggleIndicator $isPublic={isPublic} />
                        <ToggleLabel>{isPublic ? 'Публичная' : 'Приватная'}</ToggleLabel>
                        {isPublic ? <IoLockOpen size={18} /> : <IoLockClosed size={18} />}
                      </PrivacyToggle>
                    </PrivacySection>

                    {!isPublic && (
                      <PrivacySection>
                        <Label>Пользователи с доступом</Label>
                        <UserSearchInput
                          type="text"
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          placeholder="Поиск пользователей..."
                        />
                        {debouncedSearchQuery && searchUsersData && searchUsersData.length > 0 && (
                          <UsersList>
                            {searchUsersData.map((user) => (
                              <UserItem
                                key={user.id}
                                onClick={() => {
                                  if (!allowedUserIds.includes(user.id)) {
                                    setAllowedUserIds([...allowedUserIds, user.id])
                                  }
                                  setUserSearchQuery('')
                                }}
                              >
                                <UserAvatar $avatarUrl={user.avatar_url || ''}>
                                  {!user.avatar_url && <span>{user.username[0].toUpperCase()}</span>}
                                </UserAvatar>
                                <UserInfo>
                                  <UserName>{user.username}</UserName>
                                  {user.email && <UserEmail>{user.email}</UserEmail>}
                                </UserInfo>
                                {!allowedUserIds.includes(user.id) && <IoPersonAdd size={20} />}
                              </UserItem>
                            ))}
                          </UsersList>
                        )}
                        {allowedUserIds.length > 0 && (
                          <>
                            <Label style={{ marginTop: '1rem' }}>Выбранные пользователи:</Label>
                            <UsersList>
                              {allowedUserIds.map((userId) => {
                                const user = searchUsersData?.find((u) => u.id === userId)
                                if (!user) return null
                                return (
                                  <UserItem
                                    key={userId}
                                    onClick={() => {
                                      setAllowedUserIds(allowedUserIds.filter((id) => id !== userId))
                                    }}
                                  >
                                    <UserAvatar $avatarUrl={user.avatar_url || ''}>
                                      {!user.avatar_url && <span>{user.username[0].toUpperCase()}</span>}
                                    </UserAvatar>
                                    <UserInfo>
                                      <UserName>{user.username}</UserName>
                                      {user.email && <UserEmail>{user.email}</UserEmail>}
                                    </UserInfo>
                                    <IoPersonRemove size={20} style={{ color: '#ef4444' }} />
                                  </UserItem>
                                )
                              })}
                            </UsersList>
                          </>
                        )}
                      </PrivacySection>
                    )}
                  </form>
                </ScrollableContent>

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
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    disabled={
                      isLoading ||
                      !name.trim() ||
                      name.trim().length < 3 ||
                      (!isEditMode && !imageFile)
                    }
                    style={{ flex: 1 }}
                  >
                    {isLoading
                      ? isEditMode
                        ? 'Сохранение...'
                        : 'Создание...'
                      : isEditMode
                        ? 'Сохранить'
                        : 'Создать'}
                  </Button>
                </ModalActions>
                <ToastComponent />
              </ModalContainer>
            </ModalOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={imageForCrop}
        onClose={() => {
          setIsCropModalOpen(false)
          setImageForCrop(null)
        }}
        onCropComplete={(croppedBlob) => {
          const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })
          setImageFile(croppedFile)
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreview(reader.result as string)
          }
          reader.readAsDataURL(croppedFile)
          setIsCropModalOpen(false)
          setImageForCrop(null)
        }}
      />
    </>
  )
}
