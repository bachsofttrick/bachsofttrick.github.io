import { getAboutPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'

export const metadata = {
  title: 'About Me',
  description: 'About me.',
}

export default function Page() {
  let post = getAboutPosts();
  if (!post) {
    notFound()
  }

  return (
    <section>
      <article className="prose">
        <CustomMDX source={post[0].content} />
      </article>
    </section>
  )
}
