import { BlogPosts } from 'app/components/posts'
import { getSortedBlogPosts } from 'app/blog/utils'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  let allBlogs = getSortedBlogPosts()

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts allBlogs={allBlogs} addSummary pagination/>
    </section>
  )
}
