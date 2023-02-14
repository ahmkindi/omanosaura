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
import { User } from 'firebase/auth'

const Profile = () => {
  const { t, lang } = useTranslation('profile')
  const { user } = useGlobal()
  const { setAlert } = useGlobal()
  const isAr = lang === 'ar'

  const SignupSchema = Yup.object().shape({
    displayName: Yup.string()
      .min(2, t('tooShort'))
      .max(30, t('tooShort'))
      .required(),
    phoneNumber: Yup.string()
      .min(5, t('tooShort'))
      .max(17, t('tooLong'))
      .required(),
    email: Yup.string().email(t('invalidEmail')).required(),
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
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label>{t('emailAdr')}</Form.Label>
                <Form.Control
                  name="email"
                  value={values.email ?? ''}
                  type="email"
                  onChange={handleChange}
                  isInvalid={
                    errors.email !== undefined &&
                    errors.email.length > 0 &&
                    touched.email
                  }
                />
                <Form.Text className="invalid-feedback">
                  {errors.email}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicName">
                <Form.Label>{t('displayname')}</Form.Label>
                <Form.Control
                  name="displayName"
                  value={values.displayName ?? ''}
                  type="text"
                  onChange={handleChange}
                  isInvalid={
                    errors.displayName !== undefined &&
                    errors.displayName.length > 0 &&
                    touched.displayName
                  }
                />
                <Form.Text className="invalid-feedback">
                  {errors.displayName}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>{t('phone')}</Form.Label>
                <PhoneInputWithCountrySelect
                  value={values.phoneNumber ?? ''}
                  onChange={(num) =>
                    setValues({ ...values, phoneNumber: num?.toString() ?? '' })
                  }
                  name="phone"
                  isInvalid={
                    errors.phoneNumber !== undefined &&
                    errors.phoneNumber.length > 0 &&
                    touched.phoneNumber
                  }
                  labels={isAr ? ar : en}
                  dir="ltr"
                />
                {errors.phoneNumber !== undefined &&
                  errors.phoneNumber.length > 0 &&
                  touched.phoneNumber && (
                    <Form.Text style={{ color: 'red' }}>
                      {errors.phoneNumber}
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
