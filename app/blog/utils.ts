import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  hidden: string
}

export type MDXData = {
  metadata: Metadata
  slug: string
  category: string
  content: string
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
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md')
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string, enableCate: boolean = true): MDXData[] {
  // Only get MDX files without folders
  if (!enableCate) {
    let mdxFiles = getMDXFiles(dir)
    return mdxFiles.map((file) => {
      let { metadata, content } = readMDXFile(path.join(dir, file))
      let slug = path.basename(file, path.extname(file))
      return {
        metadata,
        slug,
        category: '',
        content,
      }
    })
  }

  const categories: string[] = fs.readdirSync(dir)
  const result: MDXData[] = []
  categories.forEach((category) => {
    let mdxFiles = getMDXFiles(path.join(dir,category))
    result.push(...mdxFiles.map((file) => {
      let { metadata, content } = readMDXFile(path.join(dir,category,file))
      let slug = path.basename(file, path.extname(file))
      return {
        metadata,
        slug,
        category,
        content,
      }
    }))
  })
  return result
}

export function getBlogPosts(): MDXData[] {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function getSortedBlogPosts(): MDXData[] {
  return getBlogPosts()
  .filter((post) => !post.metadata.hidden)
  .sort((a, b) => {
    if (
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
    ) {
      return -1
    }
    return 1
  })
}

export function getAboutPosts(): MDXData[] {
  let posts = getMDXData(path.join(process.cwd(), 'app', 'about'), false)
  return posts
}

export function getAboutProjectPosts(): MDXData[] {
  let posts = getMDXData(path.join(process.cwd(), 'app', 'about-projects'), false)
  return posts
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
  return new Date(date).getFullYear()
}

export function getMonth(date: string) {
  return new Date(date).getMonth() + 1
}

export function getUniqueValues(arr: any[]) {
  return [...new Set(arr)];
}

