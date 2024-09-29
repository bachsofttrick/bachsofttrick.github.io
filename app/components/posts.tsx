"use client";

import Link from 'next/link'
import {useState} from 'react'
import { formatDate } from 'app/blog/utils'
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export function BlogPosts({
  allBlogs,
  itemPerPage = 4,
  addSummary = false,
  pagination = false,
}) {
  const [page, setPage] = useState(1)
  const handlePageChange = (event, page) => {
    setPage(page);
  }

  const [totalPages, setTotal] = useState(
    Math.floor((allBlogs).length / itemPerPage) + (allBlogs.length % itemPerPage ? 1 : 0)
  )

  const allDates = allBlogs.map((post) => new Date(post.metadata.publishedAt))
  const yearList = [0, ...Array.from(new Set(allDates.map((date) => date.getFullYear())))] as number[]
  const [year, setYear] = useState(0)
  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(Number(event.target.value))
    setMonth(0)
  }
  const monthList = Array.from({ length: 13 }, (_, index) => index);
  const [month, setMonth] = useState(0)
  const handleMonthChange = (event: SelectChangeEvent) => {
    setMonth(Number(event.target.value))
  }

  let returnBlogs = allBlogs
  if (pagination) {
    returnBlogs = allBlogs.slice(page * itemPerPage - itemPerPage, page * itemPerPage)
  } else {
    returnBlogs = allBlogs.slice(0, itemPerPage)
  }

  return (
    <div>
      {
        false ? (
          <div>
            <FormControl>
              <InputLabel>Year</InputLabel>
              <Select
                value={year as unknown}
                label="Year"
                onChange={handleYearChange}
                className='mr-4 mb-4'
              >
                {
                  yearList.map((year) => (
                    <MenuItem key={year} value={year}>{year ? year : 'All'}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Month</InputLabel>
              <Select
                value={month as unknown}
                label="Month"
                onChange={handleMonthChange}
                className='mr-4 mb-4'
              >
                {
                  year ? monthList.map((month) => (
                    <MenuItem key={month} value={month}>{month ? month : 'All'}</MenuItem>
                  )) : <MenuItem key={0} value={0}>All</MenuItem>
                }
              </Select>
            </FormControl>
          </div>
        ) : null
      }
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
            <Pagination
              className='flex justify-center'
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              renderItem={(item) =>
                <PaginationItem style={{'color': 'inherit'}} {...item} />}
            />
          ) : null
        }
      
    </div>
  )
}

