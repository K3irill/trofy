import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Дневник",
  description: "Ведите дневник на Trofy. Записывайте мысли, идеи и отслеживайте свой прогресс в достижениях.",
  openGraph: {
    title: "Дневник | Trofy.art",
    description: "Ведите дневник. Записывайте мысли, идеи и отслеживайте свой прогресс.",
    url: "https://trofy.art/journal",
    siteName: "Trofy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Дневник - Trofy",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "https://trofy.art/journal",
  },
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
