import useTranslation from 'next-translate/useTranslation'
import 'react-datepicker/dist/react-datepicker.css'
import MyQuill from './MyQuill'
import { Formik, Form as FormikForm } from 'formik'
import { Button, Form } from 'react-bootstrap'
import { Blog } from '../types/requests'
import * as Yup from 'yup'
import axiosServer from '../utils/axiosServer'
import { useGlobal } from '../context/global'
import { useRouter } from 'next/router'
import styles from '../styles/blog.module.scss'

const BlogForm = ({ blog, id }: { blog: Blog; id?: string }) => {
  const { t } = useTranslation('blogs')
  const { t: common } = useTranslation('common')
  const { setAlert } = useGlobal()
  const router = useRouter()

  const CreateSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, common('tooShort'))
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
      const response = await axiosServer.delete(`user/admin/blogs/${id}`)
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
        <FormikForm style={{ textAlign: 'initial' }}>
          <Form.Group className="mb-4">
            <Form.Label>{t('photoUrl')}</Form.Label>
            <Form.Control
              name="photo"
              value={values.photo}
              type="text"
              onChange={handleChange}
              isInvalid={
                errors.photo !== undefined &&
                errors.photo.length > 0 &&
                touched.photo
              }
            />
            <Form.Text className="invalid-feedback">{errors.photo}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="ltr">
            <Form.Label>{t('engTitle')}</Form.Label>
            <Form.Control
              name="title"
              value={values.title}
              onChange={handleChange}
              type="text"
              isInvalid={
                errors.title !== undefined &&
                errors.title.length > 0 &&
                touched.title
              }
            />
            <Form.Text className="invalid-feedback">{errors.title}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="ltr">
            <Form.Label>{t('engDesc')}</Form.Label>
            <Form.Control
              name="description"
              value={values.description}
              as="textarea"
              onChange={handleChange}
              isInvalid={
                errors.description !== undefined &&
                errors.description.length > 0 &&
                touched.description
              }
            />
            <Form.Text className="invalid-feedback">
              {errors.description}
            </Form.Text>
          </Form.Group>
          <div className={styles.blog}>
            <MyQuill
              value={values.page}
              setValue={(v) => setValues((prev) => ({ ...prev, page: v }))}
            />
          </div>
          <Form.Group className="mb-4 mt-8" dir="rtl">
            <Form.Label>{t('arTitle')}</Form.Label>
            <Form.Control
              value={values.titleAr}
              onChange={handleChange}
              name="titleAr"
              type="text"
              isInvalid={
                errors.titleAr !== undefined &&
                errors.titleAr.length > 0 &&
                touched.titleAr
              }
            />
            <Form.Text className="invalid-feedback">{errors.titleAr}</Form.Text>
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
          <div className={styles.blog}>
            <MyQuill
              value={values.pageAr}
              setValue={(v) => setValues((prev) => ({ ...prev, pageAr: v }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '2rem' }} className="mb-4 mt-4">
            <Button variant="outline-primary" type="submit">
              {t('submit')}
            </Button>
            {id && (
              <Button variant="danger" onClick={() => deleteBlog()}>
                {t('delete')}
              </Button>
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export default BlogForm
