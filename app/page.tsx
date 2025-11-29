import { BlogPosts } from 'app/components/posts'
import { getSortedBlogPosts } from 'app/blog/utils'
import { getAboutPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import config from 'config.json'
import { Quote } from './components/extra'
const { contactInfo, app: { bulletPoints } } = config;

const allBlogs = getSortedBlogPosts()

const post = getAboutPosts();
  if (!post[0]) {
    notFound()
  }

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
            <Quote
              quote={"It is possible to commit no mistakes and still lose. That is not a weakness. That is life."}
              author={"Captain Jean-Luc Picard"}
            />
          </p>
          <ul className="" style={{listStyle: 'initial'}}>
            {bulletPoints.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
          <u><a href='/about-projects'>Check out my projects here.</a></u><br/>
          <u><a href={contactInfo.github} target="_blank">How about my GitHub?</a></u><br/>
          <u><a href='https://youtu.be/cgm2bytuO4g?si=EoEU9nAvUmxESRn1&t=153' target="_blank">
            Check out my OSU advertisement.
          </a></u>
        </section>
      </section>

      {/* <article className="prose mb-8"> */}
        {/* <CustomMDX source={projects} type='resume' /> */}
      {/* </article> */}

      {/* <h1 className="mb-4 text-l font-semibold tracking-tighter">
        Highlighted tech posts
      </h1>
      <BlogPosts allBlogs={allBlogs} highlightedPosts={highlightedPosts.Tech} /> */}
      
      <h1 className="mb-4 text-l font-semibold tracking-tighter">
        Recent blog posts
      </h1>
      <BlogPosts allBlogs={allBlogs} itemPerPage={3} />
    </section>
  )
}
