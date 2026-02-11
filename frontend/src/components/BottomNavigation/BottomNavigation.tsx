'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  BottomNavContainer,
  BottomNavItem,
  BottomNavIcon,
  BottomNavLabel,
} from './BottomNavigation.styled'
import { HiHome, HiUserGroup, HiNewspaper, HiSparkles } from 'react-icons/hi'
import { GiAchievement } from "react-icons/gi"

const navItems = [
  { name: 'Главная', href: '/', icon: HiHome },
  { name: 'Достижения', href: '/categories', icon: GiAchievement },
  { name: 'Сообщества', href: '/communities', icon: HiUserGroup },
  { name: 'Лента', href: '/feed', icon: HiNewspaper },
  { name: 'Новости', href: '/news', icon: HiSparkles },
]

export const BottomNavigation = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <BottomNavContainer>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

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
