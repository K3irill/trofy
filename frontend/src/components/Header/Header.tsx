'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

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
  const [user] = useState({
    username: 'GamerPro',
    level: 4,
  })

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
            <ThemeSwitcher />
            <CreateButton onClick={() => console.log('create')}>
              <span>+</span> Свое Достижение
            </CreateButton>
            <NotificationIcon>
              🔔
            </NotificationIcon>
            <UserSection onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <Avatar>👤</Avatar>
              <LevelBadge>Lvl {user.level}</LevelBadge>
              <UserName>{user.username}</UserName>
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
                <div onClick={() => { router.push('/settings'); setShowProfileMenu(false) }}>
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
              <Avatar style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>👤</Avatar>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <LevelBadge>Lvl {user.level}</LevelBadge>
                <UserName style={{ fontSize: '1.125rem' }}>{user.username}</UserName>
              </div>
            </div>
            <MobileMenuActions>
              <MobileMenuActionButton onClick={() => router.push('/settings')}>
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
    </>
  )
}
