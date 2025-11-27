import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import './mdx.css'

function Table({ data }: { data: { headers: any[], rows: any[] }}) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function YoutubeEmbed({videoId, link}: {videoId?: string, link?: string}) {
  const href = videoId ? `https://youtube.com/embed/${videoId}` : link
  return (
    <div className="flex justify-center my-4">
      <iframe width="560" height="315" src={href} title="YouTube video player" allow="accelerometer; autoplay;
      clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
      referrerPolicy="strict-origin-when-cross-origin" />
    </div>
  )
}

function DoubleYtEmbed({vid1, vid2}: {vid1: string, vid2: string}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <YoutubeEmbed videoId={vid1}></YoutubeEmbed>
      <YoutubeEmbed videoId={vid2}></YoutubeEmbed>
    </div>
  )
}

function CustomLink(props: { href: string, children: any }) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  // Add youtube video
  if (href.startsWith('https://www.youtube.com/embed') || href.startsWith('https://youtube.com/embed')) {
    return <YoutubeEmbed link={href}></YoutubeEmbed>
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function Image(props = {
  src: '', alt: ''
}) {
  if (props.alt.includes('gallery')) {
    const imgs = props.src.split(',')
    const result = (
      <p className='image-container'>
        {
          imgs.map((src) => <img key={src} src={src} />)
        }
      </p>
    )
    return result
  }

  return (
    <p className='flex justify-center'>
      <img {...props} />
    </p>
  )
}

function Gallery({imgs = []}) {
  return (
    <p className='image-container'>
      {imgs.map((src) => <img key={src} src={src} />)}
    </p>
  )
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number, type = '') {
  let className;
  switch (type) {
    case 'resume':
      className = 'flex justify-center'
      break;
    default:
      break;
  }

  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug,
        className
      },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

// Add more components here
let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: Image,
  a: CustomLink,
  code: Code,
  Table,
  YoutubeEmbed,
  DoubleYtEmbed,
  Gallery,
}

export function CustomMDX(props: { type?: string, source: string, components?: any }) {
  switch (props.type) {
    case 'resume':
      components.h4 = createHeading(4, props.type)
      break;
    default:
      break;
  }
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
