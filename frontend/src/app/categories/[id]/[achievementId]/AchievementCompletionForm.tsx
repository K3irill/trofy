'use client'

import { useState } from 'react'
import { AchievementDetail } from './types'
import { useCompleteAchievementMutation } from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
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

interface AchievementCompletionFormProps {
  achievement: AchievementDetail
  achievementId: string
  onComplete?: () => void
  isComplete?: boolean
}

export const AchievementCompletionForm = ({ achievement, achievementId, onComplete, isComplete = false }: AchievementCompletionFormProps) => {
  const [date, setDate] = useState('')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined)
  const [impressions, setImpressions] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || isSubmitting) return

    try {
      await completeAchievement({
        id: achievementId,
        data: {
          completion_date: date,
          difficulty,
          impressions: impressions || undefined,
          photos: photoFiles.length > 0 ? photoFiles : undefined,
        },
      }).unwrap()
      onComplete?.()
      showToast('Достижение отмечено как выполненное!', 'success')
    } catch (error) {
      showToast('Ошибка при завершении достижения', 'error')
    }
  }

  return (
    <FormContainer $isComplete={isComplete}>
      <FormTitle>Выполнили?</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Дата выполнения *</FormLabel>
          <DateInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            $isComplete={isComplete}
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
                $isComplete={isComplete && difficulty !== level}
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

        <FormButton type="submit" disabled={!date || isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отметить как достигнуто ✔️'}
        </FormButton>
      </form>
      <ToastComponent />
    </FormContainer>
  )
}
