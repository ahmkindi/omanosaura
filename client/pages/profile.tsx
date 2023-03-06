import useTranslation from 'next-translate/useTranslation'
import { Button, Form } from 'react-bootstrap'
import PhoneInputWithCountrySelect from 'react-phone-number-input'
import Layout from '../components/Layout'
import ar from 'react-phone-number-input/locale/ar.json'
import en from 'react-phone-number-input/locale/en.json'
import 'react-phone-number-input/style.css'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import axiosServer from '../utils/axiosServer'
import { useGlobal } from '../context/global'
import { User } from '../types/requests'

const Profile = () => {
  const { t, lang } = useTranslation('profile')
  const { user } = useGlobal()
  const { setAlert } = useGlobal()
  const isAr = lang === 'ar'

  const SignupSchema = Yup.object().shape({
    name: Yup.string().min(2, t('tooShort')).max(35, t('tooLong')).required(),
    phone: Yup.string().min(5, t('tooShort')).max(17, t('tooLong')).required(),
  })

  const handleSubmit = async (values: User) => {
    try {
      const response = await axiosServer.put('user', values)
      if (response.status === 200) {
        setAlert?.({
          type: 'success',
          message: t('successUpdate'),
        })
      } else {
        setAlert?.({ type: 'warning', message: t('failedUpdate') })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('failedUpdate') })
    }
  }

  return (
    <Layout title={t('title')}>
      {!user ? null : (
        <Formik
          initialValues={user}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, handleChange, values, touched, setValues }) => (
            <FormikForm style={{ maxWidth: '400px', margin: 'auto' }}>
              <Form.Group className="mb-4" controlId="formBasicName">
                <Form.Label>{t('name')}</Form.Label>
                <Form.Control
                  name="name"
                  value={values.name ?? ''}
                  type="text"
                  onChange={handleChange}
                  isInvalid={
                    errors.name !== undefined &&
                    errors.name.length > 0 &&
                    touched.name
                  }
                />
                <Form.Text className="invalid-feedback">
                  {errors.name}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>{t('phone')}</Form.Label>
                <PhoneInputWithCountrySelect
                  value={values.phone ?? ''}
                  onChange={(num) =>
                    setValues({ ...values, phone: num?.toString() ?? '' })
                  }
                  name="phone"
                  isInvalid={
                    errors.phone !== undefined &&
                    errors.phone.length > 0 &&
                    touched.phone
                  }
                  labels={isAr ? ar : en}
                  dir="ltr"
                />
                {errors.phone !== undefined &&
                  errors.phone.length > 0 &&
                  touched.phone && (
                    <Form.Text style={{ color: 'red' }}>
                      {errors.phone}
                    </Form.Text>
                  )}
              </Form.Group>
              <Button variant="outline-primary" type="submit" className="mb-4">
                {t('update')}
              </Button>
            </FormikForm>
          )}
        </Formik>
      )}
    </Layout>
  )
}

export default Profile
