import { getAboutPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CustomMDX, slugify } from 'app/components/mdx'
import { baseUrl } from '@/app/sitemap'

export const metadata = {
  title: 'About Me',
  description: 'Read infomation about me.',
  openGraph: {
    title: 'About Me',
    description: 'Read infomation about me.',
    type: 'article',
    url: `${baseUrl}/about`,
  }
}

export default function Page() {
  const post = getAboutPosts();
  if (!post[0]) {
    notFound()
  }

  const navItems = ['Work Experience','Education','Skills','Other Work Experience']

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">About Me</h1>
      <nav className='flex flex-col md:flex-row justify-center items-center'>
          <span className='md:me-8 mb-2 font-bold'>Jump to:</span>
          {
            navItems.map((item) => {
              const route = slugify(item)
              return <Link
                  key={route}
                  href={'#'+route}
                  className="hover:text-neutral-800 md:me-8 mb-2"
                >
                  {item}
                </Link>
            })
          }
      </nav>
      <article className="prose">
        <CustomMDX source={post[0].content} type='resume' />
      </article>
    </section>
  )
}
