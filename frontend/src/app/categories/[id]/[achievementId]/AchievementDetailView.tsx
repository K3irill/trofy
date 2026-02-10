'use client'

import { AchievementDetail } from './types'
import {
  DetailContainer,
  DetailSection,
  SectionTitle,
  PhotoGrid,
  PhotoItem,
  InfoRow,
  InfoLabel,
  InfoValue,
  DifficultyStars,
  Star,
  ImpressionsText,
} from './AchievementDetailView.styled'

interface AchievementDetailViewProps {
  achievement: AchievementDetail
}

export const AchievementDetailView = ({ achievement }: AchievementDetailViewProps) => {
  const renderDifficulty = (difficulty?: number) => {
    if (!difficulty) return null
    return (
      <DifficultyStars>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={star <= difficulty}>
            ⭐
          </Star>
        ))}
      </DifficultyStars>
    )
  }

  return (
    <DetailContainer>
      <DetailSection>
        <SectionTitle>Информация о выполнении</SectionTitle>
        <InfoRow>
          <InfoLabel>Дата выполнения:</InfoLabel>
          <InfoValue>{achievement.completionDate || 'Не указана'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Сложность:</InfoLabel>
          <InfoValue>{renderDifficulty(achievement.difficulty)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Награда:</InfoLabel>
          <InfoValue>+{achievement.xpReward} XP</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Редкость:</InfoLabel>
          <InfoValue style={{ textTransform: 'capitalize' }}>{achievement.rarity}</InfoValue>
        </InfoRow>
      </DetailSection>

      {achievement.impressions && (
        <DetailSection>
          <SectionTitle>Впечатления</SectionTitle>
          <ImpressionsText>{achievement.impressions}</ImpressionsText>
        </DetailSection>
      )}

      {achievement.photos && achievement.photos.length > 0 && (
        <DetailSection>
          <SectionTitle>Фотографии ({achievement.photos.length})</SectionTitle>
          <PhotoGrid>
            {achievement.photos.map((photo, index) => (
              <PhotoItem key={index}>
                <img src={photo} alt={`Фото ${index + 1}`} />
              </PhotoItem>
            ))}
          </PhotoGrid>
        </DetailSection>
      )}
    </DetailContainer>
  )
}
