import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "./providers"
import StyledComponentsRegistry from "@/lib/registry"
import "./globals.css"
import { Header } from '@/components/Header'
import { BottomNavigation } from '@/components/BottomNavigation'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ToastContainer } from '@/components/Toast'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://trofy.art'),
  title: {
    default: "Trofy - Достижения Жизни",
    template: "%s | Trofy.art"
  },
  description: "Trofy — платформа для отслеживания достижений и личного прогресса. Создавайте категории, выполняйте достижения, отслеживайте прогресс и получайте награды. Присоединяйтесь к сообществу!",
  keywords: ["достижения", "трофеи", "геймификация", "личный прогресс", "цели", "категории", "роадмапы", "XP", "уровни", "статистика"],
  authors: [{ name: "Trofy Team" }],
  creator: "Trofy",
  publisher: "Trofy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://trofy.art",
    siteName: "Trofy",
    title: "Trofy - Достижения Жизни",
    description: "Платформа для отслеживания достижений и личного прогресса. Создавайте категории, выполняйте достижения, отслеживайте прогресс и получайте награды.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trofy - Достижения Жизни",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trofy - Достижения Жизни",
    description: "Платформа для отслеживания достижений и личного прогресса",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#6366f1" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://trofy.art",
  },
  category: "Productivity",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366f1" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('trofy-theme');
                  const validThemes = ['NEON', 'STOIC', 'MINIMAL', 'FOREST', 'DARK_GLASS', 'SUNSET', 'MYTHOLOGY', 'BERSERK', 'CYBERPUNK', 'OCEAN', 'BLACK_GLOSS'];
                  if (theme && validThemes.includes(theme)) {
                    document.documentElement.setAttribute('data-theme', theme.toLowerCase().replace('_', '-'));
                  } else {
                    document.documentElement.setAttribute('data-theme', 'neon');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <StyledComponentsRegistry>
          <Providers>
            <NotificationProvider>
              <div suppressHydrationWarning>
                <Header />
              </div>
              <main suppressHydrationWarning>
                {children}
              </main>
              <BottomNavigation />
              <ToastContainer />
            </NotificationProvider>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
