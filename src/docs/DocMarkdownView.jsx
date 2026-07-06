import { forwardRef, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { HiMiniChevronRight } from 'react-icons/hi2'
import { GenericInsightCard, NotaCallout, ReferenceFileCard } from './components/DocCallouts.jsx'
import { DocRichTable } from './components/DocRichTable.jsx'
import { pickHeadingIcon } from './docHeadingIcons.jsx'
import { extractPlainText } from './utils/extractPlainText.js'
import { stripEmojis } from './utils/stripEmojis.js'

const mdBox =
  'rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-[13px] leading-relaxed text-slate-200 shadow-inner'

function normalizeDocMarkdown(markdown) {
  return stripEmojis(markdown)
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
}

export const DocMarkdownView = forwardRef(function DocMarkdownView({ markdown }, ref) {
  const cleanMarkdown = useMemo(() => normalizeDocMarkdown(markdown), [markdown])

  return (
    <div className="doc-rich" ref={ref}>
      <div className="doc-content px-1 pb-28 pt-2 sm:px-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={{
            h1: ({ children, ...props }) => (
              <div className="relative mb-10 mt-2">
                <div className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-3xl bg-gradient-to-r from-violet-600/12 via-slate-800/20 to-emerald-500/10 blur-sm" />
                <h1
                  className="relative text-balance bg-gradient-to-r from-violet-100 via-slate-50 to-emerald-100 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl"
                  {...props}
                >
                  {children}
                </h1>
              </div>
            ),
            h2: ({ children, ...props }) => {
              const title = extractPlainText(children).trim()
              const Icon = pickHeadingIcon(title)
              return (
                <div className="doc-h2-wrap group relative mb-3 mt-14 scroll-mt-32 first:mt-2 sm:first:mt-4">
                  <div className="pointer-events-none absolute -inset-x-4 -inset-y-2 rounded-2xl bg-gradient-to-r from-violet-600/[0.07] via-transparent to-emerald-500/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6" />
                  <div className="relative flex flex-col gap-3 border-b border-slate-600/55 pb-4 sm:flex-row sm:items-center sm:gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-600/60 bg-slate-800/90 text-slate-100 shadow-inner ring-1 ring-white/5">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2
                      className="min-w-0 flex-1 text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl"
                      {...props}
                    >
                      {children}
                    </h2>
                  </div>
                </div>
              )
            },
            h3: ({ children, ...props }) => (
              <h3
                className="mb-3 mt-10 max-w-[68ch] scroll-mt-32 text-lg font-semibold text-slate-100 sm:text-xl"
                {...props}
              >
                <span className="mr-2 inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-emerald-400/80 align-middle" />
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 className="mb-2 mt-8 max-w-[68ch] text-base font-semibold text-slate-200" {...props}>
                {children}
              </h4>
            ),
            p: ({ children, ...props }) => (
              <p
                className="mb-5 max-w-[68ch] text-[15px] leading-[1.75] text-slate-300/95 sm:text-[15.5px]"
                {...props}
              >
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul className="doc-list-ul mb-8 max-w-[68ch] list-none pl-0 text-[15px] text-slate-300/95" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol
                className="doc-list-ol mb-8 max-w-[68ch] list-decimal space-y-2.5 pl-6 text-[15px] text-slate-300/95 marker:font-semibold marker:text-emerald-400/90"
                {...props}
              >
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="doc-li leading-relaxed text-slate-300/95" {...props}>
                <HiMiniChevronRight className="doc-li-chev mt-0.5 h-5 w-5 shrink-0 text-emerald-400/85" aria-hidden />
                <div className="doc-li-body min-w-0 flex-1 [&>p]:m-0">{children}</div>
              </li>
            ),
            blockquote: ({ children }) => {
              const raw = extractPlainText(children).trim()
              const lower = raw.toLowerCase()

              if (lower.includes('archivo referenciado')) {
                return <ReferenceFileCard>{children}</ReferenceFileCard>
              }
              if (lower.startsWith('nota.') || raw.includes('**Nota.**') || lower.includes('**nota**')) {
                return <NotaCallout>{children}</NotaCallout>
              }
              return <GenericInsightCard>{children}</GenericInsightCard>
            },
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                className="font-medium text-sky-300 underline decoration-sky-500/40 underline-offset-4 transition-colors hover:text-sky-200"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            ),
            hr: () => (
              <div className="my-12 flex max-w-[68ch] items-center gap-4" role="separator">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600/70 to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">·</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600/70 to-transparent" />
              </div>
            ),
            strong: ({ children, ...props }) => (
              <strong className="font-semibold text-slate-50" {...props}>
                {children}
              </strong>
            ),
            em: ({ children, ...props }) => (
              <em className="italic text-slate-200/95" {...props}>
                {children}
              </em>
            ),
            code: ({ className, children, ...props }) => {
              if (!className) {
                return (
                  <code
                    className="rounded-md border border-emerald-500/20 bg-emerald-950/35 px-1.5 py-0.5 text-[13px] text-emerald-100/95"
                    {...props}
                  >
                    {children}
                  </code>
                )
              }
              return (
                <code
                  className="block bg-transparent p-0 font-mono text-[13px] leading-relaxed text-slate-100"
                  {...props}
                >
                  {children}
                </code>
              )
            },
            pre: ({ children, ...props }) => (
              <pre className={`app-scroll-x mb-8 max-w-none ${mdBox}`} {...props}>
                {children}
              </pre>
            ),
            table: ({ children, ...props }) => (
              <DocRichTable tableProps={props}>{children}</DocRichTable>
            ),
            thead: ({ children, ...props }) => (
              <thead
                className="bg-slate-800/95 text-[11px] font-semibold uppercase tracking-wide text-slate-300"
                {...props}
              >
                {children}
              </thead>
            ),
            tbody: ({ children, ...props }) => (
              <tbody className="divide-y divide-slate-700/60 bg-slate-950/20" {...props}>
                {children}
              </tbody>
            ),
            tr: ({ children, ...props }) => (
              <tr className="transition-colors odd:bg-slate-900/15 even:bg-slate-900/5 hover:bg-violet-950/20" {...props}>
                {children}
              </tr>
            ),
            th: ({ children, ...props }) => (
              <th className="whitespace-nowrap px-4 py-3 text-slate-200" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="px-4 py-2.5 align-top text-[13px] text-slate-300/95" {...props}>
                {children}
              </td>
            ),
            input: ({ type, checked, ...props }) => {
              if (type === 'checkbox') {
                return (
                  <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    readOnly
                    tabIndex={-1}
                    className="mr-2 mt-1 h-4 w-4 shrink-0 rounded border-slate-500 bg-slate-900 text-emerald-500 accent-emerald-400"
                    {...props}
                  />
                )
              }
              return <input type={type} {...props} />
            },
          }}
        >
          {cleanMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  )
})
