import styled from 'styled-components'
import { motion } from 'framer-motion'

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 23, 0.95);
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
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%);
  border-radius: 24px;
  padding: 3rem;
  border: 2px solid rgba(0, 212, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 212, 255, 0.2);
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
  background: rgba(55, 65, 81, 0.8);
  border: 2px solid rgba(75, 85, 99, 0.5);
  border-radius: 50%;
  color: #f3f4f6;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(239, 68, 68, 0.8);
    border-color: #ef4444;
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

export const ModalIcon = styled.div<{ unlocked: boolean }>`
  width: 280px;
  height: 280px;
  border-radius: 32px;
  background: ${props => props.unlocked
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.25) 0%, rgba(0, 168, 204, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(55, 65, 81, 0.6) 0%, rgba(31, 41, 55, 0.8) 100%)'};
  border: 3px solid ${props => props.unlocked ? 'rgba(0, 212, 255, 0.6)' : 'rgba(75, 85, 99, 0.6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10rem;
  filter: ${props => props.unlocked
    ? 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.5))'
    : 'grayscale(0.6) brightness(0.7)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.unlocked
    ? '0 20px 60px rgba(0, 212, 255, 0.3)'
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
    background: ${props => props.unlocked
    ? 'radial-gradient(circle at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)'
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

export const ModalImage = styled.img<{ unlocked: boolean }>`
  width: 280px;
  height: 280px;
  border-radius: 32px;
  border: 3px solid ${props => props.unlocked ? 'rgba(0, 212, 255, 0.6)' : 'rgba(75, 85, 99, 0.6)'};
  object-fit: cover;
  filter: ${props => props.unlocked
    ? 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.5))'
    : 'grayscale(0.6) brightness(0.7)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.unlocked
    ? '0 20px 60px rgba(0, 212, 255, 0.3)'
    : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  cursor: pointer;
  position: relative;
  background: ${props => props.unlocked
    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 168, 204, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(55, 65, 81, 0.3) 0%, rgba(31, 41, 55, 0.5) 100%)'};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.unlocked
    ? 'radial-gradient(circle at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%)'
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
  color: #f3f4f6;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const ModalDescription = styled.p`
  font-size: 1.125rem;
  color: #d1d5db;
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
