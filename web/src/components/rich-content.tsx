import { cleanRichHtml } from '@/lib/sanitize'

export function RichContent({ html }: { html: string }) {
  return (
    <div
      className="prose-rich max-w-none space-y-3 [&_a]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ms-5 [&_ol]:list-decimal [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: cleanRichHtml(html) }}
    />
  )
}
