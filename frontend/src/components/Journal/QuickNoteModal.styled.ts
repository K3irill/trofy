import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

export const ModalContainer = styled(motion.div)`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 20px;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.dark[600]}80;
`

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  margin: 0;
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark[600]}80;
    color: ${(props) => props.theme.colors.light[100]};
  }
`

export const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}1a;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`

export const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border: none;
  border-radius: 12px;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${(props) => props.theme.colors.primary}4d;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.theme.colors.dark[600]}80;
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.dark[600]};
    color: ${(props) => props.theme.colors.light[100]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const SelectGroup = styled.div`
  margin-bottom: 1rem;
`

export const SelectLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[200]};
  margin-bottom: 0.5rem;
`

export const EntryInfoContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}66 0%, ${(props) => props.theme.colors.dark[800]}99 100%);
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

export const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[200]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 60px;
`

export const InfoValue = styled.span<{ $color?: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.$color || props.theme.colors.light[100]};
  padding: 0.375rem 0.75rem;
  background: ${(props) => props.$color ? props.$color + '33' : props.theme.colors.dark[600]}80;
  border-radius: 8px;
  border: 1px solid ${(props) => props.$color ? props.$color + '66' : props.theme.colors.dark[600]}80;
`

export const InfoTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`

export const InfoTag = styled.span<{ $color?: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.$color || props.theme.colors.light[100]};
  padding: 0.375rem 0.75rem;
  background: ${(props) => props.$color ? props.$color + '33' : props.theme.colors.dark[600]}80;
  border-radius: 8px;
  border: 1px solid ${(props) => props.$color ? props.$color + '66' : props.theme.colors.dark[600]}80;
`
