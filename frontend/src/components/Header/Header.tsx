'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logoutWithCacheReset } from '@/store/slices/authSlice'
import { SettingsModal } from '@/components/SettingsModal'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { NotificationModal } from '@/components/NotificationModal'
import { QuickNoteModal } from '@/components/Journal/QuickNoteModal'
import { CreateAchievementModal } from '@/components/CreateAchievementModal/CreateAchievementModal'
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
  const [isCreateAchievementModalOpen, setIsCreateAchievementModalOpen] = useState(false)
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
      document.body.style.overflowX = 'hidden'
      document.documentElement.style.overflowX = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.body.style.overflowX = ''
      document.documentElement.style.overflowX = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.overflowX = ''
      document.documentElement.style.overflowX = ''
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
              <svg width="116" height="127" viewBox="0 0 116 127" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.0982397 34.8043C0.152063 34.7502 4.05648 34.7061 8.77471 34.7061C9.96749 34.7061 11.1604 34.7061 12.3533 34.7061C15.1146 34.7061 17.3531 36.9444 17.3533 39.7057C17.3539 46.2377 17.3545 52.7697 17.355 59.3016C17.3565 73.6369 17.4129 83.9846 17.49 84.1066C17.6229 84.3169 22.5606 89.3172 33.0744 99.8896C34.4753 101.298 35.8763 102.707 37.2771 104.115C38.2142 105.058 39.4879 105.588 40.8168 105.59C50.298 105.602 59.779 105.613 69.2603 105.625C75.3948 105.632 81.5295 105.64 87.6642 105.647C92.1249 105.653 94.3466 111.054 91.1806 114.197C91.1302 114.247 91.0798 114.297 91.0294 114.347C88.5989 116.759 86.1685 119.171 83.738 121.583C82.8035 122.511 81.5409 123.032 80.2243 123.035C72.6585 123.047 65.0929 123.06 57.5271 123.073C49.9708 123.086 42.4146 123.099 34.8582 123.112C33.5249 123.114 32.246 122.584 31.3056 121.639C29.8501 120.176 28.3945 118.714 26.9388 117.251C23.7291 114.025 16.3547 106.623 10.5515 100.801C7.52046 97.7604 4.48988 94.72 1.45899 91.6796C0.52467 90.7423 0 89.4729 0 88.1495C0 79.6192 0 71.089 0 62.559C0 47.3475 0.044122 34.8581 0.0982397 34.8043Z" fill="currentColor"/>
<path d="M25.301 8.78677C27.7304 6.34801 30.1599 3.90966 32.5895 1.47104C33.5277 0.529344 34.8023 0 36.1316 0C43.7274 0 51.3228 0 58.9183 0C66.5154 0 74.1123 0 81.7091 0C83.036 0 84.3085 0.527427 85.2463 1.46613C90.0839 6.3083 94.921 11.1505 99.7583 15.9926C104.597 20.8355 109.435 25.6784 114.273 30.5213C115.209 31.4587 115.735 32.7296 115.735 34.0547C115.736 43.1513 115.736 52.248 115.737 61.3447C115.738 87.9815 115.717 90.7121 115.505 90.7932C115.377 90.8424 111.473 90.8824 106.829 90.8824C105.681 90.8824 104.533 90.8824 103.385 90.8824C100.624 90.8824 98.3851 88.6438 98.3851 85.8824C98.3851 78.7131 98.3851 71.5436 98.3851 64.3744C98.3851 56.2292 98.3851 48.0834 98.3851 39.9381C98.3851 38.612 97.8583 37.3403 96.9206 36.4026C94.0387 33.5208 91.1567 30.6389 88.2748 27.7574C85.3922 24.8749 82.5093 21.9923 79.6266 19.1097C78.6903 18.1734 77.4209 17.6468 76.0969 17.6452C66.5164 17.6339 56.9362 17.6221 47.3557 17.6106C41.0922 17.6031 34.8286 17.5955 28.565 17.588C24.1179 17.5826 21.8905 12.21 25.0291 9.05965C25.1197 8.96869 25.2104 8.87773 25.301 8.78677Z" fill="currentColor"/>
<path d="M29.7436 34.7815C30.0065 34.7347 42.795 34.7153 58.1627 34.738C67.4765 34.7521 76.79 34.7659 86.1039 34.7797C86.1165 36.9736 86.1294 39.1668 86.1421 41.3606C86.1547 43.5544 86.1677 45.7477 86.1803 47.9415C82.8712 47.9415 79.5615 47.9415 76.2524 47.9415C72.9433 47.9415 69.6336 47.9415 66.3244 47.9415C66.3244 55.0986 66.3244 62.255 66.3244 69.4121C66.3244 76.5689 66.3244 83.7259 66.3244 90.8827C63.4815 90.8827 60.6386 90.8827 57.7953 90.8827C54.9527 90.8827 52.1095 90.8827 49.2668 90.8827C49.2545 83.738 49.2415 76.5936 49.2291 69.4489C49.2171 62.3044 49.2044 55.1594 49.1921 48.015C45.8712 48.0024 42.5497 47.9897 39.2289 47.9774C35.908 47.9647 32.5865 47.9521 29.2656 47.9394C29.2656 45.7606 29.2656 43.5818 29.2656 41.403C29.2656 39.2242 29.2656 37.0456 29.2656 34.8668C29.4247 34.8383 29.5844 34.81 29.7436 34.7815Z" fill="currentColor"/>
<path d="M90.4 123H88.6V121.4H90.4V123ZM100.1 123H98.7V121.98L97.5 123H94.5C94.1133 123 93.78 122.867 93.5 122.6C93.2333 122.32 93.1 121.987 93.1 121.6V120.2C93.1 119.813 93.2333 119.487 93.5 119.22C93.78 118.94 94.1133 118.8 94.5 118.8H98.5L97.3 119.98H94.5V121.8H98.7V117.2H93.1L94.3 116H98.7C99.0867 116 99.4133 116.14 99.68 116.42C99.96 116.687 100.1 117.013 100.1 117.4V123ZM108.492 118.8H107.092V117.2H104.292V123H102.892V116H104.292V117L105.292 116H107.092C107.479 116 107.806 116.14 108.072 116.42C108.352 116.687 108.492 117.013 108.492 117.4V118.8ZM115.285 123H112.485C112.098 123 111.765 122.867 111.485 122.6C111.218 122.32 111.085 121.987 111.085 121.6V117.2H109.085L110.285 116H111.085V114.6L112.485 113.2V116H115.285V117.2H112.485V121.8H115.285V123Z" fill="currentColor"/>
</svg>

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
              {isAuthenticated && (
                <NavLink
                  href="/journal"
                  $active={pathname === '/journal' || pathname?.startsWith('/journal/')}
                >
                  Дневник
                </NavLink>
              )}
              <NavLink
                href="/users"
                $active={pathname === '/users' || pathname?.startsWith('/users/')}
              >
                Пользователи
              </NavLink>
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
                      setIsCreateAchievementModalOpen(true)
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
                    <UserProfileMenuItem $danger onClick={async () => {
                      await dispatch(logoutWithCacheReset())
                      setShowProfileMenu(false)
                      router.push('/')
                      // Принудительно обновляем страницу для полной очистки
                      if (typeof window !== 'undefined') {
                        window.location.href = '/'
                      }
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
                    <Avatar 
                      style={{ width: '48px', height: '48px', fontSize: '1.5rem', flexShrink: 0, cursor: 'pointer' }}
                      onClick={() => {
                        if (user?.username) {
                          router.push(`/user/${user.username}`)
                          setIsMobileMenuOpen(false)
                        }
                      }}
                    >
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
              $active={isAuthenticated && user ? (pathname === `/user/${user.username}` || (pathname?.startsWith(`/user/${user.username}/`) && !pathname?.startsWith(`/user/${user.username}/achievements`))) : false}
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
              <MobileMenuLogoutButton onClick={async () => {
                await dispatch(logoutWithCacheReset())
                setIsMobileMenuOpen(false)
                router.push('/')
                // Принудительно обновляем страницу для полной очистки
                if (typeof window !== 'undefined') {
                  window.location.href = '/'
                }
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
      <CreateAchievementModal
        isOpen={isCreateAchievementModalOpen}
        onClose={() => setIsCreateAchievementModalOpen(false)}
        onSuccess={() => {
          // Модалка закроется автоматически через onClose
        }}
      />
    </>
  )
}
