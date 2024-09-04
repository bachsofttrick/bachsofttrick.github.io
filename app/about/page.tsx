import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'About Me',
  description: 'About me.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">About Me</h1>
      <p className="mb-12">
        {`Dedicated software engineering student with a strong background in Linux systems and 
        a passion for open source technologies. Doing some hobby works with whatever interests me.
        Leveraging my skills in server infrastructure and collaborative 
        development to support the global open source ecosystem.`}
      </p>
    </section>
  )
}
