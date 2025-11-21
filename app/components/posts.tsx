"use client";

import Link from 'next/link'
import {useState} from 'react'
import { formatDate, MDXData, getMonth, getYear, getUniqueValues } from 'app/blog/utils'
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
  highlightedPosts = [],
}: {
  allBlogs: MDXData[],
  itemPerPage?: number,
  addSummary?: boolean,
  pagination?: boolean,
  highlightedPosts?: string[]
}) {
  const [page, setPage] = useState(1)
  const handlePageChange = (event, page) => {
    setPage(page);
  }
  const [category, setCategory] = useState('All')
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
    setYear(0)
    setPage(1)
  }
  const [year, setYear] = useState(0)
  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value === 'All' ? 0 : Number(event.target.value))
    setMonth(0)
    setPage(1)
  }
  const [month, setMonth] = useState(0)
  const handleMonthChange = (event: SelectChangeEvent) => {
    setMonth(Number(event.target.value))
    setPage(1)
  }

  // Getting only highlighted blogs if available
  let returnBlogs: MDXData[] = [];
  if (highlightedPosts && highlightedPosts.length > 0) {
    const len = allBlogs.length;
    returnBlogs = [];
    for (let i = 0; i < len; i++) {
      const post = allBlogs[i];
      if (highlightedPosts.includes(post.slug)) returnBlogs.push(post);
    }
  } else {
    returnBlogs = allBlogs;
  }
  
  // Get unique categories and count the number of posts in a category
  const categories = [...getUniqueValues(allBlogs.map((post) => post.category))].map(category => {
    return `${category}`
  })
  categories.unshift('All')
  
  // Generate all months
  let monthList = Array.from({ length: 13 }, (_, index) => (index + 1).toString())
  monthList.pop()

  if (category !== 'All') returnBlogs = returnBlogs.filter((post) => post.category === category)
  // Get all years and count the number of posts in a year
  let yearList = [...getUniqueValues(allBlogs.map(post => 
    getYear(post.metadata.publishedAt).toString()
  ))].map(year => {
    const count = returnBlogs.filter(post => getYear(post.metadata.publishedAt) === Number(year)).length
    return count > 0 ? `${year}` : ``
  });
  yearList = yearList.filter((year) => year !== ``)
  yearList.unshift('All')

  let totalPages = Math.ceil(returnBlogs.length / itemPerPage)

  if (year > 0) {
    returnBlogs = returnBlogs.filter((post) => getYear(post.metadata.publishedAt) === year)
    // Count the number of posts in a month
    monthList = monthList.map(month => {
      const count = returnBlogs.filter(post => getMonth(post.metadata.publishedAt) === Number(month)).length
      return count > 0 ? `${month}` : ``
    });
    monthList = monthList.filter((month) => month !== ``)
    monthList.unshift('All')
    
    if (month > 0) returnBlogs = returnBlogs.filter((post) => getMonth(post.metadata.publishedAt) === month)
    totalPages = Math.ceil(returnBlogs.length / itemPerPage)
  }

  // Count the number of posts
  const count = returnBlogs.length;

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
            <FormControl sx={{minWidth: '100px'}}>
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
            <FormControl sx={{minWidth: '100px'}}>
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
                <FormControl sx={{minWidth: '100px'}}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={month as unknown}
                    label="Month"
                    onChange={handleMonthChange}
                    className='mr-4 mb-4'
                  >
                    {
                      monthList.map((month) => (
                        <MenuItem key={SplitNumberFromDuplicateCount(month)} value={SplitNumberFromDuplicateCount(month)}>{month !== '0' ? month : 'All'}</MenuItem>
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
                  {post.content.slice(0, 200)} [. . .]
                </p>
              ) : null
            }
            </div>
          </Link>
        ))}
        {
          pagination ? (
            <div>
              <Pagination
                className='flex justify-center'
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                renderItem={(item) =>
                  <PaginationItem style={{'color': 'inherit'}} {...item} />}
              />
              # = {count}
            </div>
          ) : null
        }
    </div>
  )
}

