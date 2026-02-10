import styled from 'styled-components'

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const DetailSection = styled.div`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(55, 65, 81, 0.5);
`

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #f3f4f6;
  font-weight: 700;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(55, 65, 81, 0.3);

  &:last-child {
    border-bottom: none;
  }
`

export const InfoLabel = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
`

export const InfoValue = styled.span`
  color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
`

export const DifficultyStars = styled.div`
  display: flex;
  gap: 0.25rem;
`

export const Star = styled.span<{ filled: boolean }>`
  font-size: 1.25rem;
  opacity: ${props => props.filled ? 1 : 0.3};
  filter: ${props => props.filled ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' : 'none'};
`

export const ImpressionsText = styled.p`
  color: #d1d5db;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
`

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
`

export const PhotoItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(55, 65, 81, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00d4ff;
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
