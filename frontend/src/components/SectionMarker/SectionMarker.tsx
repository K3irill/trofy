'use client'

import { motion } from 'framer-motion'
import { Marker } from './SectionMarker.styled'

interface SectionMarkerProps {
  initial?: { opacity: number; scaleY: number }
  animate?: { opacity: number; scaleY: number }
  transition?: { duration: number }
}

export const SectionMarker = ({
  initial = { opacity: 0, scaleY: 0 },
  animate = { opacity: 1, scaleY: 1 },
  transition = { duration: 0.3 },
}: SectionMarkerProps) => {
  return (
    <Marker
      initial={initial}
      animate={animate}
      transition={transition}
    />
  )
}
