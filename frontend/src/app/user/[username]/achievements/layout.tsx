import type { Metadata } from 'next'

type Props = {
  params: { username: string } | Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const username = resolvedParams?.username
  
  return {
    title: `Достижения ${username} | Trofy.art`,
    description: `Просматривайте все достижения пользователя ${username} на Trofy. Изучайте прогресс и статистику.`,
    openGraph: {
      title: `Достижения ${username} | Trofy.art`,
      description: `Просматривайте все достижения пользователя ${username}. Изучайте прогресс и статистику.`,
      url: `https://trofy.art/user/${username}/achievements`,
      siteName: "Trofy",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Достижения ${username} - Trofy`,
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Достижения ${username} | Trofy.art`,
      description: `Просматривайте все достижения пользователя ${username}.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://trofy.art/user/${username}/achievements`,
    },
  }
}

export default function UserAchievementsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
