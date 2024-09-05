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
      <section>
        <section className='w-1/4'>
          <img className="float-left mr-4" src="/images/about/portrait.jpg"/>
        </section>
        <section>
          <article className="prose">
            <CustomMDX source={post[0].content} />
          </article>
        </section>
      </section>
      <section>
        <article className="prose">
          <CustomMDX source={post[1].content} />
        </article>
      </section>
    </section>
  )
}
