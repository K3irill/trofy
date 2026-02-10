import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "./providers"
import StyledComponentsRegistry from "@/lib/registry"
import "./globals.css"
import { Header } from '@/components/Header'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Trofy - Достижения Жизни",
  description: "Геймификация жизненных достижений",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
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
            <div suppressHydrationWarning>
              <Header />
            </div>
            <main suppressHydrationWarning>
              {children}
            </main>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
