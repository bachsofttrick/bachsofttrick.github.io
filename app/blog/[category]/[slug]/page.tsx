import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts, checkPostIfHidden, MDXData, getPostDescription, extractPostImages } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import config from '@/config.json' with { type: 'json' };

const { blog: { maxDescLength } } = config;
const defaultOgImage = `${baseUrl}/images/about/portrait.jpg`

function checkCorrectPost(post: MDXData, params: MDXData) {
  return post.slug === params.slug && post.category === params.category
        && checkPostIfHidden(post)
}

/*
https://nextjs.org/docs/app/api-reference/functions/generate-static-params
Used in dynamic routes to tell Next.js which route parameters should be
pre-rendered at build time.
*/
export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }))
}

/*
https://nextjs.org/docs/app/api-reference/functions/generate-metadata
Dynamically create SEO metadata for each route.
*/
export function generateMetadata({ params }: { params: MDXData }) {
  let post = getBlogPosts().find((post) => checkCorrectPost(post, params))
  if (!post) {
    return
  }

  const { title, publishedAt } = post.metadata;
  const description = getPostDescription(post.content, maxDescLength)
  const url = `${baseUrl}/blog/${post.category}/${post.slug}`
  const images = extractPostImages(post.content, baseUrl)
  const ogImages = images.length > 0 ? images.slice(0, 4) : [defaultOgImage]
  const keywords = [post.category, 'Brian Phan', 'blog', title]

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Brian Phan' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: publishedAt,
      section: post.category.replace(/-/, ' '),
      url,
      siteName: 'Brian Phan',
      images: ogImages.map((image) => ({ url: image })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImages[0]],
    },
  }
}

export default function Blog({ params }: { params: MDXData }) {
  let post = getBlogPosts().find((post) => checkCorrectPost(post, params))

  if (!post) {
    notFound()
  }

  const description = getPostDescription(post.content, maxDescLength)
  const url = `${baseUrl}/blog/${post.category}/${post.slug}`
  const images = extractPostImages(post.content, baseUrl)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    description,
    datePublished: post.metadata.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Brian Phan',
      url: baseUrl,
    },
    mainEntityOfPage: url,
    ...(images.length > 0 ? { image: images.slice(0, 4) } : {}),
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
