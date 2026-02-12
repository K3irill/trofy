'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IoSettingsOutline, IoCreateOutline, IoRefreshOutline, IoEye, IoEyeOff, IoStar, IoHeart, IoShareSocial, IoHandRight, IoChatbubble, IoCloseCircle } from 'react-icons/io5'
import { AnimatePresence } from 'framer-motion'
import {
  SettingsButton,
  SettingsMenu,
  MenuItem,
  MenuDivider,
} from './AchievementSettingsMenu.styled'

interface AchievementSettingsMenuProps {
  achievement: {
    isMain?: boolean
    isFavorite?: boolean
    isHidden?: boolean
    canLike?: boolean
    canComment?: boolean
    unlocked?: boolean
    completion_date?: string
  }
  isOwner: boolean
  onEdit: () => void
  onReset: () => void
  onToggleMain: () => void
  onToggleFavorite: () => void
  onToggleHidden: () => void
  onToggleLikes: () => void
  onToggleComments: () => void
  onShare: () => void
  buttonRef?: React.RefObject<HTMLButtonElement>
}

export const AchievementSettingsMenu = ({
  achievement,
  isOwner,
  onEdit,
  onReset,
  onToggleMain,
  onToggleFavorite,
  onToggleHidden,
  onToggleLikes,
  onToggleComments,
  onShare,
  buttonRef: externalButtonRef,
}: AchievementSettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const internalButtonRef = useRef<HTMLButtonElement>(null)
  const buttonRef = externalButtonRef || internalButtonRef
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      })
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, buttonRef])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleEditClick = () => {
    setIsOpen(false) // Закрываем меню
    onEdit() // Вызываем обработчик редактирования
  }

  return (
    <>
      <SettingsButton ref={buttonRef} onClick={handleToggle} $isOpen={isOpen}>
        <IoSettingsOutline />
      </SettingsButton>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <SettingsMenu
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  top: `${menuPosition.top}px`,
                  right: `${menuPosition.right}px`,
                }}
              >
                <MenuItem onClick={onShare}>
                  <IoShareSocial />
                  <span>Поделиться</span>
                </MenuItem>

                {isOwner && achievement.unlocked && (
                  <>
                    <MenuDivider />
                    {achievement.completion_date && (
                      <MenuItem onClick={handleEditClick}>
                        <IoCreateOutline />
                        <span>Редактировать</span>
                      </MenuItem>
                    )}
                    <MenuItem onClick={onReset} $danger>
                      <IoRefreshOutline />
                      <span>Сбросить выполнение</span>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={onToggleMain} $active={achievement.isMain}>
                      <IoStar />
                      <span>{achievement.isMain ? 'Убрать из главных' : 'Сделать главным'}</span>
                    </MenuItem>
                    <MenuItem onClick={onToggleFavorite} $active={achievement.isFavorite}>
                      <IoHeart />
                      <span>{achievement.isFavorite ? 'Убрать из избранного' : 'В избранное'}</span>
                    </MenuItem>
                    <MenuItem onClick={onToggleHidden} $active={achievement.isHidden}>
                      {achievement.isHidden ? <IoEyeOff /> : <IoEye />}
                      <span>{achievement.isHidden ? 'Показать' : 'Скрыть'}</span>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={onToggleLikes} $active={!achievement.canLike} $warning={!achievement.canLike}>
                      {achievement.canLike ? <IoHandRight /> : <IoCloseCircle />}
                      <span>{achievement.canLike ? 'Аплодисменты разрешены' : 'Аплодисменты отключены'}</span>
                    </MenuItem>
                    <MenuItem onClick={onToggleComments} $active={!achievement.canComment} $warning={!achievement.canComment}>
                      {achievement.canComment ? <IoChatbubble /> : <IoCloseCircle />}
                      <span>{achievement.canComment ? 'Комментарии разрешены' : 'Комментарии отключены'}</span>
                    </MenuItem>
                  </>
                )}

                {!isOwner && achievement.unlocked && (
                  <>
                    <MenuDivider />
                    <MenuItem onClick={onToggleFavorite} $active={achievement.isFavorite}>
                      <IoHeart />
                      <span>{achievement.isFavorite ? 'Убрать из избранного' : 'В избранное'}</span>
                    </MenuItem>
                  </>
                )}
              </SettingsMenu>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
