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
  HamburgerButton,
  MobileMenu,
} from './Header.styled'

const links = [
  { name: 'Главная', href: '/' },
  { name: 'Категории', href: '/categories' },
  { name: 'Профиль', href: '/profile' },
]

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
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
            <Logo onClick={() => router.push('/')}>🏆 Trofy</Logo>
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
            <UserSection>
              <Avatar>👤</Avatar>
              <LevelBadge>Lvl {user.level}</LevelBadge>
              <UserName>{user.username}</UserName>
            </UserSection>
            <HamburgerButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              ☰
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
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={pathname === link.href}
              style={{ display: 'block', width: '100%' }}
            >
              {link.name}
            </NavLink>
          ))}
          <UserSection style={{ borderTop: '2px solid #374151', paddingTop: '1rem' }}>
            <Avatar style={{ width: '32px', height: '32px', fontSize: '1rem' }}>👤</Avatar>
            <LevelBadge>Lvl {user.level}</LevelBadge>
            <UserName>{user.username}</UserName>
          </UserSection>
        </MobileMenu>
      )}
    </>
  )
}
