import styled from 'styled-components'
import { motion } from 'framer-motion'

export const SettingsModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`

export const SettingsModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: ${(props) => props.theme.glass.radius};
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: ${(props) => props.theme.glass.radius} ${(props) => props.theme.glass.radius} 0 0;
  }
`

export const SettingsModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: ${(props) => props.theme.glass.border};
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const SettingsModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.light[100]};
  flex: 1;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const SettingsModalCloseButton = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    color: ${(props) => props.theme.colors.light[100]};
  }

  @media (max-width: 768px) {
    right: 1rem;
  }
`

export const SettingsBackButton = styled.button`
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
  }

  @media (max-width: 768px) {
    left: 1rem;
    font-size: 0.875rem;
  }
`

export const SettingsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const SettingsCategoryList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const SettingsCategoryItem = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.75rem;
  }
`

export const SettingsCategoryIcon = styled.span`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.dark.glass};
  border-radius: 10px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    width: 36px;
    height: 36px;
  }
`

export const SettingsCategoryText = styled.span`
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.light[100]};

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const SettingsCategoryArrow = styled.span`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 1.25rem;
  transition: transform 0.2s ease;

  ${SettingsCategoryItem}:hover & {
    transform: translateX(4px);
  }
`
