import styled from 'styled-components'
import { motion } from 'framer-motion'

export const SVGDefs = styled.defs`
  display: none;
`

export const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  position: relative;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const CategoryCard = styled(motion.div)`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
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
    background: linear-gradient(90deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.shadows.glass.medium}, ${(props) => props.theme.shadows.glow.primary};

   
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${(props) => `${props.theme.colors.primary}26`} 0%, ${(props) => `${props.theme.colors.secondary}1a`} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border: 2px solid ${(props) => `${props.theme.colors.primary}4d`};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transition: all 0.3s ease;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
`

export const CategoryName = styled.h3`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const CategoryStats = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

export const StatItem = styled.div`
  background: ${(props) => `${props.theme.colors.primary}1a`};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${(props) => `${props.theme.colors.primary}33`};

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
  }
`

export const StatLabel = styled.span`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const StatValue = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const ProgressRing = styled.div<{ progress: number }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(
    from 0deg,
    ${(props) => `${props.theme.colors.primary}26`} 0deg,
    ${(props) => `${props.theme.colors.primary}26`} ${props => props.progress * 3.6}deg,
    transparent ${props => props.progress * 3.6}deg,
    transparent 360deg
  );
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  transition: all 0.5s ease;

  &::before {
    content: '${props => props.progress}%';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.75rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.light[100]};
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    top: 0.75rem;
    right: 0.75rem;

    &::before {
      font-size: 0.625rem;
    }
  }
`

export const AchievementPreview = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`

export const PreviewItem = styled.div<{ unlocked: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.unlocked
    ? `linear-gradient(145deg, ${props.theme.colors.primary}33 0%, ${props.theme.colors.secondary}1a 100%)`
    : `linear-gradient(145deg, ${props.theme.colors.dark[700]}cc 0%, ${props.theme.colors.dark[800]}e6 100%)`};
  border: 2px solid ${props => props.unlocked ? `${props.theme.colors.primary}80` : `${props.theme.colors.dark[600]}80`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: ${props => props.unlocked ? 1 : 0.4};
  transition: all 0.3s ease;
  position: relative;
  filter: ${props => props.unlocked ? `drop-shadow(${props.theme.shadows.glow.primary})` : 'grayscale(0.5)'};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.1);
    ${props => props.unlocked && `filter: drop-shadow(${props.theme.shadows.glow.primary});`}
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
`

export const AchievementCount = styled.span`
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  color: ${(props) => props.theme.colors.dark.bg};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid ${(props) => props.theme.colors.dark.bg};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 0.625rem;
  }
`
export const PageHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`


export const TumblerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  z-index: 10;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    gap: 0.5rem;
    align-self: flex-end;
  }
`

export const TumblerTrack = styled.div`
  width: 60px;
  height: 32px;
  background: ${(props) => props.theme.colors.dark[700]};
  border-radius: 16px;
  position: relative;
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  cursor: pointer;
`

export const TumblerThumb = styled.div<{ position: number }>`
  position: absolute;
  top: 2px;
  left: ${props => props.position === 0 ? '2px' : '28px'};
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
`

export const ViewLabel = styled.span`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const Label = styled.button<{ active: boolean }>`
  background: ${props => props.active ? `${props.theme.colors.primary}33` : 'transparent'};
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border-radius: 12px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => `${props.theme.colors.primary}1a`};
    border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.dark[600]};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
  }
`

export const ListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

const getRarityColorForList = (theme: { colors: { rarity: { base?: string; common?: string; rare: string; epic: string; legendary: string }; dark: { [key: number]: string;[key: string]: string }; light: { [key: number]: string;[key: string]: string } }; shadows: { glass: { light: string } } }, rarity?: string) => {
  if (!rarity) return theme.colors.dark[600]
  const rarityColors = theme.colors.rarity
  switch (rarity) {
    case 'common':
      return rarityColors.base || rarityColors.common || theme.colors.light[300]
    case 'rare':
      return rarityColors.rare
    case 'epic':
      return rarityColors.epic
    case 'legendary':
      return rarityColors.legendary
    default:
      return theme.colors.dark[600]
  }
}

export const ListItem = styled(motion.div) <{ rarity?: string; unlocked?: boolean }>`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 2px solid ${(props) => {
    if (!props.unlocked) return `${props.theme.colors.dark[600]}80`
    const rarityColor = getRarityColorForList(props.theme, props.rarity)
    return `${rarityColor}80`
  }};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, ${(props) => {
    if (!props.unlocked) return props.theme.colors.dark[600]
    const rarityColor = getRarityColorForList(props.theme, props.rarity)
    return rarityColor
  }} 0%, ${(props) => {
    if (!props.unlocked) return props.theme.colors.dark[600]
    const rarityColor = getRarityColorForList(props.theme, props.rarity)
    return `${rarityColor}cc`
  }} 100%);
    opacity: ${(props) => (props.unlocked ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${(props) => {
    if (!props.unlocked) return props.theme.colors.dark[600]
    return getRarityColorForList(props.theme, props.rarity)
  }};
    transform: translateX(8px);
    box-shadow: ${(props) => {
    if (!props.unlocked) return props.theme.shadows.glass.light
    const rarityColor = getRarityColorForList(props.theme, props.rarity)
    return `${props.theme.shadows.glass.light}, 0 0 20px ${rarityColor}40`
  }};

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;

    &:hover {
      transform: translateX(4px);
    }
  }
`

export const ListItemIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${(props) => `${props.theme.colors.primary}26`} 0%, ${(props) => `${props.theme.colors.secondary}1a`} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid ${(props) => `${props.theme.colors.primary}4d`};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
  }
`

export const ListItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ListItemName = styled.h3`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

export const ListItemStats = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

export const CosmosContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 50%, #050508 100%);
  position: relative;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    height: calc(100vh - 150px);
    cursor: default;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, #ffffff33, transparent),
      radial-gradient(2px 2px at 40px 70px, #ffffff33, transparent),
      radial-gradient(1px 1px at 90px 40px, #ffffff33, transparent),
      radial-gradient(2px 2px at 160px 120px, #ffffff33, transparent),
      radial-gradient(1px 1px at 230px 80px, #ffffff33, transparent),
      radial-gradient(2px 2px at 300px 150px, #ffffff33, transparent),
      radial-gradient(1px 1px at 350px 200px, #ffffff33, transparent),
      radial-gradient(2px 2px at 420px 100px, #ffffff33, transparent),
      radial-gradient(1px 1px at 500px 180px, #ffffff33, transparent),
      radial-gradient(2px 2px at 580px 60px, #ffffff33, transparent);
    background-size: 600px 300px;
    animation: twinkle 5s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`

export const TreeContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  background: radial-gradient(ellipse at bottom, #1a1a2e 0%, #0f0f1a 50%, #050508 100%);
  position: relative;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    height: calc(100vh - 150px);
    cursor: default;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, #ffffff33, transparent),
      radial-gradient(2px 2px at 40px 70px, #ffffff33, transparent),
      radial-gradient(1px 1px at 90px 40px, #ffffff33, transparent),
      radial-gradient(2px 2px at 160px 120px, #ffffff33, transparent),
      radial-gradient(1px 1px at 230px 80px, #ffffff33, transparent),
      radial-gradient(2px 2px at 300px 150px, #ffffff33, transparent),
      radial-gradient(1px 1px at 350px 200px, #ffffff33, transparent),
      radial-gradient(2px 2px at 420px 100px, #ffffff33, transparent),
      radial-gradient(1px 1px at 500px 180px, #ffffff33, transparent),
      radial-gradient(2px 2px at 580px 60px, #ffffff33, transparent);
    background-size: 600px 300px;
    animation: twinkle 5s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`

export const PlanetTooltip = styled(motion.div)`
  position: absolute;
  background: ${(props) => props.theme.colors.dark.glass};
  border: 1px solid ${(props) => `${props.theme.colors.primary}4d`};
  border-radius: 12px;
  padding: 1rem;
  min-width: 150px;
  backdrop-filter: ${(props) => props.theme.glass.blur};
  pointer-events: none;
  z-index: 10;

  .planet-tooltip-icon {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .planet-tooltip-name {
    font-size: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.light[100]};
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .planet-tooltip-stats {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.primary};
    text-align: center;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: 0.75rem;

    .planet-tooltip-icon {
      font-size: 1.5rem;
    }

    .planet-tooltip-name {
      font-size: 0.875rem;
    }

    .planet-tooltip-stats {
      font-size: 0.75rem;
    }
  }
`

export const NodeTooltip = styled(motion.div)`
  position: absolute;
  background: ${(props) => props.theme.colors.dark.glass};
  border: 1px solid ${(props) => `${props.theme.colors.primary}4d`};
  border-radius: 12px;
  padding: 1rem;
  min-width: 160px;
  backdrop-filter: ${(props) => props.theme.glass.blur};
  pointer-events: none;
  z-index: 10;
  transform: translateX(-50%);

  .node-tooltip-icon {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .node-tooltip-name {
    font-size: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.light[100]};
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .node-tooltip-stats {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.primary};
    text-align: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .node-tooltip-hint {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colors.light[300]};
    text-align: center;
    font-style: italic;
  }

  @media (max-width: 768px) {
    min-width: 130px;
    padding: 0.75rem;

    .node-tooltip-icon {
      font-size: 1.5rem;
    }

    .node-tooltip-name {
      font-size: 0.875rem;
    }

    .node-tooltip-stats {
      font-size: 0.75rem;
    }

    .node-tooltip-hint {
      font-size: 0.6875rem;
    }
  }
`

export const AchievementBadge = styled.div<{ unlocked: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.unlocked
    ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`
    : `linear-gradient(135deg, ${props.theme.colors.dark[600]} 0%, ${props.theme.colors.dark[700]} 100%)`};
  border: 2px solid ${props => props.unlocked ? props.theme.colors.primary : props.theme.colors.dark[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  filter: ${props => props.unlocked ? `drop-shadow(${props.theme.shadows.glow.primary})` : 'none'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
`

export const TreeCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

export const TreeNode = styled(motion.div) <{ size: number; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.color}40 0%, ${props => props.color}20 100%);
  border: 3px solid ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size * 0.4}px;
  cursor: pointer;
  box-shadow: 0 0 20px ${props => props.color}30;
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 2px solid ${props => props.color};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 0.4; }
  }

  @media (max-width: 768px) {
    width: ${props => props.size * 0.8}px;
    height: ${props => props.size * 0.8}px;
    font-size: ${props => props.size * 0.35}px;
  }
`

export const TreeAchievementNode = styled(motion.div) <{ size: number; color: string; state: 'locked' | 'unlocked' | 'available' }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 12px;
  background: ${props => props.state === 'locked'
    ? 'linear-gradient(135deg, #4b5563 0%, #374151 100%)'
    : `linear-gradient(135deg, ${props.color}40 0%, ${props.color}20 100%)`};
  border: 2px solid ${props => props.state === 'locked' ? '#6b7280' : props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size * 0.5}px;
  cursor: ${props => props.state === 'locked' ? 'not-allowed' : 'pointer'};
  box-shadow: 0 0 15px ${props => props.color}20;
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;

  ${props => props.state === 'available' && `
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 14px;
      border: 1px solid ${props.color};
      animation: available-pulse 2s ease-in-out infinite;
    }
  `}

  ${props => props.state === 'unlocked' && `
    box-shadow: 0 0 20px ${props.color}50;
    &::before {
      content: '✓';
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      background: ${props.color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #0a0e17;
      font-weight: bold;
    }
  `}

  ${props => props.state === 'locked' && `
    opacity: 0.5;
    filter: grayscale(0.5);
    &::after {
      content: '🔒';
      position: absolute;
      top: -6px;
      right: -6px;
      width: 16px;
      height: 16px;
      background: #374151;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
    }
  `}

  @keyframes available-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  @media (max-width: 768px) {
    width: ${props => props.size * 0.85}px;
    height: ${props => props.size * 0.85}px;
    font-size: ${props => props.size * 0.45}px;
  }
`

export const TreeBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.light[300]};

  button {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border: 1px solid ${(props) => `${props.theme.colors.primary}66`};
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    color: ${(props) => props.theme.colors.primary};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: ${(props) => `${props.theme.colors.primary}33`};
      border-color: ${(props) => props.theme.colors.primary};
    }
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;

    button {
      padding: 0.3rem 0.6rem;
      font-size: 0.75rem;
    }
  }
`

export const TreeBackButton = styled.button`
  background: ${(props) => `${props.theme.colors.primary}1a`};
  border: 1px solid ${(props) => `${props.theme.colors.primary}66`};
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}33`};
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
`