import { cleanRichHtml } from '@/lib/sanitize'

export function RichContent({ html }: { html: string }) {
  return (
    <div
      className="space-y-4 text-[1.05rem] leading-relaxed [&_a]:font-medium [&_a]:text-(--color-secondary) [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-s-2 [&_blockquote]:border-(--color-secondary) [&_blockquote]:ps-4 [&_blockquote]:italic [&_h1]:font-(family-name:--font-display) [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:font-(family-name:--font-display) [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:ms-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:space-y-1"
      dangerouslySetInnerHTML={{ __html: cleanRichHtml(html) }}
    />
  )
}
