import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { AppProviders } from "@/providers/app-provider"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "VibeIt - Master AI-Assisted Coding | Free Online Learning Platform",
    template: "%s | VibeIt"
  },
  description: "Master AI-assisted coding with step-by-step lessons and hands-on projects. Learn web development, React, Next.js, and build real-world applications with AI tools. Completely free.",
  keywords: [
    "AI coding",
    "AI-assisted development",
    "web development",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "programming",
    "coding bootcamp",
    "free coding course",
    "AI tools",
    "GitHub Copilot",
    "Cursor AI",
    "ChatGPT coding",
    "software development",
    "full-stack development",
    "frontend development",
    "backend development",
    "SaaS development",
    "portfolio projects"
  ],
  authors: [
    { name: "Gideon Ofori Addo", url: "https://github.com/wuzgood98" },
    { name: "Obed Ehoneah", url: "https://github.com/ehoneahobed" },
  ],
  creator: "VibeIt Team",
  publisher: "VibeIt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "VibeIt - Master AI-Assisted Coding | Free Online Learning Platform",
    description: "Master AI-assisted coding with step-by-step lessons and hands-on projects. Learn web development, React, Next.js, and build real-world applications with AI tools. Completely free.",
    siteName: "VibeIt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeIt - AI-Assisted Coding Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeIt - Master AI-Assisted Coding | Free Online Learning Platform",
    description: "Master AI-assisted coding with step-by-step lessons and hands-on projects. Learn web development, React, Next.js, and build real-world applications with AI tools. Completely free.",
    images: ["/og-image.png"],
    creator: "@vibeit_platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "education",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={siteConfig.themeColors.light} />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          try {
            if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.querySelector('meta[name="theme-color"]').setAttribute('content', '${siteConfig.themeColors.dark}')
              }
              } catch (_) {}
              `,
          }}
        />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : ""
        )}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
