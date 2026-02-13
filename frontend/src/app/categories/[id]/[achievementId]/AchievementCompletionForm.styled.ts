import styled from 'styled-components'

export const FormContainer = styled.div<{ $isComplete?: boolean }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
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
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;
  margin: 0 0 1.5rem 0;
`

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const FormLabel = styled.label`
  display: block;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}1a;
  }
`

export const DateInput = styled(FormInput) <{ $isComplete?: boolean; $hasError?: boolean }>`
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }

  border-color: ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.dark[600]}80;

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

export const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
`

export const FormTextarea = styled.textarea<{ $isComplete?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}1a;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
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
  border: 2px dashed ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}0d;
  }

  label {
    display: block;
    width: 100%;
    height: 100%;
    color: ${(props) => props.theme.colors.light[300]};
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

export const FormButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.success} 0%, ${(props) => props.theme.colors.success} 100%);
  border: none;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${(props) => props.theme.colors.primary}4d;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${(props) => props.theme.colors.primary}66;
  }

  &:active {
    transform: translateY(0);
  }
`
