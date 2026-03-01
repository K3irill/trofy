import type { Metadata } from 'next'

type Props = {
  params: { username: string; categoryId: string; achievementId: string } | Promise<{ username: string; categoryId: string; achievementId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const { username, categoryId, achievementId } = resolvedParams
  
  return {
    title: `Достижение ${username} | Trofy.art`,
    description: `Просматривайте детали достижения пользователя ${username} на Trofy. Отслеживайте прогресс и делитесь успехами.`,
    openGraph: {
      title: `Достижение ${username} | Trofy.art`,
      description: `Просматривайте детали достижения пользователя ${username}. Отслеживайте прогресс и делитесь успехами.`,
      url: `https://trofy.art/user/${username}/achievements/${categoryId}/${achievementId}`,
      siteName: "Trofy",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Достижение ${username} - Trofy`,
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Достижение ${username} | Trofy.art`,
      description: `Просматривайте детали достижения пользователя ${username}.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://trofy.art/user/${username}/achievements/${categoryId}/${achievementId}`,
    },
  }
}

export default function UserAchievementDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
