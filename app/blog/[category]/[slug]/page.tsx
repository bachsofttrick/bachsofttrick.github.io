import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts, checkPostIfHidden, MDXData } from 'app/blog/utils'

type Params = {
  slug: string;
  category: string;
}

function checkCorrectPost(post: MDXData, params: Params) {
  return post.slug === params.slug && post.category === params.category
        && checkPostIfHidden(post)
}

/*
https://nextjs.org/docs/app/api-reference/functions/generate-static-params

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

*/
export function generateMetadata({ params }: { params: Params }) {
  let post = getBlogPosts().find((post) => checkCorrectPost(post, params))
  if (!post) {
    return
  }

  return post.metadata
}

export default function Blog({ params }: { params: Params }) {
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
