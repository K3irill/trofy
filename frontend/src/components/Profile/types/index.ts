import { User } from '@/types'
import { UserStats } from '@/store/api/userApi'

export interface ProfileProps {
  user: User
  isAuthenticated?: boolean
  isOwnProfile?: boolean | null
  stats?: UserStats
  onLoginClick?: () => void
}
