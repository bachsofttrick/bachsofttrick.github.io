import { BlogPosts } from 'app/components/posts'
import { getSortedBlogPosts } from 'app/blog/utils'

let allBlogs = getSortedBlogPosts()
let itemPerPage = 4

export function generateStaticParams() {
  let totalPages = Math.floor(allBlogs.length / itemPerPage) + (allBlogs.length % itemPerPage ? 1 : 0)
  return Array.from({ length: totalPages }, (_, index) => {
    return {
      page: `${index + 1}`
    }
  })
}

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page({ params }) {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts page={Number(params.page)} allBlogs={allBlogs} addSummary pagination/>
    </section>
  )
}
