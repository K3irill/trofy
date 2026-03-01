import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Вход и регистрация",
  description: "Войдите или зарегистрируйтесь на Trofy, чтобы начать отслеживать свои достижения и прогресс.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
