import type { MetadataRoute } from 'next'

/**
 * Generates a comprehensive sitemap for the VibeIt platform
 * Includes all static pages, courses, modules, and lessons
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vibeit.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Course pages
  const coursePages = [
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/overview`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Module pages for the main course
  const modulePages = [
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/vibe-coding-mindset`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/essential-vibe-coding-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/core-technical-concepts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/business-and-product-concepts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/advanced-prompting-and-ai-collaboration`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/project-portfolio-development`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/deployment-and-going-live`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/scaling-and-growth`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]

  // Lesson pages for the main course
  const lessonPages = [
    // Vibe Coding Mindset module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/vibe-coding-mindset/what-is-vibe-coding`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/vibe-coding-mindset/evolution-of-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/vibe-coding-mindset/vibe-coding-mindset`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Essential Vibe Coding Tools module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/essential-vibe-coding-tools/ai-development-platforms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/essential-vibe-coding-tools/ai-assistants-and-chatbots`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/essential-vibe-coding-tools/design-and-prototyping-tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/essential-vibe-coding-tools/tool-selection-framework`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Core Technical Concepts module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/core-technical-concepts/web-development-fundamentals`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/core-technical-concepts/modern-architecture-patterns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/core-technical-concepts/tech-stack-decisions`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/core-technical-concepts/development-workflow`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Business and Product Concepts module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/business-and-product-concepts/product-development-lifecycle`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/business-and-product-concepts/agile-development-with-ai`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/business-and-product-concepts/business-models-for-saas`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/business-and-product-concepts/project-create-product-specification`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Advanced Prompting and AI Collaboration module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/advanced-prompting-and-ai-collaboration/art-of-prompting`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/advanced-prompting-and-ai-collaboration/mega-prompts-for-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/advanced-prompting-and-ai-collaboration/multi-agent-workflows`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/advanced-prompting-and-ai-collaboration/advanced-techniques`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Project Portfolio Development module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/project-portfolio-development/project-1-static-website`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/project-portfolio-development/project-2-interactive-web-app`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/project-portfolio-development/project-3-micro-saas`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/project-portfolio-development/project-4-full-stack-saas`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Deployment and Going Live module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/deployment-and-going-live/hosting-options`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/deployment-and-going-live/domain-and-ssl`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/deployment-and-going-live/monitoring-and-analytics`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/deployment-and-going-live/launch-strategy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Scaling and Growth module
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/scaling-and-growth/performance-optimization`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/scaling-and-growth/feature-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/scaling-and-growth/business-growth`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/courses/fundamentals-of-vibe-coding/scaling-and-growth/final-project-growth-strategy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  return [
    ...staticPages,
    ...coursePages,
    ...modulePages,
    ...lessonPages,
  ]
} 