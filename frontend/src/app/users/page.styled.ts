import styled from 'styled-components'
import { motion } from 'framer-motion'

export const PageHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const TitleIcon = styled.span`
  color: ${props => props.theme.colors.primary};
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  flex-shrink: 0;
`

export const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin-bottom: 2rem;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  background: linear-gradient(145deg, ${props => props.theme.colors.dark[700]}e6 0%, ${props => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.theme.colors.dark[600]}80;
  border-radius: 16px;
  color: ${props => props.theme.colors.light[100]};
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 0;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.glow.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.light[300]};
  }

  @media (max-width: 768px) {
    padding: 0.875rem 0.875rem 0.875rem 3rem;
    font-size: 0.875rem;
  }
`

export const SearchIcon = styled.span`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  width: 1.5rem;
  height: 1.5rem;

  @media (max-width: 768px) {
    left: 1rem;
    font-size: 1.25rem;
    width: 1.25rem;
    height: 1.25rem;
  }
`

export const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active
    ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`
    : `linear-gradient(145deg, ${props.theme.colors.dark[700]}e6 0%, ${props.theme.colors.dark[800]}f2 100%)`};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : `${props.theme.colors.dark[600]}80`};
  border-radius: 12px;
  color: ${props => props.$active ? props.theme.colors.dark.bg : props.theme.colors.light[100]};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow.primary};
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.875rem;
  }
`

export const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const UserCard = styled(motion.div)`
  background: linear-gradient(145deg, ${props => props.theme.colors.dark[700]}e6 0%, ${props => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${props => props.theme.colors.dark[600]}80;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.glass.medium}, ${props => props.theme.shadows.glow.primary};

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
`

export const Avatar = styled.div<{ $level?: number }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark.bg};
  position: relative;
  border: 2px solid ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.glow.primary};
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    border-width: 2px;
  }
`

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const Username = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light[100]};
  font-weight: 700;
  margin-bottom: 0.25rem;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.125rem;
  }
`

export const UserBio = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.light[300]};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    -webkit-line-clamp: 1;
  }
`

export const UserStats = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
`

export const StatBadge = styled.div`
  background: ${props => `${props.theme.colors.primary}1a`};
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${props => `${props.theme.colors.primary}33`};
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 0.375rem 0.5rem;
    gap: 0.375rem;
    flex: 1 1 calc(50% - 0.25rem);
    min-width: calc(50% - 0.25rem);
  }
`

export const StatValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

export const StatLabel = styled.span`
  color: ${props => props.theme.colors.light[300]};
  font-size: 0.75rem;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`

export const TopUsersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
`

export const TopUsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const RankBadge = styled.div<{ $rank: number }>`
  position: absolute;
  top: ${props => props.$rank <= 3 ? '-20px' : '0.75rem'};
  ${props => props.$rank <= 3 ? 'left: 50%; transform: translateX(-50%);' : 'right: 0.75rem;'}
  font-size: ${props => props.$rank <= 3 ? '2.5rem' : '0.875rem'};
  font-weight: ${props => props.$rank <= 3 ? 'normal' : '700'};
  color: ${props => props.$rank <= 3 ? 'inherit' : props.theme.colors.light[300]};
  filter: ${props => props.$rank <= 3 ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'};
  z-index: 1;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: ${props => props.$rank <= 3 ? '2rem' : '0.75rem'};
    top: ${props => props.$rank <= 3 ? '-15px' : '0.5rem'};
    ${props => props.$rank <= 3 ? '' : 'right: 0.5rem;'}
  }
`

export const TopUserCard = styled(motion.div) <{ $rank: number }>`
  background: linear-gradient(145deg, ${props => props.theme.colors.dark[700]}e6 0%, ${props => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${props => {
    if (props.$rank === 1) return props.theme.colors.primary
    if (props.$rank === 2) return props.theme.colors.secondary
    if (props.$rank === 3) return props.theme.colors.secondary
    return `${props.theme.colors.dark[600]}80`
  }};
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease;
  padding-top: ${props => props.$rank <= 3 ? '2.5rem' : '1.5rem'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: ${props => props.$rank <= 3 ? '2rem' : '1rem'};
    border-radius: 12px;
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.light[300]};
`

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
`

export const EmptyStateText = styled.div`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`

export const EmptyStateSubtext = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
`
