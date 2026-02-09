import styled from 'styled-components'
import { motion } from 'framer-motion'

export const HeaderContainer = styled(motion.nav)`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
  border-bottom: 2px solid #374151;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  padding: 0;
`

export const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    display: none;
  }
`

export const NavLink = styled(motion.a) <{ active: boolean }>`
  color: ${(props) => props.active ? '#00ff88' : '#d1d5db'};
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: #00ff88;
    transform: scaleX(${(props) => props.active ? '1' : '0'});
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #00ff88;
    background: rgba(0, 255, 136, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
  }
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1024px) {
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: 2px solid #374151;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`

export const LevelBadge = styled.div`
  background: linear-gradient(135deg, #a855f7 0%, #ff00ff 100%);
  color: #0a0e17;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;

  @media (max-width: 768px) {
    padding: 0.2rem 0.5rem;
    font-size: 0.625rem;
  }
`

export const UserName = styled.div`
  color: #f3f4f6;
  font-weight: 600;
  font-size: 0.875rem;

  @media (max-width: 1024px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const HamburgerButton = styled(motion.button)`
  display: none;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #f3f4f6;

  @media (max-width: 768px) {
    display: flex;
  }
`

export const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: #1f2937;
  border-bottom: 2px solid #374151;
  padding: 1rem;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    display: flex;
  }
`
