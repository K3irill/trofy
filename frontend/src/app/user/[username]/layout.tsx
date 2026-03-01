import type { Metadata } from 'next'

type Props = {
  params: { username: string } | Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Поддержка как синхронных, так и асинхронных параметров
  const resolvedParams = params instanceof Promise ? await params : params
  const username = resolvedParams?.username
  
  if (!username) {
    return {
      title: "Профиль пользователя",
      description: "Профиль пользователя на Trofy. Просматривайте достижения, статистику и прогресс.",
    }
  }
  
  return {
    title: `Профиль ${username}`,
    description: `Профиль пользователя ${username} на Trofy. Просматривайте достижения, статистику и прогресс пользователя.`,
    openGraph: {
      title: `Профиль ${username} | Trofy.art`,
      description: `Профиль пользователя ${username}. Просматривайте достижения, статистику и прогресс.`,
      url: `https://trofy.art/user/${username}`,
      siteName: "Trofy",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Профиль ${username} - Trofy`,
        },
      ],
      locale: "ru_RU",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `Профиль ${username} | Trofy.art`,
      description: `Профиль пользователя ${username}. Просматривайте достижения и статистику.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://trofy.art/user/${username}`,
    },
  }
}

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
