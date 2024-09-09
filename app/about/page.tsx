import { getAboutPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'

export const metadata = {
  title: 'About Me',
  description: 'About me.',
}

export default function Page() {
  let post = getAboutPosts();
  if (!post[0]) {
    notFound()
  }

  const navItems = [
    {
      name: 'Work Experience',
      route: 'work-experience'
    },
    {
      name: 'Projects',
      route: 'projects'
    },
    {
      name: 'Skills',
      route: 'skills'
    },
    {
      name: 'Education',
      route: 'education'
    },
    {
      name: 'References',
      route: 'references'
    },
    
  ]

  return (
    <section>
      <nav>
        <ul className='flex flex-col md:flex-row justify-center items-center'>
          <li className='md:me-8 font-bold'>Jump to:</li>
          {
            navItems.map((item) => (
              <li key={item.route}><a href={'#'+item.route} className='md:me-8'>{item.name}</a></li>
            ))
          }
        </ul>
      </nav>
      <article className="prose">
        <CustomMDX source={post[0].content} type='resume' />
      </article>
    </section>
  )
}
