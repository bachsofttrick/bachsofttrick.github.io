import { getBlogPosts } from 'app/blog/utils'

export const baseUrl = 'https://bachsofttrick.github.io'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt).toISOString(),
  }))

  let routes = ['', '/about', '/about-projects', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...blogs]
}
