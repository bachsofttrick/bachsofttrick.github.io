import { getAboutPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CustomMDX, slugify } from 'app/components/mdx'

export const metadata = {
  title: 'About Me',
  description: 'About me.',
}

export default function Page() {
  let post = getAboutPosts();
  if (!post[0]) {
    notFound()
  }

  const navItems = ['Work Experience','Projects','Skills','Education','References',]

  return (
    <section>
      <nav className='flex flex-col md:flex-row justify-center items-center'>
          <span className='md:me-8 mb-2 font-bold'>Jump to:</span>
          {
            navItems.map((item) => {
              const route = slugify(item)
              return <Link
                  key={route}
                  href={'#'+route}
                  className="hover:text-neutral-800 dark:hover:text-neutral-200 md:me-8 mb-2"
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
