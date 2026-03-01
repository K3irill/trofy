import type { Metadata } from 'next'

type Props = {
  params: { id: string } | Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const categoryId = resolvedParams?.id
  
  return {
    title: "Категория достижений | Trofy.art",
    description: "Просматривайте достижения в этой категории на Trofy. Отслеживайте прогресс и выполняйте достижения.",
    openGraph: {
      title: "Категория достижений | Trofy.art",
      description: "Просматривайте достижения в этой категории. Отслеживайте прогресс и выполняйте достижения.",
      url: `https://trofy.art/categories/${categoryId}`,
      siteName: "Trofy",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Категория достижений - Trofy",
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Категория достижений | Trofy.art",
      description: "Просматривайте достижения в этой категории.",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://trofy.art/categories/${categoryId}`,
    },
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
