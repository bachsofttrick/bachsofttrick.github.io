"use client";

import Link from 'next/link'
import {useState} from 'react'
import { formatDate } from 'app/blog/utils'
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

export function BlogPosts({
  page = 1,
  allBlogs,
  itemPerPage = 4,
  addSummary = false,
  pagination = false,
}) {
  let totalPages = Math.floor(allBlogs.length / itemPerPage) + (allBlogs.length % itemPerPage ? 1 : 0)

  let returnBlogs = allBlogs
  if (pagination) {
    returnBlogs = allBlogs.slice(page * itemPerPage - itemPerPage, page * itemPerPage)
  } else {
    returnBlogs = allBlogs.slice(0, itemPerPage)
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
        {
          pagination ? (
            <Pagination className='flex justify-center' count={totalPages} page={page} renderItem={(item) => {
              return (item.page && typeof item.page === "number" && item.page <= totalPages) ? (
              <a href={"/blog/page/" + item.page}>
                <PaginationItem {...item} />
              </a>  
              ) : <PaginationItem {...item} />
            }}/>
          ) : null
        }
      
    </div>
  )
}

