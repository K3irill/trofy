import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Container = styled(motion.section)`
  background: linear-gradient(135deg, ${(props) => `${props.theme.colors.primary}1a`} 0%, ${(props) => `${props.theme.colors.secondary}0d`} 100%);
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: 1px solid ${(props) => `${props.theme.colors.primary}33`};
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 
    ${(props) => props.theme.shadows.glass.heavy},
    0 0 40px ${(props) => `${props.theme.colors.primary}1a`};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${(props) => `${props.theme.colors.primary}08`} 0%, transparent 50%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`

export const Header = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const Title = styled.h3`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const BonusBanner = styled(motion.div)`
  background: ${(props) => `${props.theme.colors.gold}1a`};
  border: 1px solid ${(props) => `${props.theme.colors.gold}4d`};
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;

  gap: 1rem;
  box-shadow: ${(props) => props.theme.shadows.glow.gold};

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
    flex-direction: column;
    gap: 0.75rem;
  }
`

export const BonusIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const BonusText = styled.p`
  color: ${(props) => props.theme.colors.gold};
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const BonusHighlight = styled.span`
  font-weight: 700;
  text-shadow: ${(props) => props.theme.shadows.glow.gold};
`

export const FormContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

export const InputField = styled.input`
  flex: 1;
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  box-shadow: ${(props) => props.theme.shadows.neomorph.dark};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    box-shadow: 
      ${(props) => props.theme.shadows.neomorph.dark},
      ${(props) => props.theme.shadows.glow.primary};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => `${props.theme.colors.primary}80`};
    box-shadow: 
      ${(props) => props.theme.shadows.neomorph.dark},
      ${(props) => props.theme.shadows.glow.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.dark[600]};
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 0.8125rem;
  }
`

export const SendButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border: 1px solid ${(props) => `${props.theme.colors.primary}4d`};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.8125rem;
    justify-content: center;
  }
`

export const RocketIcon = styled.span`
  font-size: 1.125rem;
`

export const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const FriendItem = styled(motion.div)`
  background: ${(props) => props.theme.colors.dark.neomorphDark};
  border: 1px solid ${(props) => props.theme.colors.neomorphLight};
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: ${(props) => props.theme.shadows.neomorph.flat};
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.875rem;
    border-radius: 12px;
    gap: 0.75rem;
  }
`

export const FriendAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  border: 2px solid ${(props) => `${props.theme.colors.primary}4d`};

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
`

export const FriendName = styled.div`
  flex: 1;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const InviteButton = styled(motion.button) <{ invited?: boolean }>`
  padding: 0.625rem 1.25rem;
  background: ${(props) => props.invited
    ? `${props.theme.colors.primary}33`
    : `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border: 1px solid ${(props) => props.invited
    ? `${props.theme.colors.primary}66`
    : `${props.theme.colors.primary}4d`};
  border-radius: 10px;
  color: ${(props) => props.invited ? props.theme.colors.primary : props.theme.colors.dark.bg};
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: ${(props) => props.invited ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: ${(props) => props.invited
    ? props.theme.shadows.glow.primary
    : props.theme.shadows.glow.primary};

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
`

export const FriendsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

export const VKShareButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #0077ff 0%, #0055b3 100%);
  border: 1px solid rgba(0, 119, 255, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 119, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📱';
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: 0 0 30px rgba(0, 119, 255, 0.6);
    transform: translateY(-2px);
    background: linear-gradient(135deg, #0088ff 0%, #0066cc 100%);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
    width: 100%;
    justify-content: center;
  }
`
