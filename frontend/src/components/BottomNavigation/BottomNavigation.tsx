'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import {
  BottomNavContainer,
  BottomNavItem,
  BottomNavIcon,
  BottomNavLabel,
} from './BottomNavigation.styled'
import { HiHome, HiUserGroup, HiNewspaper, HiSparkles } from 'react-icons/hi'
import { GiAchievement } from "react-icons/gi"

export const BottomNavigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const profileHref = isAuthenticated && user ? `/user/${user.username}` : '/auth/login'

  const navItems = [
    { name: 'Лента', href: '/feed', icon: HiNewspaper },
    { name: 'Достижения', href: '/categories', icon: GiAchievement },
    { name: 'Сообщества', href: '/communities', icon: HiUserGroup },
    { name: 'Профиль', href: profileHref, icon: HiSparkles },
  ]

  return (
    <BottomNavContainer>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.href === '/feed' 
          ? (pathname === '/feed' || pathname === '/')
          : pathname === item.href || (item.href.startsWith('/user/') && pathname?.startsWith(item.href))

        return (
          <BottomNavItem
            key={item.href}
            onClick={() => router.push(item.href)}
            $active={isActive}
          >
            <BottomNavIcon $active={isActive}>
              <Icon />
            </BottomNavIcon>
            <BottomNavLabel $active={isActive}>{item.name}</BottomNavLabel>
          </BottomNavItem>
        )
      })}
    </BottomNavContainer>
  )
}
