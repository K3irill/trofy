'use client'

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import { IoClose, IoLockClosed, IoLockOpen, IoPersonAdd, IoPersonRemove, IoImageOutline, IoCloseCircle, IoAdd } from 'react-icons/io5'
import { useCreateCustomAchievementMutation, useUpdateCustomAchievementMutation, useGetCategoriesQuery, useGetRaritiesQuery, useGetAchievementByIdQuery, type Achievement } from '@/store/api/achievementsApi'
import { useSearchUsersQuery, useGetMeQuery } from '@/store/api/userApi'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { ThemedSelect } from '@/components/Select/ThemedSelect'
import { CreateCategoryModal } from '@/components/CreateCategoryModal/CreateCategoryModal'

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
  max-width: 700px;
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

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const CreateCategoryButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${(props) => `${props.theme.colors.secondary}20`};
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => `${props.theme.colors.secondary}30`};
    transform: translateY(-2px);
  }
`

interface CreateAchievementModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  defaultCategoryId?: string
  achievement?: Partial<Achievement> | null
}

export function CreateAchievementModal({ isOpen, onClose, onSuccess, defaultCategoryId, achievement }: CreateAchievementModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '')
  const [rarity, setRarity] = useState<'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'>('COMMON')
  const [xpReward, setXpReward] = useState(100)
  const [isPublic, setIsPublic] = useState(true)
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  const isEditMode = !!achievement
  
  const [createAchievement, { isLoading: isCreating }] = useCreateCustomAchievementMutation()
  const [updateAchievement, { isLoading: isUpdating }] = useUpdateCustomAchievementMutation()
  const { data: categories } = useGetCategoriesQuery()
  const { data: rarities } = useGetRaritiesQuery()
  const { data: currentUser } = useGetMeQuery()
  const { showToast, ToastComponent } = useToast()
  
  // Загружаем полные данные достижения при редактировании
  const { data: achievementData } = useGetAchievementByIdQuery(
    { id: achievement?.id || '' },
    { skip: !achievement?.id || !isOpen }
  )
  
  const isLoading = isCreating || isUpdating

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

  // Заполняем форму при редактировании
  useEffect(() => {
    if (isEditMode && achievementData) {
      // Используем загруженные данные из API
      setTitle(achievementData.title)
      setDescription(achievementData.description)
      setCategoryId(achievementData.category.id)
      // Преобразуем rarity в верхний регистр
      setRarity(achievementData.rarity.toUpperCase() as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY')
      setXpReward(achievementData.xp_reward)
      // Явно проверяем is_public - может быть boolean или undefined
      const isPublicValue = achievementData.is_public !== undefined ? achievementData.is_public : true
      setIsPublic(isPublicValue)
      setAllowedUserIds(achievementData.allowed_user_ids || [])
      if (achievementData.icon_url) {
        setImagePreview(achievementData.icon_url.startsWith('http') ? achievementData.icon_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${achievementData.icon_url}`)
      }
    } else if (achievement && !achievementData) {
      // Если данные еще не загружены, используем переданные данные
      if (achievement.title) setTitle(achievement.title)
      if (achievement.description) setDescription(achievement.description)
      if (achievement.category?.id) setCategoryId(achievement.category.id)
      if (achievement.rarity) {
        // Преобразуем rarity в верхний регистр
        const rarityUpper = typeof achievement.rarity === 'string' 
          ? achievement.rarity.toUpperCase() as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
          : 'COMMON'
        setRarity(rarityUpper)
      }
      if (achievement.xp_reward) setXpReward(achievement.xp_reward)
      if (achievement.is_public !== undefined) setIsPublic(achievement.is_public)
      if (achievement.allowed_user_ids) setAllowedUserIds(achievement.allowed_user_ids)
      if (achievement.icon_url) {
        setImagePreview(achievement.icon_url.startsWith('http') ? achievement.icon_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${achievement.icon_url}`)
      }
    } else if (!isEditMode) {
      // Сброс формы при создании
      setTitle('')
      setDescription('')
      setImageFile(null)
      setImagePreview(null)
      setCategoryId(defaultCategoryId || '')
      setRarity('COMMON')
      setXpReward(100)
      setIsPublic(true)
      setAllowedUserIds([])
    }
  }, [achievement, achievementData, isEditMode, isOpen, defaultCategoryId])
  
  useEffect(() => {
    if (defaultCategoryId && !isEditMode) {
      setCategoryId(defaultCategoryId)
    }
  }, [defaultCategoryId, isEditMode])

  // Обновляем список категорий после создания новой
  const { refetch: refetchCategories } = useGetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  useEffect(() => {
    if (!isCreateCategoryModalOpen) {
      // Небольшая задержка для обновления кеша RTK Query
      const timer = setTimeout(() => {
        refetchCategories()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isCreateCategoryModalOpen, refetchCategories])

  // Фильтруем только свои категории
  const myCategories = useMemo(() => {
    if (!categories || !currentUser) return []
    const filtered = categories.filter((cat) => {
      // Проверяем, что категория кастомная и создана текущим пользователем
      const isMyCategory = cat.is_custom && cat.creator_id === currentUser.id
      return isMyCategory
    })
    return filtered
  }, [categories, currentUser])

  const rarityOptions = useMemo(() => {
    if (!rarities) return []
    return rarities.map((r) => ({
      value: r.value,
      label: r.label,
    }))
  }, [rarities])

  const categoryOptions = useMemo(() => {
    return myCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [myCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      showToast('Введите название достижения', 'error')
      return
    }

    if (title.trim().length < 3) {
      showToast('Название достижения должно содержать минимум 3 символа', 'error')
      return
    }

    if (!description.trim()) {
      showToast('Введите описание достижения', 'error')
      return
    }

    if (description.trim().length < 3) {
      showToast('Описание достижения должно содержать минимум 3 символа', 'error')
      return
    }

    if (!categoryId) {
      showToast('Выберите категорию', 'error')
      return
    }

    if (!isEditMode && !imageFile) {
      showToast('Загрузите изображение достижения', 'error')
      return
    }

    try {
      if (isEditMode && (achievement || achievementData)) {
        const achievementId = achievement?.id || achievementData?.id
        if (!achievementId) {
          showToast('Ошибка: ID достижения не найден', 'error')
          return
        }
        
        await updateAchievement({
          id: achievementId,
          title: title.trim(),
          description: description.trim(),
          rarity,
          category_id: categoryId,
          xp_reward: xpReward,
          is_public: isPublic,
          allowed_user_ids: isPublic ? undefined : allowedUserIds,
          image: imageFile || undefined,
        }).unwrap()

        showToast('Достижение успешно обновлено', 'success')
        onSuccess?.()
        onClose()
      } else {
        await createAchievement({
          title: title.trim(),
          description: description.trim(),
          category_id: categoryId,
          rarity,
          xp_reward: xpReward,
          is_public: isPublic,
          allowed_user_ids: isPublic ? undefined : allowedUserIds,
          image: imageFile || undefined,
        }).unwrap()

        showToast('Достижение успешно создано', 'success')
        setTitle('')
        setDescription('')
        setImageFile(null)
        setImagePreview(null)
        setCategoryId(defaultCategoryId || '')
        setRarity('COMMON')
        setXpReward(100)
        setIsPublic(true)
        setAllowedUserIds([])
      }
      setUserSearchQuery('')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      showToast(error?.data?.message || (isEditMode ? 'Ошибка при редактировании достижения' : 'Ошибка при создании достижения'), 'error')
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
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
              <ModalHeader>
                <ModalTitle>{isEditMode ? 'Редактировать достижение' : 'Создать достижение'}</ModalTitle>
                <CloseButton onClick={onClose}>
                  <IoClose />
                </CloseButton>
              </ModalHeader>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                <ModalContent>
                  <ScrollableContent>
                    <FormGroup>
                      <Label>Название достижения *</Label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Введите название достижения (минимум 3 символа)"
                      required
                      minLength={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Описание *</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Введите описание достижения (минимум 3 символа)"
                      required
                      minLength={3}
                    />
                  </FormGroup>

                  <Row>
                    <FormGroup>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <Label>Категория *</Label>
                        <CreateCategoryButton
                          type="button"
                          onClick={() => setIsCreateCategoryModalOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IoAdd size={16} />
                          Создать категорию
                        </CreateCategoryButton>
                      </div>
                      {myCategories.length === 0 ? (
                        <div style={{ 
                          padding: '1rem', 
                          background: 'rgba(245, 158, 11, 0.1)', 
                          border: '1px solid rgba(245, 158, 11, 0.3)', 
                          borderRadius: '12px',
                          color: '#f59e0b',
                          fontSize: '0.875rem',
                          textAlign: 'center'
                        }}>
                          У вас нет своих категорий. Сначала создайте категорию.
                        </div>
                      ) : (
                        <ThemedSelect
                          value={categoryOptions.find(opt => opt.value === categoryId)}
                          onChange={(value) => setCategoryId(value?.value || '')}
                          options={categoryOptions}
                          placeholder="Выберите категорию"
                        />
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Редкость</Label>
                      <ThemedSelect
                        value={rarityOptions.find(opt => opt.value === rarity)}
                        onChange={(value) => {
                          const rarityValue = value?.value
                          if (rarityValue) {
                            // Преобразуем в верхний регистр для соответствия типу и бэкенду
                            setRarity(rarityValue.toUpperCase() as typeof rarity)
                          } else {
                            setRarity('COMMON')
                          }
                        }}
                        options={rarityOptions}
                        placeholder="Выберите редкость"
                      />
                    </FormGroup>
                  </Row>

                  <FormGroup>
                    <Label>Изображение достижения</Label>
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

                  <FormGroup>
                    <Label>XP награда</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10000"
                      value={xpReward}
                      onChange={(e) => setXpReward(parseInt(e.target.value) || 100)}
                      placeholder="100"
                    />
                  </FormGroup>

                  <PrivacySection>
                    <Label>Приватность</Label>
                    <PrivacyToggle
                      type="button"
                      $isPublic={isPublic}
                      onClick={() => setIsPublic(!isPublic)}
                    >
                      {isPublic ? <IoLockOpen /> : <IoLockClosed />}
                      {isPublic ? 'Публичное достижение' : 'Приватное достижение'}
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
                    disabled={
                      isLoading || 
                      !title.trim() || 
                      title.trim().length < 3 || 
                      !description.trim() || 
                      description.trim().length < 3 || 
                      !categoryId || 
                      myCategories.length === 0 || 
                      (!isEditMode && !imageFile)
                    }
                    style={{ flex: 1 }}
                  >
                    {isLoading 
                      ? (isEditMode ? 'Сохранение...' : 'Создание...')
                      : (isEditMode ? 'Сохранить' : 'Создать')
                    }
                  </Button>
                </ModalActions>
              </form>
              {ToastComponent && <ToastComponent />}
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>,
        document.body
      )}
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSuccess={() => {
          // Категории обновятся автоматически через RTK Query
        }}
      />
    </>
  )
}
