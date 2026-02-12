'use client'

import { useState } from 'react'
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
} from './AchievementDetailView.styled'
import { IoCalendar, IoStar, IoGift, IoDiamond, IoClose, IoCheckmark } from 'react-icons/io5'

interface AchievementDetailViewProps {
  achievement: AchievementDetail
  isEditing?: boolean
  onCancel?: () => void
  userAchievementId?: string
  achievementId?: string
  onUpdate?: () => void
}

export const AchievementDetailView = ({
  achievement,
  isEditing = false,
  onCancel,
  userAchievementId,
  achievementId,
  onUpdate,
}: AchievementDetailViewProps) => {
  const getInitialDate = () => {
    if (achievement.completionDate) {
      const dateObj = new Date(achievement.completionDate)
      return dateObj.toISOString().split('T')[0] || ''
    }
    return ''
  }

  const [date, setDate] = useState(getInitialDate())
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>(achievement.difficulty)
  const [impressions, setImpressions] = useState(achievement.impressions || '')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; url: string }>>(() => {
    if (achievement.photosWithId && achievement.photosWithId.length > 0) {
      return achievement.photosWithId
    } else if (achievement.photos && achievement.photos.length > 0) {
      return achievement.photos.map((url, index) => ({ id: `temp-${index}`, url }))
    }
    return []
  })

  const [updateAchievement, { isLoading: isSubmitting }] = useUpdateAchievementMutation()
  const [deletePhoto, { isLoading: isDeletingPhoto }] = useDeletePhotoMutation()
  const { showToast, ToastComponent } = useToast()

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

  const handleDeleteExistingPhoto = async (photoId: string, index: number) => {
    if (photoId.startsWith('temp-')) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
      return
    }

    if (!userAchievementId || !achievementId) return

    try {
      await deletePhoto({ userAchievementId, photoId, achievementId }).unwrap()
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
      showToast('Фотография удалена', 'success')
    } catch {
      showToast('Ошибка при удалении фотографии', 'error')
    }
  }

  const handleSave = async () => {
    if (!userAchievementId || !achievementId) return
    if (!date) {
      showToast('Пожалуйста, укажите дату выполнения', 'warning')
      return
    }

    try {
      await updateAchievement({
        userAchievementId,
        achievementId,
        data: {
          completion_date: date,
          difficulty,
          impressions: impressions || undefined,
          photos: photoFiles.length > 0 ? photoFiles : undefined,
        },
      }).unwrap()
      onUpdate?.()
      showToast('Достижение обновлено', 'success')
    } catch {
      showToast('Ошибка при обновлении достижения', 'error')
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

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <IoDiamond style={{ color: '#FFD700' }} />
      case 'epic':
        return <IoDiamond style={{ color: '#9B59B6' }} />
      case 'rare':
        return <IoDiamond style={{ color: '#3498DB' }} />
      default:
        return <IoDiamond style={{ color: '#95A5A6' }} />
    }
  }

  return (
    <DetailContainer>
      <DetailSection>
        <SectionTitle>Информация о выполнении</SectionTitle>
        <InfoRow>
          <InfoLabel>
            <IoCalendar /> Дата выполнения:
          </InfoLabel>
          {isEditing ? (
            <EditInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
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
                  $active={difficulty === level}
                  onClick={() => setDifficulty(level as 1 | 2 | 3 | 4 | 5)}
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
            value={impressions}
            onChange={(e) => setImpressions(e.target.value)}
            placeholder="Опишите свои впечатления от выполнения этого достижения..."
            rows={5}
          />
        ) : (
          achievement.impressions ? (
            <ImpressionsText>{achievement.impressions}</ImpressionsText>
          ) : (
            <ImpressionsText style={{ color: '#6b7280', fontStyle: 'italic' }}>Впечатления не указаны</ImpressionsText>
          )
        )}
      </DetailSection>

      <DetailSection>
        <SectionTitle>Фотографии ({isEditing ? existingPhotos.length + photoFiles.length : (achievement.photos?.length || 0)})</SectionTitle>
        {isEditing ? (
          <>
            {existingPhotos.length > 0 && (
              <PhotoPreview>
                {existingPhotos.map((photo, index) => (
                  <div key={photo.id || index} style={{ position: 'relative' }}>
                    <img src={photo.url.startsWith('http') ? photo.url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${photo.url}`} alt={`Photo ${index + 1}`} />
                    <PhotoRemoveButton
                      onClick={() => handleDeleteExistingPhoto(photo.id, index)}
                      disabled={isDeletingPhoto}
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
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
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
          <EditButton onClick={handleSave} variant="save" disabled={!date || isSubmitting}>
            <IoCheckmark />
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </EditButton>
        </EditButtonGroup>
      )}
      <ToastComponent />
    </DetailContainer>
  )
}
