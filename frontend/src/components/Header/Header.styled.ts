import styled from 'styled-components'
import { motion } from 'framer-motion'

export const HeaderContainer = styled(motion.header)`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${(props) => props.theme.glass.bg};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border-bottom: ${(props) => props.theme.glass.border};
  box-shadow: ${(props) => props.theme.shadows.glass.light};
  padding: 0;
`

export const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const Logo = styled.div`
position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: ${(props) => props.theme.shadows.glow.primary};
  margin-right: 20px;

  &:hover {
    transform: scale(1.05);
    text-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const LogoSymbol = styled.span`
  display: none;
  font-size: 1.75rem;

  &::before{
    content: '';
    position: absolute;
    inset: 0;
    display: block;
    z-index: -1;
    filter: drop-shadow(${(props) => props.theme.shadows.glow.primary});
  }
`

export const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
`

export const NavLink = styled(motion.a) <{ $active: boolean }>`
  color: ${(props) => props.$active ? props.theme.colors.primary : props.theme.colors.light[300]};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  background: ${(props) => props.$active ? `${props.theme.colors.primary}1a` : 'transparent'};
  border: 1px solid ${(props) => props.$active ? `${props.theme.colors.primary}4d` : 'transparent'};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}33`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
  }

  @media (max-width: 1024px) {
    display: none;
  }
`

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  border: 2px solid ${(props) => `${props.theme.colors.primary}4d`};
  box-shadow: ${(props) => props.theme.shadows.glow.primary};
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    min-width: 32px;
  }
`

export const LevelBadge = styled.div`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.gold} 0%, ${(props) => props.theme.colors.goldLight} 100%);
  color: ${(props) => props.theme.colors.dark.bg};
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  box-shadow: ${(props) => props.theme.shadows.glow.gold};
  height: fit-content;  width: fit-content;

  @media (max-width: 768px) {
    padding: 0.2rem 0.5rem;
    font-size: 0.625rem;
  }
`

export const UserName = styled.div`
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 600;
  font-size: 0.8125rem;

  @media (max-width: 1024px) {
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const NotificationIconWrapper = styled.div<{ $hideOnMobile?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.$hideOnMobile && `
    @media (max-width: 1024px) {
      display: none;
    }
  `}
`

export const NotificationIcon = styled(motion.button) <{ $hasUnread: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.light[100]};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    transform: scale(1.1);
    color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`

export const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: ${(props) => props.theme.colors.danger};
  color: ${(props) => props.theme.colors.light[100]};
  border-radius: 9px;
  font-size: 0.625rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px ${(props) => `${props.theme.colors.danger}80`};
  border: 2px solid ${(props) => props.theme.colors.dark.bg};
  z-index: 1;
`



export const CreateButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: ${(props) => props.theme.colors.light[100]};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;

  svg {
    font-size: 1.25rem;
    color: ${(props) => props.theme.colors.primary};
  }

  span {
    font-size: 0.625rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.light[300]};
    line-height: 1;
  }

  &:hover {
    background: ${(props) => props.theme.colors.dark.glassLight};
    transform: translateY(-2px);

    svg {
      color: ${(props) => props.theme.colors.primary};
    }
  }


  @media (max-width: 640px) {
    padding: 0.375rem;
    min-width: 44px;

    svg {
      font-size: 1.125rem;
    }

    span {
      font-size: 0.5625rem;
    }
  }
`



export const UserProfileMenu = styled(motion.div)`
  position: absolute;
  top: 82px;
  right: 1.5rem;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border: ${(props) => props.theme.glass.border};
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 1024px) {
    top: 60px;
    right: 0.75rem;
    min-width: 160px;
    padding: 0.375rem;
    border-radius: 10px;
  }

  @media (max-width: 640px) {
    min-width: 140px;
    padding: 0.25rem;
    border-radius: 8px;
  }
`

export const UserProfileMenuItem = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  color: ${(props) => props.$danger ? props.theme.colors.danger : props.theme.colors.light[100]};
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
  }

    &:hover {
    background: ${(props) => props.$danger
    ? `${props.theme.colors.danger}1a`
    : `${props.theme.colors.primary}1a`};
    color: ${(props) => props.$danger
    ? props.theme.colors.danger
    : props.theme.colors.primary};
  }

  @media (max-width: 1024px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    gap: 0.625rem;

    svg {
      font-size: 1rem;
    }
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.5rem;
    border-radius: 6px;

    svg {
      font-size: 0.9375rem;
    }
  }
`

export const UserProfileMenuDivider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.dark.neomorphLight};
  margin: 0.25rem 0;

  @media (max-width: 640px) {
    margin: 0.125rem 0;
  }
`

export const HamburgerButton = styled(motion.button)`
  display: none;
  position: relative;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.light[100]};
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 1024px) {
    display: flex;
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }
`

export const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 99;

  @media (min-width: 1025px) {
    display: none;
  }
`

export const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  z-index: 100;
  top: 64px;
  left: 0;
  right: 0;
  background: ${(props) => props.theme.colors.dark.glass};
  backdrop-filter: ${(props) => props.theme.glass.blur};
  -webkit-backdrop-filter: ${(props) => props.theme.glass.blur};
  border-bottom: ${(props) => props.theme.glass.border};
  padding: 1rem;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  max-height: calc(100vh - 64px);
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: flex;
  }

  @media (max-width: 640px) {
    padding: 0.75rem;
    gap: 0.375rem;
  }
`
export const MobileMenuHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.dark.neomorphLight};
  margin-bottom: 0.5rem;

  ${UserName}{
    display: block;
  }

  @media (max-width: 640px) {
    gap: 0.75rem;
    padding-bottom: 0.5rem;
    margin-bottom: 0.375rem;
  }
`

export const MobileMenuActions = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const MobileMenuActionButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const MobileMenuActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${(props) => props.theme.colors.dark.glassLight};
  border: ${(props) => props.theme.glass.border};
  border-radius: 10px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.light[100]};
  transition: all 0.3s ease;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}4d`};
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
    color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;

    svg {
      font-size: 1.125rem;
    }
  }
`

export const MobileMenuDivider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.dark.neomorphLight};
  margin: 0.75rem 0;
  width: 100%;
`

export const MobileMenuLogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: ${(props) => `${props.theme.colors.danger}15`};
  border: 1px solid ${(props) => `${props.theme.colors.danger}40`};
  border-radius: 10px;
  color: ${(props) => props.theme.colors.danger};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  &:hover {
    background: ${(props) => `${props.theme.colors.danger}25`};
    border-color: ${(props) => `${props.theme.colors.danger}60`};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => `${props.theme.colors.danger}30`};
  }

  @media (max-width: 640px) {
    padding: 0.75rem;
    font-size: 0.8125rem;
    gap: 0.625rem;

    svg {
      font-size: 1rem;
    }
  }
`

export const MobileMenuNavLink = styled(motion.a) <{ $active: boolean }>`
  display: block;
  width: 100%;
  font-size: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.25rem;
  color: ${(props) => props.$active ? props.theme.colors.primary : props.theme.colors.light[300]};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  background: ${(props) => props.$active ? `${props.theme.colors.primary}1a` : 'transparent'};
  border: 1px solid ${(props) => props.$active ? `${props.theme.colors.primary}4d` : 'transparent'};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => `${props.theme.colors.primary}1a`};
    border-color: ${(props) => `${props.theme.colors.primary}33`};
  }

  @media (max-width: 640px) {
    font-size: 0.9375rem;
    padding: 0.75rem;
  }
`



