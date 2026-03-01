import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Поиск пользователей",
  description: "Найдите пользователей на Trofy. Просматривайте топ пользователей, ищите по имени и изучайте их достижения.",
  openGraph: {
    title: "Поиск пользователей | Trofy.art",
    description: "Найдите пользователей на Trofy. Просматривайте топ пользователей, ищите по имени и изучайте их достижения.",
    url: "https://trofy.art/users",
    siteName: "Trofy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Поиск пользователей - Trofy",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Поиск пользователей | Trofy.art",
    description: "Найдите пользователей и просматривайте их достижения.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://trofy.art/users",
  },
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
