import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Brian Phan
      </h1>

      <section className='flex flex-col md:flex-row mb-12'>
        <section className='mr-4 mb-4' style={{flex: 1}}>
          <img src="/images/about/portrait.jpg"/>
        </section>
        <section  style={{flex: 2}}>
          <p className="mb-4 italic">
            {`”It is possible to commit no mistakes and still lose. That is not a weakness. That is life."
            Captain Jean-Luc Picard`}
          </p>
          <p className="mb-12">
            {`Experienced software engineer with a robust background in Linux systems and web technologies.
            Proven expertise in maintaining and developing complex systems, including inventory systems
            and applications for large-scale use. Leveraging skills in server infrastructure,
            containerization, virtualization to contribute to impactful projects and the global technological 
            advancement. Exploring projects that align with personal interests and passions. Committed to continuous
            learning and development.`}
          </p>
        </section>
      </section>
      
      <h1 className="mb-4 text-l font-semibold tracking-tighter">
        Recent blog posts
      </h1>
      <BlogPosts getFirst={3} />
    </section>
  )
}
