import styled from 'styled-components'
import { motion } from 'framer-motion'

export const HeaderContainer = styled(motion.header)`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 32, 44, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 0;
`

export const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  position: relative;

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
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const Logo = styled.div`
position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  margin-right: 20px;

  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const LogoSymbol = styled.span`
  display: none;
  font-size: 1.75rem;

  &::before{
    content: '';
    position: absolute;
    inset: 0;
    display: block;
    z-index: -1;
    filter: drop-shadow(0 0 5px rgba(0, 212, 255, 0.5));
  }
`

export const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
`

export const NavLink = styled(motion.a) <{ active: boolean }>`
  color: ${(props) => props.active ? '#00d4ff' : '#d1d5db'};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  background: ${(props) => props.active ? 'rgba(0, 212, 255, 0.1)' : 'transparent'};
  border: 1px solid ${(props) => props.active ? 'rgba(0, 212, 255, 0.3)' : 'transparent'};

  &:hover {
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(45, 55, 72, 0.5);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  border: 2px solid rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`

export const LevelBadge = styled.div`
  background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
  color: #0a0e17;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  height: fit-content;  width: fit-content;

  @media (max-width: 768px) {
    padding: 0.2rem 0.5rem;
    font-size: 0.625rem;
  }
`

export const UserName = styled.div`
  color: #f3f4f6;
  font-weight: 600;
  font-size: 0.8125rem;

  @media (max-width: 1024px) {
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const NotificationIcon = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    background: #ff4444;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
  }

  &:hover {
    background: rgba(45, 55, 72, 0.5);
    transform: scale(1.1);
  }

  

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }
`

export const CreateButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  color: #0a0e17;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;

  span {
    font-size: 1.1rem;
    line-height: 1;
    position: relative;
    top: 2px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.5);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`



export const UserProfileMenu = styled(motion.div)`
  position: absolute;
  top: 82px;
  right: 1.5rem;
  background: rgba(26, 32, 44, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.75rem;
  min-width: 180px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  z-index: 1001;

  div {
    padding: 0.75rem 1rem;
    color: #f3f4f6;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 212, 255, 0.1);
      color: #00d4ff;
    }

    &:not(:last-child) {
      margin-bottom: 0.25rem;
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`

export const HamburgerButton = styled(motion.button)`
  display: none;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #f3f4f6;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`

export const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  z-index: 100;
  top: 64px;
  left: 0;
  right: 0;
  background: rgba(26, 32, 44, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  max-height: calc(100vh - 64px);
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: flex;
  }

  ${CreateButton}{
    display: block;
  }
`
export const MobileMenuHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;

  ${UserName}{
    display: block;
  }
`

export const MobileMenuActions = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const MobileMenuActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 5px 10px;
  height: 40px;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.25rem;
  color: #f3f4f6;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
  }
`



