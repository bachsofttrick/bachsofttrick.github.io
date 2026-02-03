import { getSortedBlogPosts, getAboutPosts } from 'app/blog/utils'

export const baseUrl = 'https://bachsofttrick.github.io'

export default async function sitemap() {
  const blogs = getSortedBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const post = getAboutPosts();
  const aboutPost = post[0] ?? null;

  const routes = ['', '/about', '/projects', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: aboutPost ? aboutPost.metadata.publishedAt : new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
