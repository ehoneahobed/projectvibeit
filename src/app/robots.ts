import type { MetadataRoute } from 'next'

/**
 * Generates robots.txt for the VibeIt platform
 * Allows crawling of public content while protecting sensitive areas
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses',
          '/courses/*',
          '/privacy',
          '/terms',
          '/auth/signin',
          '/auth/signup',
        ],
        disallow: [
          '/api/',
          '/portal/',
          '/dashboard/',
          '/progress/',
          '/auth/error',
          '/auth/verify-request',
          '/auth/reset-password',
          '/auth/forgot-password',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/courses',
          '/courses/*',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/api/',
          '/portal/',
          '/dashboard/',
          '/progress/',
          '/auth/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'CCBot',
        allow: [
          '/',
          '/courses',
          '/courses/*',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/api/',
          '/portal/',
          '/dashboard/',
          '/progress/',
          '/auth/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://vibeit.com/sitemap.xml',
    host: 'https://vibeit.com',
  }
} 