import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  hidden: boolean
  order: number
}

export type MDXData = {
  metadata: Metadata
  slug: string
  category: string
  content: string
}

export function checkPostIfHidden(post: MDXData) {
  return !post.metadata.hidden || process.env.NODE_ENV === 'development'
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  // Shorten blog content for summary
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    const toKey = key.trim() as keyof Metadata
    if (toKey === 'hidden') metadata[toKey] = value === 'true'
    else if (toKey === 'order') metadata[toKey] = Number(value)
    else metadata[toKey] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md')
}

function readMDXRawContent(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function readMDXFiles(dir: string, category: string = ''): MDXData[] {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXRawContent(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    return {
      metadata,
      slug,
      category,
      content,
    }
  })
}

function getMDXData(dir: string, enableCate: boolean = true): MDXData[] {
  // Only get MDX files without folders
  if (!enableCate) {
    return readMDXFiles(dir)
  }

  const categories: string[] = fs.readdirSync(dir)
  const result: MDXData[] = []
  categories.forEach((category) => {
    const years: string[] = fs.readdirSync(path.join(dir,category))
    years.forEach((year) => {
      result.push(...readMDXFiles(path.join(dir,category,year), category))
    })
  })
  return result
}

export function getBlogPosts(): MDXData[] {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function getSortedBlogPosts(): MDXData[] {
  return getBlogPosts()
  .filter(checkPostIfHidden)
  .sort((a, b) => {
    const dateA = new Date(a.metadata.publishedAt)
    const dateB = new Date(b.metadata.publishedAt)

    if (dateA > dateB) return -1
    if (dateA < dateB) return 1

    // If dates are equal, sort by order descending
    return (b.metadata.order as number) - (a.metadata.order as number)
  })
}

export function getAboutPosts(): MDXData[] {
  return getMDXData(path.join(process.cwd(), 'app', 'about'), false)
}

export function getProjectPosts(): MDXData[] {
  return getMDXData(path.join(process.cwd(), 'app', 'projects'), false)
}

export function extractProjectsFromAbout(input: string): string {
  const match = input.match(/#### PROJECTS\n([\s\S]*?)(?=\n####|$)/);

  if (match) {
    return match[0];
  }
  
  return '';
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export function getYear(date: string) {
  return new Date(date).getUTCFullYear()
}

export function getMonth(date: string) {
  return new Date(date).getUTCMonth() + 1
}

export function getUniqueValues(arr: any[]) {
  return [...new Set(arr)];
}

