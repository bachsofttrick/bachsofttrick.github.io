export function Quote({ quote, author }: { quote: string, author?: string}) {
  return (
    <span>
      <span className='italic'>{`”${quote}"`}</span>
        {` ${author ?? ''}`}
    </span>
  )
}
