import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import Layout from '../components/Layout'
import 'react-quill/dist/quill.snow.css'
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false
import EditorToolbar, { modules, formats } from '../components/EditorToolbar'
import 'react-quill/dist/quill.snow.css'

const Blog = () => {
  const { t } = useTranslation('about')
  const [value, setValue] = useState('')
  console.log(value)

  return (
    <Layout title={t('title')}>
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
      />
    </Layout>
  )
}

export default Blog
