import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.colors.dark.bg}f2;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const ModalContainer = styled(motion.div)`
  position: relative;
  max-width: 600px;
  width: 100%;
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}fa 0%, ${(props) => props.theme.colors.dark[800]}fa 100%);
  border-radius: 24px;
  padding: 3rem;
  border: 2px solid ${(props) => props.theme.colors.primary}4d;
  box-shadow: 0 20px 60px ${(props) => props.theme.colors.primary}33;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    gap: 1.5rem;
  }
`

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: ${(props) => props.theme.colors.dark[600]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: ${(props) => props.theme.colors.danger}cc;
    border-color: ${(props) => props.theme.colors.danger};
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
    top: 0.75rem;
    right: 0.75rem;
  }
`

export const ModalIcon = styled.div<{ $unlocked: boolean }>`
  width: 280px;
  height: 280px;
  border-radius: 32px;
  background: ${props => props.$unlocked
    ? `linear-gradient(135deg, ${props.theme.colors.primary}40 0%, ${props.theme.colors.secondary}26 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]}99 0%, ${props.theme.colors.dark[700]}cc 100%)`};
  border: 3px solid ${props => props.$unlocked ? `${props.theme.colors.primary}99` : `${props.theme.colors.dark[600]}99`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10rem;
  filter: ${props => props.$unlocked
    ? `drop-shadow(0 0 40px ${props.theme.colors.primary}80)`
    : 'grayscale(0.6) brightness(0.7)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$unlocked
    ? `0 20px 60px ${props.theme.colors.primary}4d`
    : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$unlocked
    ? `radial-gradient(circle at center, ${props.theme.colors.primary}26 0%, transparent 70%)`
    : 'transparent'};
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    font-size: 7rem;
    border-radius: 24px;
  }
`

export const ModalImage = styled.div<{ $unlocked: boolean }>`
  width: 280px;
  height: 280px;
  border-radius: 32px;
  border: 3px solid ${props => props.$unlocked ? `${props.theme.colors.primary}99` : `${props.theme.colors.dark[600]}99`};
  filter: ${props => props.$unlocked
    ? `drop-shadow(0 0 40px ${props.theme.colors.primary}80)`
    : 'grayscale(0.6) brightness(0.7)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$unlocked
    ? `0 20px 60px ${props.theme.colors.primary}4d`
    : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  cursor: pointer;
  position: relative;
  background: ${props => props.$unlocked
    ? `linear-gradient(135deg, ${props.theme.colors.primary}1a 0%, ${props.theme.colors.secondary}0d 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]}4d 0%, ${props.theme.colors.dark[700]}80 100%)`};
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$unlocked
    ? `radial-gradient(circle at center, ${props.theme.colors.primary}1a 0%, transparent 70%)`
    : 'transparent'};
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border-radius: 32px;
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    border-radius: 24px;
  }
`

export const ModalContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`

export const ModalTitle = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const ModalDescription = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.light[200]};
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
