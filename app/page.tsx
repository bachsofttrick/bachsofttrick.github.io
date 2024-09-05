import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Brian Phan
      </h1>
      <p className="mb-12">
        {`”Do the difficult things while they are easy and do the great things while they are small."
        Lao Tzu`}
      </p>
      <h1 className="mb-4 text-l font-semibold tracking-tighter">
        Recent blog posts
      </h1>
      <BlogPosts getFirst={3} />
    </section>
  )
}
