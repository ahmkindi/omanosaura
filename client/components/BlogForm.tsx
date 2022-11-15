import useTranslation from 'next-translate/useTranslation'
import 'react-datepicker/dist/react-datepicker.css'
import MyQuill from './MyQuill'
import Section from './Section'
import { Formik, Form as FormikForm } from 'formik'
import { Form } from 'react-bootstrap'
import { Blog } from '../types/requests'
import * as Yup from 'yup'
import axiosServer from '../utils/axiosServer'
import { useGlobal } from '../context/global'
import { useRouter } from 'next/router'

const BlogForm = ({ blog, id }: { blog: Blog; id?: string }) => {
  const { t } = useTranslation()
  const { setAlert } = useGlobal()
  const router = useRouter()

  const CreateSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, t('common:tooShort'))
      .max(40, t('common:tooLong'))
      .required(),
    titleAr: Yup.string()
      .min(3, t('common:tooShort'))
      .max(40, t('common:tooLong'))
      .required(),
    description: Yup.string()
      .min(50, t('common:tooShort'))
      .max(1000, t('common:tooLong'))
      .required(),
    descriptionAr: Yup.string()
      .min(50, t('common:tooShort'))
      .max(1000, t('common:tooLong'))
      .required(),
    photo: Yup.string().required(),
  })

  const handleSubmit = async (values: Blog) => {
    try {
      const response = await axiosServer.post('user/admin/blogs', values)
      if (response.status === 200) {
        setAlert?.({ type: 'success', message: t('successAdd') })
        router.push('/blogs')
      } else {
        setAlert?.({ type: 'warning', message: t('failedAdd') })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('failedAdd') })
    }
  }

  const deleteBlog = async () => {
    try {
      const response = await axiosServer.delete(`user/admin/blog/${id}`)
      if (response.status === 200) {
        setAlert?.({ type: 'success', message: t('successDelete') })
        router.push('/experiences')
      } else {
        setAlert?.({ type: 'warning', message: t('failedDelete') })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('failedDelete') })
    }
  }

  return (
    <Formik
      initialValues={blog}
      onSubmit={handleSubmit}
      validationSchema={CreateSchema}
    >
      {({ errors, handleChange, values, setValues, touched }) => (
        <FormikForm>
          <Section title={t('engBlog')}>
            <Form.Group className="mb-4 mt-4" dir="ltr">
              <Form.Label>{t('engTitle')}</Form.Label>
              <Form.Control
                name="title"
                value={values.title}
                onChange={handleChange}
                type="text"
              />
            </Form.Group>
            <MyQuill value={engBlog} setValue={setEngBlog} />
          </Section>
          <Section title={t('arBlog')}>
            <Form.Group className="mb-4 mt-4" dir="rtl">
              <Form.Label>{t('arTitle')}</Form.Label>
              <Form.Control
                value={values.titleAr}
                onChange={handleChange}
                name="titleAr"
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-4 mt-4" dir="rtl">
              <Form.Label>{t('arDesc')}</Form.Label>
              <Form.Control
                name="descriptionAr"
                value={values.descriptionAr}
                as="textarea"
                onChange={handleChange}
                isInvalid={
                  errors.descriptionAr !== undefined &&
                  errors.descriptionAr.length > 0 &&
                  touched.descriptionAr
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.descriptionAr}
              </Form.Text>
            </Form.Group>
            <MyQuill value={values.page} setValue={()} />
          </Section>
        </FormikForm>
      )}
    </Formik>
  )
}

export default BlogForm
