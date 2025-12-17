import { getSortedBlogPosts, getAboutPostModifiedDate } from 'app/blog/utils'

export const baseUrl = 'https://bachsofttrick.github.io'

export default async function sitemap() {
  const blogs = getSortedBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const aboutModifiedMs = getAboutPostModifiedDate();
  const routes = ['', '/about', '/about-projects', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(aboutModifiedMs).toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
