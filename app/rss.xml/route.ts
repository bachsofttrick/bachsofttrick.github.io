import { baseUrl } from 'app/sitemap'
import { getSortedBlogPosts, getPostDescription } from 'app/blog/utils'
import config from '@/config.json' with { type: 'json' };
const { blog: { maxDescLength } } = config;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  let allBlogs = await getSortedBlogPosts()

  const itemsXml = allBlogs.map((post) => {
      const url = `${baseUrl}/blog/${post.category}/${post.slug}`
      const description = getPostDescription(post.content, maxDescLength)
      return `<item>
        <title>${escapeXml(post.metadata.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <description>${escapeXml(description)}</description>
        <pubDate>${new Date(
          post.metadata.publishedAt
        ).toUTCString()}</pubDate>
        <category>${escapeXml(post.category)}</category>
      </item>`
    }).join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="https://www.w3.org/2005/Atom">
    <channel>
      <title>Brian Phan</title>
      <link>${baseUrl}</link>
      <description>This is Brian Phan portfolio RSS feed</description>
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
