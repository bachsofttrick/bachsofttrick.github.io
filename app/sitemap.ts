import { getSortedBlogPosts } from 'app/blog/utils';
import type { MetadataRoute } from 'next';

export const baseUrl = 'https://bachsofttrick.github.io'

function toISODate(value?: string): string {
  if (!value) return new Date().toISOString().split('T')[0]
  const d = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0]
  return d.toISOString().split('T')[0]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getSortedBlogPosts().map((post) => {
    return {
      url: `${baseUrl}/blog/${post.category}/${post.slug}`,
      lastModified: toISODate(post.metadata.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  const routes: Array<{ path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }> = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.8 },
  ]

  const today = new Date().toISOString().split('T')[0]
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: today,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  return [...staticRoutes, ...blogs]
}
