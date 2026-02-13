'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { AchievementDetail } from './types'
import { PhotoSwiper } from './PhotoSwiper'
import { useUpdateAchievementMutation, useDeletePhotoMutation } from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import {
  DetailContainer,
  DetailSection,
  SectionTitle,
  InfoRow,
  InfoLabel,
  InfoValue,
  DifficultyStars,
  Star,
  ImpressionsText,
  EditInput,
  EditTextarea,
  EditButtonGroup,
  EditButton,
  PhotoPreview,
  PhotoRemoveButton,
  PhotoUploadArea,
  DifficultySelector,
  DifficultyButton,
  ErrorMessage,
} from './AchievementDetailView.styled'
import { IoCalendar, IoStar, IoGift, IoDiamond, IoClose, IoCheckmark, IoCameraOutline } from 'react-icons/io5'
import styled from 'styled-components'
import { useTheme } from 'styled-components'

const EmptyImpressionsText = styled(ImpressionsText)`
  color: ${(props) => props.theme.colors.light[300]};
  font-style: italic;
  opacity: 0.7;
`

interface AchievementDetailViewProps {
  achievement: AchievementDetail
  isEditing?: boolean
  onCancel?: () => void
  userAchievementId?: string
  achievementId?: string
  onUpdate?: () => void
}

interface FormData {
  date: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  impressions: string
}

export const AchievementDetailView = ({
  achievement,
  isEditing = false,
  onCancel,
  userAchievementId,
  achievementId,
  onUpdate,
}: AchievementDetailViewProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      date: achievement.completionDate ? new Date(achievement.completionDate).toISOString().split('T')[0] : '',
      difficulty: achievement.difficulty,
      impressions: achievement.impressions || '',
    },
  })

  const watchedDifficulty = watch('difficulty')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  // Фотографии для удаления (помечаются, но не удаляются сразу)
  const [photosToDelete, setPhotosToDelete] = useState<Set<string>>(new Set())
  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; url: string }>>(() => {
    if (achievement.photosWithId && achievement.photosWithId.length > 0) {
      return achievement.photosWithId
    } else if (achievement.photos && achievement.photos.length > 0) {
      return achievement.photos.map((url, index) => ({ id: `temp-${index}`, url }))
    }
    return []
  })

  // Сохраняем исходное состояние фотографий для восстановления при отмене
  const initialPhotos = useMemo<Array<{ id: string; url: string }>>(() => {
    if (achievement.photosWithId && achievement.photosWithId.length > 0) {
      return achievement.photosWithId
    } else if (achievement.photos && achievement.photos.length > 0) {
      return achievement.photos.map((url, index) => ({ id: `temp-${index}`, url }))
    }
    return []
  }, [achievement.photosWithId, achievement.photos])

  const [updateAchievement, { isLoading: isSubmitting }] = useUpdateAchievementMutation()
  const [deletePhoto] = useDeletePhotoMutation()
  const { showToast, ToastComponent } = useToast()

  // Обновляем форму при изменении achievement
  useEffect(() => {
    if (achievement.completionDate) {
      const dateObj = new Date(achievement.completionDate)
      setValue('date', dateObj.toISOString().split('T')[0])
    }
    setValue('difficulty', achievement.difficulty)
    setValue('impressions', achievement.impressions || '')
  }, [achievement, setValue])

  // Восстанавливаем исходное состояние при отмене редактирования
  useEffect(() => {
    if (!isEditing) {
      // Восстанавливаем исходные фотографии
      setExistingPhotos([...initialPhotos])
      // Очищаем помеченные для удаления
      setPhotosToDelete(new Set())
      // Очищаем новые фотографии
      setPhotoFiles([])
      setPhotoPreviews([])
    }
  }, [isEditing, initialPhotos])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      setPhotoFiles((prev) => [...prev, file])
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreviews((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Помечаем фотографию для удаления, но не удаляем сразу
  const handleMarkPhotoForDeletion = (photoId: string, index: number) => {
    if (photoId.startsWith('temp-')) {
      // Временные фотографии просто удаляем из состояния
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
      return
    }

    // Помечаем для удаления
    setPhotosToDelete((prev) => new Set(prev).add(photoId))
    // Визуально скрываем фотографию
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    if (!userAchievementId || !achievementId) return

    try {
      // Сначала удаляем помеченные фотографии
      if (photosToDelete.size > 0 && userAchievementId && achievementId) {
        await Promise.all(
          Array.from(photosToDelete).map((photoId) =>
            deletePhoto({ userAchievementId, photoId, achievementId }).unwrap()
          )
        )
      }

      // Затем обновляем достижение
      await updateAchievement({
        userAchievementId,
        achievementId,
        data: {
          completion_date: data.date,
          difficulty: data.difficulty,
          impressions: data.impressions || undefined,
          photos: photoFiles.length > 0 ? photoFiles : undefined,
        },
      }).unwrap()

      onUpdate?.()
      showToast('Достижение обновлено', 'success')
      setPhotosToDelete(new Set())
    } catch (error: unknown) {
      console.error('Update achievement error:', error)
      const errorData = error as { data?: string | { error?: string; message?: string }; error?: string; message?: string } | undefined
      let errorMessage = 'Ошибка при обновлении достижения'

      if (errorData) {
        if (typeof errorData.data === 'string') {
          errorMessage = errorData.data
        } else if (errorData.data && typeof errorData.data === 'object') {
          errorMessage = errorData.data.error || errorData.data.message || errorMessage
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      }

      showToast(errorMessage, 'error')
    }
  }

  const renderDifficulty = (difficulty?: number) => {
    if (!difficulty) return null
    return (
      <DifficultyStars>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} $filled={star <= difficulty}>
            <IoStar />
          </Star>
        ))}
      </DifficultyStars>
    )
  }

  const theme = useTheme()

  const getRarityIcon = (rarity: string) => {
    // Используем цвета темы для редкости
    // Если в теме нет специальных цветов для редкости, используем стандартные
    const rarityColors: Record<string, string> = {
      legendary: theme.colors.gold || '#FFD700',
      epic: '#9B59B6', // Фиолетовый для epic
      rare: theme.colors.primary || '#3498DB', // Синий для rare
      common: theme.colors.light[300] || '#95A5A6', // Серый для common
    }

    const color = rarityColors[rarity] || rarityColors.common

    return <IoDiamond style={{ color }} />
  }

  // Фильтруем фотографии, исключая помеченные для удаления
  const visiblePhotos = existingPhotos.filter((photo) => !photosToDelete.has(photo.id))

  return (
    <DetailContainer>
      <DetailSection>
        <SectionTitle>Информация о выполнении</SectionTitle>
        <InfoRow>
          <InfoLabel>
            <IoCalendar /> Дата выполнения:
          </InfoLabel>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
              <EditInput
                type="date"
                {...register('date', { required: 'Пожалуйста, укажите дату выполнения' })}
                $hasError={!!errors.date}
              />
              {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
            </div>
          ) : (
            <InfoValue>{achievement.completionDate ? new Date(achievement.completionDate).toLocaleDateString('ru-RU') : 'Не указана'}</InfoValue>
          )}
        </InfoRow>
        <InfoRow>
          <InfoLabel>
            <IoStar /> Сложность:
          </InfoLabel>
          {isEditing ? (
            <DifficultySelector>
              {[1, 2, 3, 4, 5].map((level) => (
                <DifficultyButton
                  key={level}
                  type="button"
                  $active={watchedDifficulty === level}
                  onClick={() => setValue('difficulty', level as 1 | 2 | 3 | 4 | 5)}
                >
                  {level}
                </DifficultyButton>
              ))}
            </DifficultySelector>
          ) : (
            <InfoValue>{renderDifficulty(achievement.difficulty)}</InfoValue>
          )}
        </InfoRow>
        <InfoRow>
          <InfoLabel>
            <IoGift /> Награда:
          </InfoLabel>
          <InfoValue>+{achievement.xpReward} XP</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>
            {getRarityIcon(achievement.rarity)} Редкость:
          </InfoLabel>
          <InfoValue style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {getRarityIcon(achievement.rarity)}
            {achievement.rarity}
          </InfoValue>
        </InfoRow>
      </DetailSection>

      <DetailSection>
        <SectionTitle>Впечатления</SectionTitle>
        {isEditing ? (
          <EditTextarea
            {...register('impressions')}
            placeholder="Опишите свои впечатления от выполнения этого достижения..."
            rows={5}
          />
        ) : (
          achievement.impressions ? (
            <ImpressionsText>{achievement.impressions}</ImpressionsText>
          ) : (
            <EmptyImpressionsText>Впечатления не указаны</EmptyImpressionsText>
          )
        )}
      </DetailSection>

      <DetailSection>
        <SectionTitle>Фотографии ({isEditing ? visiblePhotos.length + photoFiles.length : (achievement.photos?.length || 0)})</SectionTitle>
        {isEditing ? (
          <>
            {visiblePhotos.length > 0 && (
              <PhotoPreview>
                {visiblePhotos.map((photo, index) => (
                  <div key={photo.id || index} style={{ position: 'relative' }}>
                    <img src={photo.url.startsWith('http') ? photo.url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${photo.url}`} alt={`Photo ${index + 1}`} />
                    <PhotoRemoveButton
                      onClick={() => handleMarkPhotoForDeletion(photo.id, index)}
                      title="Удалить фотографию"
                    >
                      ×
                    </PhotoRemoveButton>
                  </div>
                ))}
              </PhotoPreview>
            )}
            <PhotoUploadArea>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                id="photo-upload-edit"
              />
              <label htmlFor="photo-upload-edit" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <IoCameraOutline style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.875rem' }}>
                  Нажмите для загрузки фотографий
                </div>
              </label>
            </PhotoUploadArea>
            {photoPreviews.length > 0 && (
              <PhotoPreview>
                {photoPreviews.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img src={photo} alt={`Preview ${index + 1}`} />
                    <PhotoRemoveButton onClick={() => removePhoto(index)}>×</PhotoRemoveButton>
                  </div>
                ))}
              </PhotoPreview>
            )}
          </>
        ) : (
          achievement.photos && achievement.photos.length > 0 ? (
            <PhotoSwiper photos={achievement.photos} />
          ) : null
        )}
      </DetailSection>

      {isEditing && (
        <EditButtonGroup>
          <EditButton onClick={onCancel} variant="cancel">
            <IoClose />
            Отмена
          </EditButton>
          <EditButton onClick={handleSubmit(onSubmit)} variant="save" disabled={isSubmitting}>
            <IoCheckmark />
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </EditButton>
        </EditButtonGroup>
      )}
      <ToastComponent />
    </DetailContainer>
  )
}
