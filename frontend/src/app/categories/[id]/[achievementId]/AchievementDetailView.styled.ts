import styled from 'styled-components'

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const DetailSection = styled.div`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}f0 0%, ${(props) => props.theme.colors.dark[800]}f5 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}60;
  box-shadow: ${(props) => props.theme.shadows.glass.light};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    border-radius: 20px 0 0 20px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1rem;
    color: ${(props) => props.theme.colors.primary};
  }
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

export const Star = styled.span<{ $filled: boolean }>`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  color: ${props => props.$filled ? props.theme.colors.gold : props.theme.colors.light[500]};
  opacity: ${props => props.$filled ? 1 : 0.3};
  filter: ${props => props.$filled ? `drop-shadow(${props.theme.shadows.glow.gold})` : 'none'};
  transition: all 0.3s ease;
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

export const EditInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  background: rgba(17, 24, 39, 0.8);
  border: 2px solid rgba(55, 65, 81, 0.5);
  border-radius: 8px;
  color: #f3f4f6;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`

export const EditTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(17, 24, 39, 0.8);
  border: 2px solid rgba(55, 65, 81, 0.5);
  border-radius: 8px;
  color: #f3f4f6;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #6b7280;
  }
`

export const DifficultySelector = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const DifficultyButton = styled.button<{ $active: boolean }>`
  flex: 1;
  max-width: 60px;
  padding: 0.75rem;
  background: ${props => props.$active
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 168, 204, 0.2) 100%)'
    : 'rgba(17, 24, 39, 0.8)'};
  border: 2px solid ${props => props.$active ? '#00d4ff' : 'rgba(55, 65, 81, 0.5)'};
  border-radius: 8px;
  color: ${props => props.$active ? '#00d4ff' : '#9ca3af'};
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
  }
`

export const PhotoPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;

  > div {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(55, 65, 81, 0.5);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`

export const PhotoRemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 1);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const PhotoUploadArea = styled.div`
  border: 2px dashed rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.05);
  }

  label {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`

export const EditButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`

export const EditButton = styled.button<{ variant?: 'save' | 'cancel' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;

  ${props => {
    if (props.variant === 'save') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
        border-color: ${props.theme.colors.primary};
        color: ${props.theme.colors.dark[900]};
        box-shadow: ${props.theme.shadows.glow.primary};

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: ${props.theme.shadows.glow.primary}, ${props.theme.shadows.glass.medium};
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `
    } else {
      return `
        background: rgba(17, 24, 39, 0.8);
        border-color: rgba(55, 65, 81, 0.5);
        color: ${props.theme.colors.light[300]};

        &:hover {
          border-color: ${props.theme.colors.light[500]};
          color: ${props.theme.colors.light[100]};
          background: rgba(55, 65, 81, 0.5);
        }
      `
    }
  }}

  svg {
    font-size: 1.125rem;
  }
`
