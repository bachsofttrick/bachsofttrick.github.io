import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts, checkPostIfHidden } from 'app/blog/utils'

// What does this do?
export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }))
}

// What does this do?
export function generateMetadata({ params }: { params: { slug: string, category: string }}) {
  let post = getBlogPosts().find((post) => post.slug === params.slug
      && post.category === params.category && !post.metadata.hidden)
  if (!post) {
    return
  }

  return post.metadata
}

export default function Blog({ params }: { params: { slug: string, category: string }}) {
  let post = getBlogPosts().find((post) => post.slug === params.slug 
      && post.category === params.category && checkPostIfHidden(post))

  if (!post) {
    notFound()
  }

  return (
    <section>
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
