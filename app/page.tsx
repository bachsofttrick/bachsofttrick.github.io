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
            {`Dedicated software engineering student with a strong background in Linux systems and 
            a passion for open source technologies. Doing some hobby works with whatever interests me.
            Leveraging my skills in server infrastructure and collaborative 
            development to support the global open source ecosystem.`}
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
