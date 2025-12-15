import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts, checkPostIfHidden, MDXData } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import config from '@/config.json' with { type: 'json' };

const { blog: { maxDescLength } } = config;

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
  const summary = post.content.slice(0, maxDescLength) + '...'

  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
      type: 'article',
      publishedTime: publishedAt,
      section: post.category.replace(/-/, ' '),
      url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    },
    // twitter: {
    //   card: 'summary_large_image',
    //   title,
    //   description: summary,
    // },
  }
}

export default function Blog({ params }: { params: MDXData }) {
  let post = getBlogPosts().find((post) => checkCorrectPost(post, params))

  if (!post) {
    notFound()
  }

  return (
    <section>
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
