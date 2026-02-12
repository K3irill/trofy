import styled from 'styled-components'

export const FormContainer = styled.div<{ $isComplete?: boolean }>`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(55, 65, 81, 0.5);
  transition: all 0.3s ease;

  ${(props) =>
    props.$isComplete &&
    `
    border-color: ${props.theme.colors.primary}80;
    box-shadow: 0 0 20px ${props.theme.colors.primary}30;
  `}
`

export const FormTitle = styled.h3`
  font-size: 1.25rem;
  color: #f3f4f6;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
`

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const FormLabel = styled.label`
  display: block;
  color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

export const FormInput = styled.input`
  width: 100%;
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
`

export const DateInput = styled(FormInput)<{ $isComplete?: boolean }>`
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }

  ${(props) =>
    props.$isComplete &&
    `
    border-color: ${props.theme.colors.primary}80;
    box-shadow: 0 0 0 3px ${props.theme.colors.primary}20, 0 0 15px ${props.theme.colors.primary}30;
    animation: fieldPulse 2s ease-in-out infinite;
  `}

  @keyframes fieldPulse {
    0%, 100% {
      box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}20, 0 0 15px ${(props) => props.theme.colors.primary}30;
    }
    50% {
      box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}40, 0 0 25px ${(props) => props.theme.colors.primary}50;
    }
  }
`

export const FormTextarea = styled.textarea<{ $isComplete?: boolean }>`
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

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #6b7280;
  }

  ${(props) =>
    props.$isComplete &&
    `
    border-color: ${props.theme.colors.primary}80;
    box-shadow: 0 0 0 3px ${props.theme.colors.primary}20, 0 0 15px ${props.theme.colors.primary}30;
    animation: fieldPulse 2s ease-in-out infinite;
  `}

  @keyframes fieldPulse {
    0%, 100% {
      box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}20, 0 0 15px ${(props) => props.theme.colors.primary}30;
    }
    50% {
      box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}40, 0 0 25px ${(props) => props.theme.colors.primary}50;
    }
  }
`

export const DifficultySelector = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const DifficultyButton = styled.button<{ $active: boolean; $isComplete?: boolean }>`
  flex: 1;
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

  ${(props) =>
    props.$isComplete &&
    `
    border-color: ${props.theme.colors.primary}60;
    box-shadow: 0 0 10px ${props.theme.colors.primary}30;
    animation: buttonPulse 2s ease-in-out infinite;
  `}

  @keyframes buttonPulse {
    0%, 100% {
      box-shadow: 0 0 10px ${(props) => props.theme.colors.primary}30;
      border-color: ${(props) => props.theme.colors.primary}60;
    }
    50% {
      box-shadow: 0 0 20px ${(props) => props.theme.colors.primary}50;
      border-color: ${(props) => props.theme.colors.primary}80;
    }
  }
`

export const PhotoUploadArea = styled.div`
  border: 2px dashed rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.05);
  }

  label {
    display: block;
    width: 100%;
    height: 100%;
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

export const FormButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ffff00 0%, #f5e504 100%);
  border: none;
  border-radius: 12px;
  color: #0a0e17;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`
