import { baseUrl } from 'app/sitemap'
import { getSortedBlogPosts } from 'app/blog/utils'
import config from '@/config.json' with { type: 'json' };
const { blog: { maxDescLength } } = config;

export async function GET() {
  let allBlogs = await getSortedBlogPosts()

  const itemsXml = allBlogs.map((post) =>
      `<item>
        <title>${post.metadata.title}</title>
        <link>${baseUrl}/blog/${post.category}/${post.slug}</link>
        <description>${post.content.slice(0, 50) + '...'}</description>
        <pubDate>${new Date(
          post.metadata.publishedAt
        ).toUTCString()}</pubDate>
        <category>${post.category}</category>
      </item>`
    ).join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Brian Phan</title>
      <link>${baseUrl}</link>
      <description>This is Brian Phan portfolio RSS feed</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
