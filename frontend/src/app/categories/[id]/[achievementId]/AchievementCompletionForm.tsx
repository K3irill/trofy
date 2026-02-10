'use client'

import { useState } from 'react'
import { AchievementDetail } from './types'
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
}

export const AchievementCompletionForm = ({ achievement }: AchievementCompletionFormProps) => {
  const [date, setDate] = useState('')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined)
  const [impressions, setImpressions] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotos((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика отправки данных
    console.log({ date, difficulty, impressions, photos })
    alert('Достижение отмечено как выполненное!')
  }

  return (
    <FormContainer>
      <FormTitle>Выполнили?</FormTitle>
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
                active={difficulty === level}
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
          {photos.length > 0 && (
            <PhotoPreview>
              {photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img src={photo} alt={`Preview ${index + 1}`} />
                  <PhotoRemoveButton onClick={() => removePhoto(index)}>×</PhotoRemoveButton>
                </div>
              ))}
            </PhotoPreview>
          )}
        </FormGroup>

        <FormButton type="submit">Отметить как достигнуто ✔️</FormButton>
      </form>
    </FormContainer>
  )
}
