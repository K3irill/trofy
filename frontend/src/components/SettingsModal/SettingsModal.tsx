'use client'

import { useState, useCallback, useMemo } from 'react'
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
  SettingsSection,
  SettingsRow,
  SettingsRowText,
  SettingsRowTitle,
  SettingsRowDescription,
  SettingsToggle,
} from './SettingsModal.styled'
import { ThemeSelector } from '@/components/ThemeSelector'
import { useGetMeQuery, useUpdateMeMutation } from '@/store/api/userApi'
import type { PrivacySettings } from '@/types'

type SettingsView = 'categories' | 'theme' | 'privacy'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: SettingsView
}

export const SettingsModal = ({ isOpen, onClose, initialView = 'categories' }: SettingsModalProps) => {
  const [currentView, setCurrentView] = useState<SettingsView>(initialView)
  const { data: me } = useGetMeQuery(undefined, { skip: !isOpen })
  const [updateMe, { isLoading: isUpdatingMe }] = useUpdateMeMutation()

  const privacy: PrivacySettings | null = useMemo(() => {
    if (!me?.privacy_settings) {
      return {
        show_achievements: true,
        show_level: true,
        show_profile: true,
      }
    }
    return me.privacy_settings
  }, [me])

  const handleTogglePrivacy = useCallback(
    async (key: keyof PrivacySettings) => {
      if (!privacy) return

      await updateMe({
        privacy_settings: {
          ...privacy,
          [key]: !privacy[key],
        },
      })
    },
    [privacy, updateMe]
  )

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
                {currentView === 'categories' && 'Настройки'}
                {currentView === 'theme' && 'Тема оформления'}
                {currentView === 'privacy' && 'Приватность профиля'}
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
                    <SettingsCategoryItem onClick={() => handleCategoryClick('privacy')}>
                      <SettingsCategoryIcon>🔒</SettingsCategoryIcon>
                      <SettingsCategoryText>Приватность профиля</SettingsCategoryText>
                      <SettingsCategoryArrow>→</SettingsCategoryArrow>
                    </SettingsCategoryItem>
                  </SettingsCategoryList>
                ) : currentView === 'theme' ? (
                  <motion.div
                    key="theme"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ThemeSelector />
                  </motion.div>
                ) : (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SettingsSection>
                      <SettingsRow>
                        <SettingsRowText>
                          <SettingsRowTitle>Показывать профиль</SettingsRowTitle>
                          <SettingsRowDescription>
                            Другие пользователи видят ваш профиль, биографию и оформление.
                          </SettingsRowDescription>
                        </SettingsRowText>
                        <SettingsToggle
                          type="button"
                          onClick={() => handleTogglePrivacy('show_profile')}
                          disabled={isUpdatingMe}
                          $active={privacy?.show_profile}
                        >
                          {privacy?.show_profile ? 'Вкл' : 'Выкл'}
                        </SettingsToggle>
                      </SettingsRow>

                      <SettingsRow>
                        <SettingsRowText>
                          <SettingsRowTitle>Показывать уровень и XP</SettingsRowTitle>
                          <SettingsRowDescription>
                            Ваш уровень и опыт будут видны другим пользователям.
                          </SettingsRowDescription>
                        </SettingsRowText>
                        <SettingsToggle
                          type="button"
                          onClick={() => handleTogglePrivacy('show_level')}
                          disabled={isUpdatingMe}
                          $active={privacy?.show_level}
                        >
                          {privacy?.show_level ? 'Вкл' : 'Выкл'}
                        </SettingsToggle>
                      </SettingsRow>

                      <SettingsRow>
                        <SettingsRowText>
                          <SettingsRowTitle>Показывать достижения</SettingsRowTitle>
                          <SettingsRowDescription>
                            Ваши достижения и закреплённые карточки будут доступны другим.
                          </SettingsRowDescription>
                        </SettingsRowText>
                        <SettingsToggle
                          type="button"
                          onClick={() => handleTogglePrivacy('show_achievements')}
                          disabled={isUpdatingMe}
                          $active={privacy?.show_achievements}
                        >
                          {privacy?.show_achievements ? 'Вкл' : 'Выкл'}
                        </SettingsToggle>
                      </SettingsRow>
                    </SettingsSection>
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
