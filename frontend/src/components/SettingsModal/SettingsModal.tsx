'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  SettingsModalOverlay,
  SettingsModalContainer,
  SettingsModalHeader,
  SettingsModalTitle,
  SettingsModalCloseButton,
  SettingsBackButton,
  SettingsContent,
  SettingsCategoryList,
  SettingsCategoryItem,
  SettingsCategoryIcon,
  SettingsCategoryText,
  SettingsCategoryArrow,
} from './SettingsModal.styled'
import { ThemeSelector } from '@/components/ThemeSelector'

type SettingsView = 'categories' | 'theme'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: SettingsView
}

export const SettingsModal = ({ isOpen, onClose, initialView = 'categories' }: SettingsModalProps) => {
  const [currentView, setCurrentView] = useState<SettingsView>(initialView)

  const handleCategoryClick = (view: SettingsView) => {
    setCurrentView(view)
  }

  const handleBack = () => {
    setCurrentView('categories')
  }

  const handleClose = () => {
    setCurrentView('categories')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <SettingsModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <SettingsModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsModalHeader>
              {currentView !== 'categories' && (
                <SettingsBackButton onClick={handleBack}>
                  ← Назад
                </SettingsBackButton>
              )}
              <SettingsModalTitle>
                {currentView === 'categories' ? 'Настройки' : 'Тема оформления'}
              </SettingsModalTitle>
              <SettingsModalCloseButton onClick={handleClose}>✕</SettingsModalCloseButton>
            </SettingsModalHeader>

            <SettingsContent>
              <AnimatePresence mode="wait">
                {currentView === 'categories' ? (
                  <SettingsCategoryList
                    key="categories"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <SettingsCategoryItem onClick={() => handleCategoryClick('theme')}>
                      <SettingsCategoryIcon>🎨</SettingsCategoryIcon>
                      <SettingsCategoryText>Тема оформления</SettingsCategoryText>
                      <SettingsCategoryArrow>→</SettingsCategoryArrow>
                    </SettingsCategoryItem>
                  </SettingsCategoryList>
                ) : (
                  <motion.div
                    key="theme"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ThemeSelector />
                  </motion.div>
                )}
              </AnimatePresence>
            </SettingsContent>
          </SettingsModalContainer>
        </SettingsModalOverlay>
      )}
    </AnimatePresence>
  )
}
