"use client";

import Link from 'next/link'
import {useState} from 'react'
import { formatDate, MDXData } from 'app/blog/utils'
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function SplitWordFromDuplicateCount(words: string) {
  return words !== 'All' ? words.split(' (')[0] : words
}

function SplitNumberFromDuplicateCount(number: string) {
  return number !== 'All' ? Number(number.split(' (')[0]) : '0'
}

export function BlogPosts({
  allBlogs,
  itemPerPage = 4,
  addSummary = false,
  pagination = false,
}: {
  allBlogs: MDXData[],
  itemPerPage?: number,
  addSummary?: boolean,
  pagination?: boolean
}) {
  const [page, setPage] = useState(1)
  const handlePageChange = (event, page) => {
    setPage(page);
  }
  
  let totalPages = Math.floor((allBlogs).length / itemPerPage) + (allBlogs.length % itemPerPage ? 1 : 0)

  // Get unique categories
  const categories = [...new Set(allBlogs.map((post) => post.category))]
  // Count the number of posts in a category
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const blogWithThisCategory = allBlogs.filter((post) => post.category === category)
    categories[i] = `${category} (${blogWithThisCategory.length})`
  }
  categories.unshift('All')
  const [category, setCategory] = useState('All')
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
    setYear(0)
    setPage(1)
  }

  // Get all years
  const allDates = allBlogs.map((post) => new Date(post.metadata.publishedAt))
  const yearList = [...new Set(allDates.map((date) => date.getFullYear().toString()))]
  // Count the number of posts in a year
  for (let i = 0; i < yearList.length; i++) {
    const year = yearList[i];
    const blogWithThisYear = allBlogs.filter((post) => new Date(post.metadata.publishedAt).getFullYear() === Number(year))
    yearList[i] = `${year} (${blogWithThisYear.length})`
  }
  yearList.unshift('All')
  const [year, setYear] = useState(0)
  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value === 'All' ? 0 : Number(event.target.value))
    setMonth(0)
    setPage(1)
  }

  // Generate all months
  const monthList = Array.from({ length: 13 }, (_, index) => index);

  const [month, setMonth] = useState(0)
  const handleMonthChange = (event: SelectChangeEvent) => {
    setMonth(Number(event.target.value))
    setPage(1)
  }

  let returnBlogs = allBlogs
  if (category !== 'All') returnBlogs = returnBlogs.filter((post) => post.category === category)
  if (year > 0) {
    returnBlogs = returnBlogs.filter((post) => new Date(post.metadata.publishedAt).getFullYear() == year)
    if (month > 0) returnBlogs = returnBlogs.filter((post) => new Date(post.metadata.publishedAt).getMonth() + 1 == month)
    totalPages = Math.floor((returnBlogs).length / itemPerPage) + (returnBlogs.length % itemPerPage ? 1 : 0)
  }
  if (pagination) {
    returnBlogs = returnBlogs.slice(page * itemPerPage - itemPerPage, page * itemPerPage)
  } else {
    returnBlogs = returnBlogs.slice(0, itemPerPage)
  }

  return (
    <div>
      {
        pagination ? (
          <div>
            <FormControl>
              <InputLabel>Category</InputLabel>
              <Select
                value={category as string}
                label="Category"
                onChange={handleCategoryChange}
                className='mr-4 mb-4'
              >
                {
                  categories.map((category) => (
                    <MenuItem key={SplitWordFromDuplicateCount(category)} value={SplitWordFromDuplicateCount(category)}>{category ? category : 'All'}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
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
                    <MenuItem key={SplitNumberFromDuplicateCount(year)} value={SplitNumberFromDuplicateCount(year)}>{year ? year : 'All'}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            {
              year > 0 ? (
                <FormControl>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={month as unknown}
                    label="Month"
                    onChange={handleMonthChange}
                    className='mr-4 mb-4'
                  >
                    {
                      monthList.map((month) => (
                        <MenuItem key={month} value={month}>{month ? month : 'All'}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              ) : null
            }
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
            <p className="text-neutral-600 dark:text-neutral-400 tabular-nums">
              {post.category}
            </p>
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 mt-0">
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
                  {post.content} [. . .]
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

