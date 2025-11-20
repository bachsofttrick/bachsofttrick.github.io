function ArrowIcon({ noArrow }: { noArrow: boolean }) {
  if (noArrow) return
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FooterPart({ href = '', title, noArrow = false }: { href?: string, title: string, noArrow?: boolean}) {
  if (!href) return (
    <li>
      <ArrowIcon noArrow={noArrow} />
      <p className={(noArrow ? "" : "ml-2") + " h-7 flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"}>{title}</p>
    </li>
  )

  return (
    <li>
      <a
        className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
        rel="noopener noreferrer"
        target="_blank"
        href={href}
      >
        <ArrowIcon noArrow={noArrow} />
        <p className={(noArrow ? "" : "ml-2") + " h-7"}>{title}</p>
      </a>
    </li>
  )
}

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <FooterPart title={"Corvallis, Oregon, USA"} noArrow />
        <FooterPart title={"Phone: 541-360-9231"} noArrow />
      </ul>
      <ul className="font-sm flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <FooterPart href={"https://github.com/bachsofttrick/"} title={"github"} />
        <FooterPart href={"https://www.linkedin.com/in/brphan/"} title={"linkedin"} />
        <FooterPart href={"mailto:xuanbach1307@gmail.com"} title={"email"} />
        {/* <FooterPart href={"https://github.com/bachsofttrick/bachsofttrick.github.io/raw/refs/heads/main/resume.docx"} title={"get resume"} /> */}
      </ul>
      <p className="mt-8 text-neutral-600 dark:text-neutral-300">
        {new Date().getFullYear()}
      </p>
    </footer>
  )
}
