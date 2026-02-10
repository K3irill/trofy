'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SettingsModal } from '@/components/SettingsModal'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { mockUser } from '@/app/page.constants'
import {
  HeaderContainer,
  HeaderContent,
  HeaderLeft,
  HeaderRight,
  Logo,
  NavLinks,
  NavLink,
  UserSection,
  Avatar,
  LevelBadge,
  UserName,
  UserProfileMenu,
  MobileMenu,
  NotificationIcon,
  CreateButton,
  LogoSymbol,
  HamburgerButton,
  MobileMenuHeader,
  MobileMenuActions,
  MobileMenuActionButton,
} from './Header.styled'

const links = [
  { name: 'Профиль', href: '/' },
  { name: 'Достижения', href: '/categories' },
  { name: 'Лента', href: '/feed' },
  { name: 'Сообщества', href: '/communities' },
]

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsInitialView, setSettingsInitialView] = useState<'categories' | 'theme'>('categories')

  return (
    <>
      <HeaderContainer
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HeaderContent>
          <HeaderLeft>
            <Logo onClick={() => router.push('/')}>
              <LogoSymbol>🏆</LogoSymbol>
              trofy.art
            </Logo>
            <NavLinks>
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={pathname === link.href}
                >
                  {link.name}
                </NavLink>
              ))}
            </NavLinks>
          </HeaderLeft>
          <HeaderRight>
            <ThemeSwitcher onOpenSettings={() => {
              setSettingsInitialView('theme')
              setIsSettingsOpen(true)
            }} />
            <CreateButton onClick={() => console.log('create')}>
              <span>+</span> Свое Достижение
            </CreateButton>
            <NotificationIcon>
              🔔
            </NotificationIcon>
            <UserSection onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <Avatar>{mockUser.avatar ? <img src={mockUser.avatar} alt={mockUser.username} /> : '👤'}</Avatar>
              <LevelBadge>Lvl {mockUser.level}</LevelBadge>
              <UserName>{mockUser.username}</UserName>
            </UserSection>
            {showProfileMenu && (
              <UserProfileMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div onClick={() => { router.push('/profile'); setShowProfileMenu(false) }}>
                  Профиль
                </div>
                <div onClick={() => {
                  setSettingsInitialView('categories')
                  setIsSettingsOpen(true)
                  setShowProfileMenu(false)
                }}>
                  Настройки
                </div>
                <div onClick={() => setShowProfileMenu(false)}>Выйти</div>
              </UserProfileMenu>
            )}
            <HamburgerButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span>☰</span>
            </HamburgerButton>
          </HeaderRight>
        </HeaderContent>
      </HeaderContainer>

      {isMobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <MobileMenuHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Avatar style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                {mockUser.avatar ? <img src={mockUser.avatar} alt={mockUser.username} /> : '👤'}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <LevelBadge>Lvl {mockUser.level}</LevelBadge>
                <UserName style={{ fontSize: '1.125rem' }}>{mockUser.username}</UserName>
              </div>
            </div>
            <MobileMenuActions>
              <MobileMenuActionButton onClick={() => {
                setSettingsInitialView('categories')
                setIsSettingsOpen(true)
                setShowProfileMenu(false)
              }}>
                ⚙️
              </MobileMenuActionButton>
              <MobileMenuActionButton onClick={() => console.log('logout')}>
                выйти
              </MobileMenuActionButton>
            </MobileMenuActions>
          </MobileMenuHeader>
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={pathname === link.href}
              style={{ display: 'block', width: '100%', fontSize: '1.25rem', padding: '1rem' }}
            >
              {link.name}
            </NavLink>
          ))}
          <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
            <CreateButton style={{ width: '100%', justifyContent: 'center' }} onClick={() => console.log('create')}>
              <span>+</span> Создать Достижение
            </CreateButton>
          </div>

        </MobileMenu>
      )}

      <SettingsModal
        key={isSettingsOpen ? settingsInitialView : 'categories'}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialView={settingsInitialView}
      />
    </>
  )
}
