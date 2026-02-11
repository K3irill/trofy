'use client'

import { useMemo } from 'react'
import styled from 'styled-components'

const IconsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`

const Icon = styled.div<{ $x: number; $y: number; $size: number; $rotation: number; $opacity: number }>`
  position: absolute;
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  font-size: ${(props) => props.$size}px;
  opacity: ${(props) => props.$opacity};
  transform: translate(-50%, -50%) rotate(${(props) => props.$rotation}deg);
  user-select: none;
  filter: blur(0.5px);
  transition: opacity 0.3s ease;
`

interface BackgroundIconsProps {
  icons: string[]
  count?: number
}

export function BackgroundIcons({ icons, count = 15 }: BackgroundIconsProps) {
  const iconPositions = useMemo(() => {
    if (icons.length === 0) return []

    const positions: Array<{
      icon: string
      x: number
      y: number
      size: number
      rotation: number
      opacity: number
    }> = []

    for (let i = 0; i < count; i++) {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)]
      positions.push({
        icon: randomIcon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 40, // Размер от 20 до 60px
        rotation: Math.random() * 360,
        opacity: 0.08 + Math.random() * 0.12, // Прозрачность от 0.08 до 0.2
      })
    }

    return positions
  }, [icons, count])

  if (icons.length === 0) return null

  return (
    <IconsContainer>
      {iconPositions.map((pos, index) => (
        <Icon
          key={index}
          $x={pos.x}
          $y={pos.y}
          $size={pos.size}
          $rotation={pos.rotation}
          $opacity={pos.opacity}
        >
          {pos.icon}
        </Icon>
      ))}
    </IconsContainer>
  )
}
