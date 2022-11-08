import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import Layout from '../components/Layout'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
/* const EditorToolbar = dynamic(() => import('../components/EditorToolbar'), { */
/*   ssr: false, */
/* }) */
/* import { modules, formats } from '../components/EditorToolbar' */

const Blog = () => {
  const { t } = useTranslation('blog')
  const [value, setValue] = useState('')

  return (
    <Layout title={t('title')}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        /* modules={modules} */
        /* formats={formats} */
      />
    </Layout>
  )
}

export default Blog
