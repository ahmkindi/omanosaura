import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useRef, useMemo } from 'react'
import { ReactQuillProps } from 'react-quill'

const ReactQuill = dynamic(
  async () => {
    const ReactQuill = (await import('react-quill')).default

    const name = ({
      forwardedRef,
      props,
    }: {
      forwardedRef: any
      props: ReactQuillProps
    }) => <ReactQuill ref={forwardedRef} {...props} />
    return name
  },
  {
    ssr: false,
  }
)

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'align',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'direction',
]

const MyQuill = ({
  value,
  setValue,
}: {
  value: string
  setValue: (newValue: string) => void
}) => {
  const quillRef = useRef(null)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [
            { align: '' },
            { align: 'center' },
            { align: 'right' },
            { align: 'justify' },
          ],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image', 'video'],
          [{ direction: 'rtl' }],
          ['clean'],
          ['fullscreen'],
        ],
        clipboard: {
          matchVisual: false,
        },
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  )

  function imageHandler() {
    if (!quillRef.current) return

    const editor = (quillRef.current as any).getEditor()
    const range = editor.getSelection()
    const value = prompt('Please enter the image URL')

    if (value && range) {
      editor.insertEmbed(range.index, 'image', value, 'user')
    }
  }

  return (
    <ReactQuill
      forwardedRef={quillRef}
      props={{
        theme: 'snow',
        value: value,
        onChange: (v) => setValue(v),
        modules: modules,
        formats: formats,
      }}
    />
  )
}

export default MyQuill
