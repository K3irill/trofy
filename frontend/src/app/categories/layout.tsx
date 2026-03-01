import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Категории достижений",
  description: "Просматривайте все категории достижений на Trofy. Исследуйте достижения по категориям, создавайте свои категории и отслеживайте прогресс.",
  openGraph: {
    title: "Категории достижений | Trofy.art",
    description: "Просматривайте все категории достижений. Исследуйте достижения по категориям, создавайте свои категории и отслеживайте прогресс.",
    url: "https://trofy.art/categories",
    siteName: "Trofy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Категории достижений - Trofy",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Категории достижений | Trofy.art",
    description: "Просматривайте все категории достижений. Исследуйте достижения по категориям.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://trofy.art/categories",
  },
}

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
