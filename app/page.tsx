import { BlogPosts } from 'app/components/posts'
import { getSortedBlogPosts, extractProjectsFromAbout } from 'app/blog/utils'
import { getAboutPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'

const allBlogs = getSortedBlogPosts()
const bulletPoints = [
  'Full stack web developer with experience in designing, deploying,\
    and maintaining web applications.',
  'Skilled in C#, JavaScript, React, MySQL, Docker with a strong background in \
    Linux systems and Agile development.',
  'Experienced in managing deadlines, collaborating with cross-functional teams,\
    and delivering solutions that improve functionality and user experience.',
  'Adept at documentation, content management, and supporting site updates.',
  'Committed to building efficient, user-friendly tools and contributing to \
    the growth of mission-driven projects.',
]

const post = getAboutPosts();
  if (!post[0]) {
    notFound()
  }
const projects = extractProjectsFromAbout(post[0].content);

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Brian Phan
      </h1>
      <section className='flex flex-col md:flex-row mb-8 home-section'>
        <section className='mr-4' style={{flex: 1}}>
          <img src="/images/about/portrait.jpg"/>
        </section>
        <section style={{flex: 2, marginLeft: '1rem'}}>
          <p className="mb-4">
            <span className='italic'>{`”It is possible to commit no mistakes and still lose. That is not a weakness. That is life."`}</span>
            {` Captain Jean-Luc Picard`}
          </p>
          <ul className="" style={{listStyle: 'initial'}}>
            {bulletPoints.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
          <u><a href='/about#projects'>Check out my projects here.</a></u>
        </section>
      </section>

      <article className="prose mb-8">
        {/* <CustomMDX source={projects} type='resume' /> */}
      </article>

      <h1 className="mb-4 text-l font-semibold tracking-tighter">
        Recent blog posts
      </h1>
      <BlogPosts allBlogs={allBlogs} itemPerPage={3} />
    </section>
  )
}
