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

export const ModalContainer = styled(motion.div) <{ $isFullscreen?: boolean }>`
  background: ${(props) => props.theme.colors.dark[800]};
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  border-radius: ${(props) => (props.$isFullscreen ? '0' : '16px')};
  width: 100%;
  max-width: ${(props) => (props.$isFullscreen ? '100%' : '600px')};
  max-height: ${(props) => (props.$isFullscreen ? '100vh' : '90vh')};
  height: ${(props) => (props.$isFullscreen ? '100vh' : 'auto')};
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  overflow: hidden;
  position: ${(props) => (props.$isFullscreen ? 'fixed' : 'relative')};
  top: ${(props) => (props.$isFullscreen ? '0' : 'auto')};
  left: ${(props) => (props.$isFullscreen ? '0' : 'auto')};
  right: ${(props) => (props.$isFullscreen ? '0' : 'auto')};
  bottom: ${(props) => (props.$isFullscreen ? '0' : 'auto')};

  @media (max-width: 640px) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: ${(props) => (props.$isFullscreen ? '0' : '12px 12px 0 0')};
  }
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.dark[600]};
  background: ${(props) => props.theme.colors.dark[800]};

  @media (max-width: 640px) {
    padding: 0.875rem 1rem;
  }
`

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  margin: 0;
  flex: 1;
  padding-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }

  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
    font-size: 1.125rem;
  }
`

export const FullscreenButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }

  @media (max-width: 640px) {
    width: 28px;
    height: 28px;
    font-size: 1.125rem;
  }
`

export const ModalContent = styled.div<{ $isFullscreen?: boolean }>`
  padding: ${(props) => (props.$isFullscreen ? '1rem' : '1rem 1.25rem')};
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  padding-bottom: ${(props) => (props.$isFullscreen ? '80px' : '1rem')};

  @media (max-width: 640px) {
    padding: ${(props) => (props.$isFullscreen ? '0.75rem' : '0.875rem 1rem')};
    gap: 0.75rem;
    padding-bottom: ${(props) => (props.$isFullscreen ? '80px' : '0.875rem')};
  }
`

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: ${(props) => props.theme.colors.dark[700]};
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  border-radius: 10px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}40;
    background: ${(props) => props.theme.colors.dark[700]};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9375rem;
  }
`

export const ButtonGroup = styled.div<{ $isFullscreen?: boolean }>`
  display: flex;
  gap: 0.625rem;
  margin-top: ${(props) => (props.$isFullscreen ? '0' : '0.5rem')};
  justify-content: flex-end;
  padding: ${(props) => (props.$isFullscreen ? '1rem 1.25rem' : '0.75rem 0 0 0')};
  border-top: ${(props) => (props.$isFullscreen ? '2px solid' : '2px solid')} ${(props) => props.theme.colors.dark[600]};
  ${(props) =>
    props.$isFullscreen
      ? `
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${props.theme.colors.dark[800]};
    z-index: 10;
  `
      : ''}

  @media (max-width: 640px) {
    gap: 0.5rem;
    margin-top: ${(props) => (props.$isFullscreen ? '0' : '0.25rem')};
    padding: ${(props) => (props.$isFullscreen ? '0.875rem 1rem' : '0.5rem 0 0 0')};
  }
`

export const SaveButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border: none;
  border-radius: 10px;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
`

export const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: ${(props) => props.theme.colors.dark[700]};
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  border-radius: 10px;
  color: ${(props) => props.theme.colors.light[200]};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.dark[600]};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.light[100]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
`

export const SelectsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0;
  width: 100%;
  align-items: start;

  > * {
    min-width: 0;
    width: 100%;
  }

  @media (max-width: 640px) {
    gap: 0.375rem;
  }
`

export const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  width: 100%;

  /* Уменьшаем размеры селектов внутри модалки */
  > div {
    width: 100%;
    min-width: 0;
  }

  @media (max-width: 640px) {
    gap: 0.25rem;
  }
`

export const SelectLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[300]};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 640px) {
    font-size: 0.6875rem;
  }
`

export const EntryInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem;
  background: ${(props) => props.theme.colors.dark[700]};
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  border-radius: 10px;

  @media (max-width: 640px) {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }
`

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    gap: 0.5rem;
    margin-bottom: 0.375rem;
  }
`

export const InfoLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[300]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const InfoValue = styled.span<{ $color?: string }>`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.$color || props.theme.colors.light[100]};
  padding: 0.25rem 0.625rem;
  background: ${(props) => props.$color ? props.$color + '20' : props.theme.colors.dark[800]};
  border-radius: 6px;
  border: 1px solid ${(props) => props.$color ? props.$color + '40' : props.theme.colors.dark[600]};
`

export const InfoTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`

export const InfoTag = styled.span<{ $color?: string }>`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.$color || props.theme.colors.light[100]};
  padding: 0.25rem 0.625rem;
  background: ${(props) => props.$color ? props.$color + '20' : props.theme.colors.dark[800]};
  border-radius: 6px;
  border: 1px solid ${(props) => props.$color ? props.$color + '40' : props.theme.colors.dark[600]};
`
