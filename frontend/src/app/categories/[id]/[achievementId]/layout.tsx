import type { Metadata } from 'next'

type Props = {
  params: { id: string; achievementId: string } | Promise<{ id: string; achievementId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const { id: categoryId, achievementId } = resolvedParams
  
  return {
    title: "Достижение | Trofy.art",
    description: "Просматривайте детали достижения на Trofy. Отслеживайте прогресс, выполняйте достижение и делитесь успехами.",
    openGraph: {
      title: "Достижение | Trofy.art",
      description: "Просматривайте детали достижения. Отслеживайте прогресс, выполняйте достижение и делитесь успехами.",
      url: `https://trofy.art/categories/${categoryId}/${achievementId}`,
      siteName: "Trofy",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Достижение - Trofy",
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Достижение | Trofy.art",
      description: "Просматривайте детали достижения и отслеживайте прогресс.",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://trofy.art/categories/${categoryId}/${achievementId}`,
    },
  }
}

export default function AchievementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
