import useTranslation from 'next-translate/useTranslation'
import { FormEvent, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import PhoneInputWithCountrySelect from 'react-phone-number-input'
import Layout from '../components/Layout'
import useUser from '../hooks/useUser'
import 'react-phone-number-input/style.css'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { User } from '../types/requests'

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  phone: Yup.string()
    .min(5, 'Too Short!')
    .max(15, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
})

const Profile = () => {
  const { t } = useTranslation('profile')
  const { user } = useUser()

  const handleSubmit = (values: User) => {
    console.log(values)
  }

  return (
    <Layout title={t('title')}>
      {!user ? null : (
        <Formik
          initialValues={user}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            handleSubmit(values)
          }}
        >
          {({ errors, handleChange, values }) => (
            <FormikForm
              style={{ maxWidth: '50%', margin: 'auto' }}
              onInvalid={() => console.log('invalid')}
            >
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  value={values.email}
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  isInvalid={errors.email !== undefined}
                />
                <Form.Text className="invalid-feedback">
                  {errors.email}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  type="text"
                  isInvalid={errors.firstname !== undefined}
                />
                <Form.Text className="invalid-feedback">
                  {errors.firstname}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="formBasicName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  value={values.lastname}
                  type="text"
                  onChange={handleChange}
                  isInvalid={errors.lastname !== undefined}
                />
                <Form.Text className="invalid-feedback">
                  {errors.lastname}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Phone Number</Form.Label>
                {/* <Form.Control */}
                {/*   value={values.phone} */}
                {/*   type="tel" */}
                {/*   name="phone" */}
                {/*   onChange={handleChange} */}
                {/*   isInvalid={errors.phone !== undefined} */}
                {/* /> */}
                <PhoneInputWithCountrySelect
                  placeholder={t('phone')}
                  value={values.phone}
                  onChange={handleChange}
                  name="phone"
                  isInvalid={errors.phone !== undefined}
                />
                <Form.Text className="invalid-feedback">
                  {errors.phone}
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </FormikForm>
          )}
        </Formik>
      )}
    </Layout>
  )
}

export default Profile
