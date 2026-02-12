'use client'

import { useState, useEffect } from 'react'
import { AchievementDetail } from './types'
import { useUpdateAchievementMutation, useDeletePhotoMutation } from '@/store/api/achievementDetailApi'
import {
  FormContainer,
  FormTitle,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormButton,
  PhotoUploadArea,
  PhotoPreview,
  PhotoRemoveButton,
  DifficultySelector,
  DifficultyButton,
  DateInput,
} from './AchievementCompletionForm.styled'
import { IoCreateOutline } from 'react-icons/io5'

interface AchievementEditFormProps {
  achievement: AchievementDetail
  userAchievementId: string
  achievementId: string
  onClose: () => void
  onUpdate?: () => void
}

export const AchievementEditForm = ({ achievement, userAchievementId, achievementId, onClose, onUpdate }: AchievementEditFormProps) => {
  const [date, setDate] = useState('')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined)
  const [impressions, setImpressions] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; url: string }>>([])

  const [updateAchievement, { isLoading: isSubmitting }] = useUpdateAchievementMutation()
  const [deletePhoto, { isLoading: isDeletingPhoto }] = useDeletePhotoMutation()

  useEffect(() => {
    // Предзаполняем форму текущими данными
    if (achievement.completionDate) {
      const dateObj = new Date(achievement.completionDate)
      setDate(dateObj.toISOString().split('T')[0])
    }
    setDifficulty(achievement.difficulty)
    setImpressions(achievement.impressions || '')
    if (achievement.photosWithId && achievement.photosWithId.length > 0) {
      setExistingPhotos(achievement.photosWithId)
    } else if (achievement.photos && achievement.photos.length > 0) {
      // Fallback для старых данных без ID
      setExistingPhotos(achievement.photos.map((url, index) => ({ id: `temp-${index}`, url })))
    }
  }, [achievement])

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
    // Если это временный ID (старые данные), просто удаляем из состояния
    if (photoId.startsWith('temp-')) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
      return
    }

    try {
      await deletePhoto({ userAchievementId, photoId, achievementId }).unwrap()
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
      // Обновляем данные после удаления
      onUpdate?.()
    } catch (error) {
      alert('Ошибка при удалении фотографии')
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      await updateAchievement({
        userAchievementId,
        achievementId,
        data: {
          completion_date: date || undefined,
          difficulty,
          impressions: impressions || undefined,
          photos: photoFiles.length > 0 ? photoFiles : undefined,
        },
      }).unwrap()
      onUpdate?.()
      onClose()
      alert('Достижение обновлено!')
    } catch (error) {
      alert('Ошибка при обновлении достижения')
    }
  }

  return (
    <FormContainer>
      <FormTitle>
        <IoCreateOutline style={{ marginRight: '0.5rem' }} />
        Редактировать достижение
      </FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Дата выполнения *</FormLabel>
          <DateInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Сложность</FormLabel>
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
        </FormGroup>

        <FormGroup>
          <FormLabel>Впечатления и описание</FormLabel>
          <FormTextarea
            value={impressions}
            onChange={(e) => setImpressions(e.target.value)}
            placeholder="Опишите свои впечатления от выполнения этого достижения..."
            rows={5}
          />
        </FormGroup>

        {existingPhotos.length > 0 && (
          <FormGroup>
            <FormLabel>Текущие фотографии</FormLabel>
            <PhotoPreview>
              {existingPhotos.map((photo, index) => (
                <div key={photo.id || index} style={{ position: 'relative' }}>
                  <img src={photo.url.startsWith('http') ? photo.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${photo.url}`} alt={`Photo ${index + 1}`} />
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
            <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Нажмите на крестик, чтобы удалить фотографию. При загрузке новых фотографий они будут добавлены к существующим.
            </div>
          </FormGroup>
        )}

        <FormGroup>
          <FormLabel>Новые фотографии</FormLabel>
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
        </FormGroup>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <FormButton type="button" onClick={onClose} style={{ background: '#6b7280', flex: 1 }}>
            Отмена
          </FormButton>
          <FormButton type="submit" disabled={!date || isSubmitting} style={{ flex: 1 }}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </FormButton>
        </div>
      </form>
    </FormContainer>
  )
}
