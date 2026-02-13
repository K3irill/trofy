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

export const EditInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? props.theme.colors.danger + '1a' : props.theme.colors.primary + '1a'};
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`

export const EditTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? props.theme.colors.danger + '1a' : props.theme.colors.primary + '1a'};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

export const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
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
    ? `linear-gradient(135deg, ${props.theme.colors.primary}4d 0%, ${props.theme.colors.secondary}33 100%)`
    : `${props.theme.colors.dark[800]}cc`};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : `${props.theme.colors.dark[600]}80`};
  border-radius: 8px;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.light[300]};
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}1a;
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
    border: 2px solid ${(props) => props.theme.colors.dark[600]}80;

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
  background: ${(props) => props.theme.colors.danger}e6;
  border: none;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.danger};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const PhotoUploadArea = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}0d;
  }

  label {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    color: ${(props) => props.theme.colors.light[300]};
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
        background: ${props.theme.colors.dark[800]}cc;
        border-color: ${props.theme.colors.dark[600]}80;
        color: ${props.theme.colors.light[300]};

        &:hover {
          border-color: ${props.theme.colors.light[500]};
          color: ${props.theme.colors.light[100]};
          background: ${props.theme.colors.dark[600]}80;
        }
      `
    }
  }}

  svg {
    font-size: 1.125rem;
  }
`
