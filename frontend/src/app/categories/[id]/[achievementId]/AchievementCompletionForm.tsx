'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoCameraOutline, IoCheckmarkCircle, IoClose } from 'react-icons/io5'
import { AchievementDetail } from './types'
import { useCompleteAchievementMutation } from '@/store/api/achievementDetailApi'
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

interface AchievementCompletionFormProps {
  achievement: AchievementDetail
  achievementId: string
  onComplete?: () => void
  isComplete?: boolean
}

interface FormData {
  date: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  impressions: string
}

export const AchievementCompletionForm = ({ achievement, achievementId, onComplete, isComplete = false }: AchievementCompletionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      date: '',
      difficulty: undefined,
      impressions: '',
    },
  })

  const watchedDifficulty = watch('difficulty')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const { showToast, ToastComponent } = useToast()

  const [completeAchievement, { isLoading: isSubmitting }] = useCompleteAchievementMutation()

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

  const onSubmit = async (data: FormData) => {
    try {
      await completeAchievement({
        id: achievementId,
        data: {
          completion_date: data.date,
          difficulty: data.difficulty,
          impressions: data.impressions || undefined,
          photos: photoFiles.length > 0 ? photoFiles : undefined,
        },
      }).unwrap()
      onComplete?.()
      showToast('Достижение отмечено как выполненное!', 'success')
    } catch (error: any) {
      const errorMessage = 
        (typeof error?.data === 'string' ? error.data : null) ||
        (error?.data?.error) ||
        (error?.data?.message) ||
        (error?.error) ||
        (error?.message) ||
        'Ошибка при завершении достижения'
      showToast(errorMessage, 'error')
    }
  }

  return (
    <FormContainer $isComplete={isComplete}>
      <FormTitle>Выполнили?</FormTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel>Дата выполнения *</FormLabel>
          <DateInput
            type="date"
            {...register('date', { required: 'Пожалуйста, укажите дату выполнения' })}
            $isComplete={isComplete}
            $hasError={!!errors.date}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <FormLabel>Сложность</FormLabel>
          <DifficultySelector>
            {[1, 2, 3, 4, 5].map((level) => (
              <DifficultyButton
                key={level}
                type="button"
                $active={watchedDifficulty === level}
                $isComplete={isComplete && watchedDifficulty !== level}
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
            $isComplete={isComplete}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Фотографии</FormLabel>
          <PhotoUploadArea>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload" style={{ cursor: 'pointer', textAlign: 'center' }}>
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
                  <PhotoRemoveButton onClick={() => removePhoto(index)}>
                    <IoClose />
                  </PhotoRemoveButton>
                </div>
              ))}
            </PhotoPreview>
          )}
        </FormGroup>

        <FormButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : (
            <>
              Отметить как достигнутое <IoCheckmarkCircle style={{ marginLeft: '0.5rem' }} />
            </>
          )}
        </FormButton>
      </form>
      <ToastComponent />
    </FormContainer>
  )
}
