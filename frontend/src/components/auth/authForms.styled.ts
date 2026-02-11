import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const Label = styled.label`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
`

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  background: ${(props) => props.theme.colors.dark[800]};
  border: 1px solid
    ${(props) =>
    props.$hasError
      ? props.theme.colors.danger || '#ef4444'
      : props.theme.colors.dark[700]};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${(props) => props.theme.colors.primary}33;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`

export const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.danger || '#ef4444'};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export const SubmitButton = styled.div`
  margin-top: 0.5rem;
`

export const TogglePasswordButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ToggleContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: ${(props) => props.theme.colors.dark[800]};
  border-radius: 12px;
  padding: 0.25rem;
`

export const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.625rem 1rem;
  background: ${(props) =>
    props.$active ? props.theme.colors.primary : 'transparent'};

  border: none;
  border-radius: 8px;
  color: ${(props) =>
    props.$active
      ? props.theme.colors.dark[900]
      : 'rgba(255, 255, 255, 0.6)'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.colors.light[100]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
