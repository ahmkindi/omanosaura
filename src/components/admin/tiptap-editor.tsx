'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TiptapEditor({
  value,
  onChange,
  dir = 'ltr',
}: {
  value: string
  onChange: (html: string) => void
  dir?: 'ltr' | 'rtl'
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        dir,
        class:
          'min-h-40 rounded-md border p-3 focus:outline-none [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ms-5 [&_ol]:list-decimal [&_ul]:list-disc [&_img]:max-w-full',
      },
    },
  })

  if (!editor) return null

  const toolbarButton = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
  ) => (
    <Button
      type="button"
      size="sm"
      variant={active ? 'default' : 'ghost'}
      onClick={onClick}
    >
      {icon}
    </Button>
  )

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1" dir="ltr">
        {toolbarButton(
          editor.isActive('bold'),
          () => editor.chain().focus().toggleBold().run(),
          <Bold className="size-4" />,
        )}
        {toolbarButton(
          editor.isActive('italic'),
          () => editor.chain().focus().toggleItalic().run(),
          <Italic className="size-4" />,
        )}
        {toolbarButton(
          editor.isActive('heading', { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          <Heading2 className="size-4" />,
        )}
        {toolbarButton(
          editor.isActive('bulletList'),
          () => editor.chain().focus().toggleBulletList().run(),
          <List className="size-4" />,
        )}
        {toolbarButton(
          editor.isActive('orderedList'),
          () => editor.chain().focus().toggleOrderedList().run(),
          <ListOrdered className="size-4" />,
        )}
        {toolbarButton(editor.isActive('link'), () => {
          const url = prompt('Link URL')
          if (url) editor.chain().focus().setLink({ href: url }).run()
          else editor.chain().focus().unsetLink().run()
        }, <LinkIcon className="size-4" />)}
        {toolbarButton(false, () => {
          const url = prompt('Image URL')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }, <ImageIcon className="size-4" />)}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
