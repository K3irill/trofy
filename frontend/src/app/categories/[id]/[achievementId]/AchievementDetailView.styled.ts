import styled from 'styled-components'

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const DetailSection = styled.div`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
`

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.light[100]};
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
  border-bottom: 1px solid ${(props) => props.theme.colors.dark[600]}4d;

  &:last-child {
    border-bottom: none;
  }
`

export const InfoLabel = styled.span`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
`

export const InfoValue = styled.span`
  color: ${(props) => props.theme.colors.light[100]};
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
  filter: ${props => props.filled ? `drop-shadow(${props.theme.shadows.glow.gold})` : 'none'};
`

export const ImpressionsText = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
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
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    transform: scale(1.05);
    box-shadow: ${(props) => props.theme.shadows.glass.light};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
