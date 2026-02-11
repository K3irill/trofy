import { User } from '@/types'

export interface ProfileProps {
  user: User
  isAuthenticated?: boolean
  onLoginClick?: () => void
}
