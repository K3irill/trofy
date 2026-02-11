'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { SettingsModal } from '@/components/SettingsModal'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { NotificationModal } from '@/components/NotificationModal'
import { Button } from '@/components/ui/Button'
import { useGetUnreadCountQuery } from '@/store/api/notificationsApi'
import { HiBell } from 'react-icons/hi'
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
  NotificationIconWrapper,
  NotificationIcon,
  NotificationBadge,
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
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [settingsInitialView, setSettingsInitialView] = useState<'categories' | 'theme'>('categories')
  
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000, // Обновление каждые 30 секунд
  })
  
  const unreadCount = unreadData?.count || 0

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
                  $active={pathname === link.href}
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
            {isAuthenticated && (
              <>
                <CreateButton onClick={() => console.log('create')}>
                  <span>+</span> Свое Достижение
                </CreateButton>
                <NotificationIconWrapper>
                  <NotificationIcon
                    onClick={() => setIsNotificationsOpen(true)}
                    $hasUnread={unreadCount > 0}
                    animate={unreadCount > 0 ? {
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: unreadCount > 0 ? Infinity : 0,
                      repeatDelay: 3,
                    }}
                  >
                    <HiBell size={20} />
                  </NotificationIcon>
                  {unreadCount > 0 && (
                    <NotificationBadge>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </NotificationBadge>
                  )}
                </NotificationIconWrapper>
                <UserSection onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <Avatar>{user?.avatar ? <img src={user.avatar} alt={user.username} /> : '👤'}</Avatar>
                  <LevelBadge>Lvl {user?.level || 1}</LevelBadge>
                  <UserName>{user?.username || 'Гость'}</UserName>
                </UserSection>
                {showProfileMenu && (
                  <UserProfileMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div onClick={() => { router.push('/'); setShowProfileMenu(false) }}>
                      Профиль
                    </div>
                    <div onClick={() => {
                      setSettingsInitialView('categories')
                      setIsSettingsOpen(true)
                      setShowProfileMenu(false)
                    }}>
                      Настройки
                    </div>
                    <div onClick={() => {
                      dispatch(logout())
                      setShowProfileMenu(false)
                      router.push('/')
                    }}>Выйти</div>
                  </UserProfileMenu>
                )}
              </>
            )}
            {!isAuthenticated && (
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/auth/login')}
              >
                Войти
              </Button>
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
            {isAuthenticated && user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                    {user.avatar ? <img src={user.avatar} alt={user.username} /> : '👤'}
                  </Avatar>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <LevelBadge>Lvl {user.level}</LevelBadge>
                    <UserName style={{ fontSize: '1.125rem' }}>{user.username}</UserName>
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
                  <MobileMenuActionButton onClick={() => {
                    dispatch(logout())
                    setIsMobileMenuOpen(false)
                    router.push('/')
                  }}>
                    выйти
                  </MobileMenuActionButton>
                </MobileMenuActions>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Гость</div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    router.push('/auth/login')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Войти
                </Button>
              </div>
            )}
          </MobileMenuHeader>
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              $active={pathname === link.href}
              style={{ display: 'block', width: '100%', fontSize: '1.25rem', padding: '1rem' }}
            >
              {link.name}
            </NavLink>
          ))}
          {isAuthenticated && (
            <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
              <CreateButton style={{ width: '100%', justifyContent: 'center' }} onClick={() => console.log('create')}>
                <span>+</span> Создать Достижение
              </CreateButton>
            </div>
          )}

        </MobileMenu>
      )}

      <SettingsModal
        key={isSettingsOpen ? settingsInitialView : 'categories'}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialView={settingsInitialView}
      />
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  )
}
