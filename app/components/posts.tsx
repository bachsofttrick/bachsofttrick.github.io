import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

let allBlogs = getBlogPosts()
  .filter((post) => !post.metadata.hidden)
  .sort((a, b) => {
    if (
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
    ) {
      return -1
    }
    return 1
  })

let totalPages = Math.floor(allBlogs.length / 3) + (allBlogs.length % 3 ? 1 : 0)

export function BlogPosts({
  getFirst = 0,
  addSummary = false,
  pagination = false,
  page = 1,
  onClick = () => {}
}) {
  let returnBlogs = allBlogs
  if (getFirst > 0) {
    returnBlogs = allBlogs.slice(0, 3)
  }

  return (
    <div>
      {returnBlogs
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
            <div>
            {
              (addSummary) ? (
                <p className="text-neutral-500 tracking-tight">
                  {post.content.slice(0, 200)} [. . .]
                </p>
              ) : null
            }
            </div>
          </Link>
        ))}
      {/* <select>
      {Array.from({ length: totalPages }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
      </select> */}
    </div>
  )
}

