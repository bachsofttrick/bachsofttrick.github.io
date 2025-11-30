import { BlogPosts } from 'app/components/posts'
import { getSortedBlogPosts } from 'app/blog/utils'
import { baseUrl } from '@/app/sitemap'

export const metadata = {
  title: 'My Blog',
  description: 'Read my blog.',
  openGraph: {
    title: 'My Blog',
    description: 'Read my blog.',
    type: 'website',
    url: `${baseUrl}/blog`,
  }
}

let allBlogs = getSortedBlogPosts()

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts allBlogs={allBlogs} addSummary pagination/>
    </section>
  )
}
