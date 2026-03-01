import type { Metadata } from 'next'

type Props = {
  params: { username: string; categoryId: string } | Promise<{ username: string; categoryId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const { username, categoryId } = resolvedParams
  
  return {
    title: `Достижения ${username} в категории | Trofy.art`,
    description: `Просматривайте достижения пользователя ${username} в этой категории на Trofy.`,
    openGraph: {
      title: `Достижения ${username} в категории | Trofy.art`,
      description: `Просматривайте достижения пользователя ${username} в этой категории.`,
      url: `https://trofy.art/user/${username}/achievements/${categoryId}`,
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
      title: `Достижения ${username} в категории | Trofy.art`,
      description: `Просматривайте достижения пользователя ${username} в этой категории.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://trofy.art/user/${username}/achievements/${categoryId}`,
    },
  }
}

export default function UserCategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
