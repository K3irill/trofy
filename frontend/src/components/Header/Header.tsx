'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logoutWithCacheReset } from '@/store/slices/authSlice'
import { SettingsModal } from '@/components/SettingsModal'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { NotificationModal } from '@/components/NotificationModal'
import { QuickNoteModal } from '@/components/Journal/QuickNoteModal'
import { Button } from '@/components/ui/Button'
import { useGetUnreadCountQuery } from '@/store/api/notificationsApi'
import { HiBell } from 'react-icons/hi'
import { IoTrophyOutline, IoSettingsOutline, IoLogOutOutline, IoCreateOutline, IoAdd } from 'react-icons/io5'
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
  UserProfileMenuItem,
  UserProfileMenuDivider,
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
  MobileMenuActionButtonWrapper,
  MobileMenuDivider,
  MobileMenuLogoutButton,
  MobileMenuNavLink,
  MobileMenuOverlay,
} from './Header.styled'

// Ссылки будут формироваться динамически в компоненте

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false)
  const [settingsInitialView, setSettingsInitialView] = useState<'categories' | 'theme'>('categories')

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000, // Обновление каждые 30 секунд
  })

  const unreadCount = unreadData?.count || 0

  // Горячая клавиша для быстрого доступа к дневнику
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isAuthenticated) {
          setIsQuickNoteOpen(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthenticated])

  // Блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

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
              <NavLink
                href={isAuthenticated && user ? `/user/${user.username}` : '/auth/login'}
                $active={isAuthenticated && user ? (pathname === `/user/${user.username}` || pathname?.startsWith(`/user/${user.username}/`)) : false}
              >
                Профиль
              </NavLink>
              <NavLink
                href="/categories"
                $active={pathname === '/categories' || pathname?.startsWith('/categories/')}
              >
                Каталог достижений
              </NavLink>
              <NavLink
                href="/users"
                $active={pathname === '/users' || pathname?.startsWith('/users/')}
              >
                Пользователи
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  href="/journal"
                  $active={pathname === '/journal' || pathname?.startsWith('/journal/')}
                >
                  Дневник
                </NavLink>
              )}
              {/* <NavLink
                href="/"
                $active={pathname === '/' || pathname === '/'}
              >
                Лента
              </NavLink> */}
              {/* <NavLink
                href="/communities"
                $active={pathname === '/communities'}
              >
                Сообщества
              </NavLink> */}
            </NavLinks>
          </HeaderLeft>
          <HeaderRight>
            {isAuthenticated && (
              <>
                <CreateButton onClick={() => setIsQuickNoteOpen(true)} title="Быстрая запись в дневник">
                  <IoCreateOutline />
                  <span>Заметка</span>
                </CreateButton>
              </>
            )}
            <ThemeSwitcher onOpenSettings={() => {
              setSettingsInitialView('theme')
              setIsSettingsOpen(true)
            }} />
            {isAuthenticated && (
              <>
                <NotificationIconWrapper $hideOnMobile>
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
                  <Avatar>
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${user.avatar_url}`}
                        alt={user.username}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.textContent = '👤'
                        }}
                      />
                    ) : (
                      '👤'
                    )}
                  </Avatar>
                  <LevelBadge>Lvl {user?.level || 1}</LevelBadge>
                  <UserName>{user?.username || 'Гость'}</UserName>
                </UserSection>
                {showProfileMenu && (
                  <UserProfileMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <UserProfileMenuItem onClick={() => {
                      if (user?.username) {
                        router.push(`/user/${user.username}`)
                      } else {
                        router.push('/')
                      }
                      setShowProfileMenu(false)
                    }}>
                      Профиль
                    </UserProfileMenuItem>
                    <UserProfileMenuItem onClick={() => {
                      if (user?.username) {
                        router.push(`/user/${user.username}/achievements`)
                      } else {
                        router.push('/')
                      }
                      setShowProfileMenu(false)
                    }}>
                      <IoTrophyOutline />
                      Мои достижения
                    </UserProfileMenuItem>
                    <UserProfileMenuItem onClick={() => {
                      setIsQuickNoteOpen(true)
                      setShowProfileMenu(false)
                    }}>
                      <IoAdd />
                      Создать Достижение
                    </UserProfileMenuItem>
                    <UserProfileMenuItem onClick={() => {
                      setSettingsInitialView('categories')
                      setIsSettingsOpen(true)
                      setShowProfileMenu(false)
                    }}>
                      <IoSettingsOutline />
                      Настройки
                    </UserProfileMenuItem>
                    <UserProfileMenuDivider />
                    <UserProfileMenuItem $danger onClick={() => {
                      dispatch(logoutWithCacheReset())
                      setShowProfileMenu(false)
                      router.push('/')
                    }}>
                      <IoLogOutOutline />
                      Выйти
                    </UserProfileMenuItem>
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
              {isAuthenticated && unreadCount > 0 && (
                <NotificationBadge>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </NotificationBadge>
              )}
            </HamburgerButton>
          </HeaderRight>
        </HeaderContent>
      </HeaderContainer>

      {isMobileMenuOpen && (
        <>
          <MobileMenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onAnimationStart={() => {
              // Прокручиваем в начало при открытии меню
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            <MobileMenuHeader>
              {isAuthenticated && user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <Avatar style={{ width: '48px', height: '48px', fontSize: '1.5rem', flexShrink: 0 }}>
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_BACK_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${user.avatar_url}`}
                          alt={user.username}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement!.textContent = '👤'
                          }}
                        />
                      ) : (
                        '👤'
                      )}
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                      <LevelBadge>Lvl {user.level}</LevelBadge>
                      <UserName style={{ fontSize: '1.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</UserName>
                    </div>
                  </div>
                  <MobileMenuActions>
                    <MobileMenuActionButtonWrapper>
                      <MobileMenuActionButton
                        onClick={() => {
                          setIsNotificationsOpen(true)
                          setShowProfileMenu(false)
                        }}
                      >
                        <HiBell size={18} />
                      </MobileMenuActionButton>
                      {unreadCount > 0 && (
                        <NotificationBadge>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </NotificationBadge>
                      )}
                    </MobileMenuActionButtonWrapper>
                    <MobileMenuActionButton onClick={() => {
                      setSettingsInitialView('categories')
                      setIsSettingsOpen(true)
                      setShowProfileMenu(false)
                    }}>
                      <IoSettingsOutline />
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
            <MobileMenuNavLink
              href={isAuthenticated && user ? `/user/${user.username}` : '/'}
              $active={isAuthenticated && user ? (pathname === `/user/${user.username}` || pathname?.startsWith(`/user/${user.username}/`)) : false}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Профиль
            </MobileMenuNavLink>
            {isAuthenticated && user && (
              <MobileMenuNavLink
                href={`/user/${user.username}/achievements`}
                $active={pathname === `/user/${user.username}/achievements` || pathname?.startsWith(`/user/${user.username}/achievements/`)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Мои достижения
              </MobileMenuNavLink>
            )}
          
            {isAuthenticated && (
              <MobileMenuNavLink
                href="/journal"
                $active={pathname === '/journal' || pathname?.startsWith('/journal/')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Дневник
              </MobileMenuNavLink>
            )}
            {/* <MobileMenuNavLink
              href="/"
              $active={pathname === '/' || pathname === '/'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Лента
            </MobileMenuNavLink> */}
            <MobileMenuNavLink
              href="/users"
              $active={pathname === '/users'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Пользователи
            </MobileMenuNavLink>
            {isAuthenticated && (
              <MobileMenuDivider />
            )}
            {isAuthenticated && (
              <MobileMenuLogoutButton onClick={() => {
                dispatch(logoutWithCacheReset())
                setIsMobileMenuOpen(false)
                router.push('/')
              }}>
                <IoLogOutOutline />
                Выйти
              </MobileMenuLogoutButton>
            )}

          </MobileMenu>
        </>
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
      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        onClose={() => setIsQuickNoteOpen(false)}
      />
    </>
  )
}
