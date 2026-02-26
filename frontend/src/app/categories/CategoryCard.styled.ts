import styled from 'styled-components'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const CategoryTypeBadge = styled.div<{ $isCustom: boolean }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${(props) => props.$isCustom
    ? `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}33 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[700]}e6 0%, ${props.theme.colors.dark[800]}f2 100%)`};
  border: 1px solid ${(props) => props.$isCustom
    ? `${props.theme.colors.primary}80`
    : `${props.theme.colors.dark[600]}80`};
  border-radius: 8px;
  color: ${(props) => props.$isCustom
    ? props.theme.colors.primary
    : props.theme.colors.light[300]};
  font-size: 0.65rem;
  font-weight: 600;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  svg {
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    gap: 0.25rem;
    left: 0.5rem;

    span{
      display:none;
    }

    svg {
      font-size: 0.75rem;
    }
  }
`

export const EditButton = styled(motion.button)`
  position: absolute;
  top: 3.5rem;
  left: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `linear-gradient(135deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}33 100%)`};
  border: 1px solid ${(props) => `${props.theme.colors.primary}80`};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    background: ${(props) => `linear-gradient(135deg, ${props.theme.colors.primary}4d 0%, ${props.theme.colors.secondary}4d 100%)`};
    border-color: ${(props) => props.theme.colors.primary};
    transform: scale(1.1);
  }

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
    left: 0.5rem;
    top: 3rem;

    svg {
      font-size: 1rem;
    }
  }
`

export const CreatorInfo = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

export const CreatorLink = styled(Link)`
  color: rgba(0, 212, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(0, 212, 255, 1);
  }
`
