import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Container = styled(motion.section)`
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 168, 204, 0.05) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(0, 212, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.03) 0%, transparent 50%);
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
  color: #f3f4f6;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const BonusBanner = styled(motion.div)`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;

  gap: 1rem;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);

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
  color: #ffd700;
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
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
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
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: #f3f4f6;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 
      inset 4px 4px 8px rgba(0, 0, 0, 0.4),
      inset -4px -4px 8px rgba(255, 255, 255, 0.02),
      0 0 15px rgba(0, 212, 255, 0.1);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 212, 255, 0.5);
    box-shadow: 
      inset 4px 4px 8px rgba(0, 0, 0, 0.4),
      inset -4px -4px 8px rgba(255, 255, 255, 0.02),
      0 0 20px rgba(0, 212, 255, 0.2);
  }

  &::placeholder {
    color: #6b7280;
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
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  color: #0a0e17;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
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
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 4px 4px 8px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px rgba(255, 255, 255, 0.02);
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
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  border: 2px solid rgba(0, 212, 255, 0.3);

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
`

export const FriendName = styled.div`
  flex: 1;
  color: #f3f4f6;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const InviteButton = styled(motion.button) <{ invited?: boolean }>`
  padding: 0.625rem 1.25rem;
  background: ${(props) => props.invited
    ? 'rgba(0, 212, 255, 0.2)'
    : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)'};
  border: 1px solid ${(props) => props.invited
    ? 'rgba(0, 212, 255, 0.4)'
    : 'rgba(0, 212, 255, 0.3)'};
  border-radius: 10px;
  color: ${(props) => props.invited ? '#00d4ff' : '#0a0e17'};
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: ${(props) => props.invited ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 0 15px ${(props) => props.invited
    ? 'rgba(0, 212, 255, 0.2)'
    : 'rgba(0, 212, 255, 0.3)'};

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
