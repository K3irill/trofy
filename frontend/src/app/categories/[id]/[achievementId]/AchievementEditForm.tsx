'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { AchievementDetail } from './types'
import { useUpdateAchievementMutation, useDeletePhotoMutation } from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import {
  FormContainer,
  FormTitle,
  FormGroup,
  FormLabel,
  FormTextarea,
  FormButton,
  PhotoUploadArea,
  PhotoPreview,
  PhotoRemoveButton,
  DifficultySelector,
  DifficultyButton,
  DateInput,
  ErrorMessage,
} from './AchievementCompletionForm.styled'
import styled from 'styled-components'
import { IoCreateOutline, IoCameraOutline } from 'react-icons/io5'

const ErrorText = styled(ErrorMessage)``

const InfoText = styled.div`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`

const CancelButton = styled(FormButton)`
  background: ${(props) => props.theme.colors.dark[600]} !important;
  flex: 1;
`

const SubmitButton = styled(FormButton)`
  flex: 1;
`

interface AchievementEditFormProps {
  achievement: AchievementDetail
  userAchievementId: string
  achievementId: string
  onClose: () => void
  onUpdate?: () => void
}

interface FormData {
  date: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  impressions: string
}

export const AchievementEditForm = ({ achievement, userAchievementId, achievementId, onClose, onUpdate }: AchievementEditFormProps) => {
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
  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; url: string }>>([])

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

  useEffect(() => {
    // Предзаполняем форму текущими данными
    if (achievement.completionDate) {
      const dateObj = new Date(achievement.completionDate)
      setValue('date', dateObj.toISOString().split('T')[0])
    }
    setValue('difficulty', achievement.difficulty)
    setValue('impressions', achievement.impressions || '')
    // Восстанавливаем исходные фотографии при открытии формы
    if (achievement.photosWithId && achievement.photosWithId.length > 0) {
      setExistingPhotos(achievement.photosWithId)
    } else if (achievement.photos && achievement.photos.length > 0) {
      // Fallback для старых данных без ID
      setExistingPhotos(achievement.photos.map((url, index) => ({ id: `temp-${index}`, url })))
    } else {
      setExistingPhotos([])
    }
    // Очищаем состояние при открытии формы
    setPhotosToDelete(new Set())
    setPhotoFiles([])
    setPhotoPreviews([])
  }, [achievement, setValue])

  // Обработчик отмены - восстанавливаем исходное состояние
  const handleCancel = () => {
    setExistingPhotos([...initialPhotos])
    setPhotosToDelete(new Set())
    setPhotoFiles([])
    setPhotoPreviews([])
    onClose()
  }

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
    // Если это временный ID (старые данные), просто удаляем из состояния
    if (photoId.startsWith('temp-')) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
      return
    }

    // Помечаем для удаления
    setPhotosToDelete((prev) => new Set(prev).add(photoId))
    // Визуально скрываем фотографию
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return

    try {
      // Сначала удаляем помеченные фотографии
      if (photosToDelete.size > 0) {
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
      onClose()
      showToast('Достижение обновлено!', 'success')
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

  // Фильтруем фотографии, исключая помеченные для удаления
  const visiblePhotos = existingPhotos.filter((photo) => !photosToDelete.has(photo.id))

  return (
    <FormContainer>
      <FormTitle>
        <IoCreateOutline style={{ marginRight: '0.5rem' }} />
        Редактировать достижение
      </FormTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel>Дата выполнения *</FormLabel>
          <DateInput
            type="date"
            {...register('date', { required: 'Пожалуйста, укажите дату выполнения' })}
            $hasError={!!errors.date}
          />
          {errors.date && <ErrorText>{errors.date.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <FormLabel>Сложность</FormLabel>
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
        </FormGroup>

        <FormGroup>
          <FormLabel>Впечатления и описание</FormLabel>
          <FormTextarea
            {...register('impressions')}
            placeholder="Опишите свои впечатления от выполнения этого достижения..."
            rows={5}
          />
        </FormGroup>

        {visiblePhotos.length > 0 && (
          <FormGroup>
            <FormLabel>Текущие фотографии</FormLabel>
            <PhotoPreview>
              {visiblePhotos.map((photo, index) => (
                <div key={photo.id || index} style={{ position: 'relative' }}>
                  <img src={photo.url.startsWith('http') ? photo.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${photo.url}`} alt={`Photo ${index + 1}`} />
                  <PhotoRemoveButton
                    onClick={() => handleMarkPhotoForDeletion(photo.id, index)}
                    title="Удалить фотографию"
                  >
                    ×
                  </PhotoRemoveButton>
                </div>
              ))}
            </PhotoPreview>
            <InfoText>
              Нажмите на крестик, чтобы пометить фотографию для удаления. Изменения сохранятся при нажатии кнопки &quot;Сохранить изменения&quot;.
            </InfoText>
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
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            Отмена
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </SubmitButton>
        </ButtonGroup>
      </form>
      <ToastComponent />
    </FormContainer>
  )
}
