import useTranslation from 'next-translate/useTranslation'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { Button, FloatingLabel, Form, InputGroup } from 'react-bootstrap'
import { ProductDetails, ProductKind } from '../types/requests'
import { useGlobal } from '../context/global'
import axiosServer from '../utils/axiosServer'
import { useRouter } from 'next/router'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ar from 'date-fns/locale/ar'
import { RiDeleteBack2Line } from 'react-icons/ri'

const ProductForm = ({
  product,
  id,
}: {
  product: ProductDetails
  id?: string
}) => {
  const { t, lang } = useTranslation('experiences')
  const { setAlert } = useGlobal()
  const router = useRouter()
  registerLocale('ar', ar)

  const CreateSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, t('common:tooShort'))
      .max(30, t('common:tooLong'))
      .required(),
    titleAr: Yup.string()
      .min(3, t('common:tooShort'))
      .max(30, t('common:tooLong'))
      .required(),
    subtitle: Yup.string()
      .min(10, t('common:tooShort'))
      .max(50, t('common:tooLong'))
      .required(),
    subtitleAr: Yup.string()
      .min(10, t('common:tooShort'))
      .max(50, t('common:tooLong'))
      .required(),
    description: Yup.string()
      .min(100, t('common:tooShort'))
      .max(1000, t('common:tooLong'))
      .required(),
    descriptionAr: Yup.string()
      .min(100, t('common:tooShort'))
      .max(1000, t('common:tooLong'))
      .required(),
    photo: Yup.string().required(),
    priceBaisa: Yup.number().integer('common:onlyInt').required(),
    longitude: Yup.number().required(),
    latitude: Yup.number().required(),
  })

  const handleSubmit = async (values: ProductDetails) => {
    try {
      const response = await axiosServer.post('user/admin/products', values)
      if (response.status === 200) {
        setAlert?.({ type: 'success', message: t('successAdd') })
        router.push('/experiences')
      } else {
        setAlert?.({ type: 'warning', message: t('failedAdd') })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('failedAdd') })
    }
  }

  const deleteProduct = async () => {
    try {
      const response = await axiosServer.delete(`user/admin/products/${id}`)
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
      initialValues={product}
      onSubmit={handleSubmit}
      validationSchema={CreateSchema}
    >
      {({ errors, handleChange, values, setValues, touched }) => (
        <FormikForm style={{ maxWidth: '500px', margin: 'auto' }}>
          <Form.Group className="mb-4 mt-4" dir="ltr">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={values.title}
              type="text"
              onChange={handleChange}
              isInvalid={
                errors.title !== undefined &&
                errors.title.length > 0 &&
                touched.title
              }
            />
            <Form.Text className="invalid-feedback">{errors.title}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="ltr">
            <Form.Label>Subtitle</Form.Label>
            <Form.Control
              name="subtitle"
              value={values.subtitle}
              type="text"
              onChange={handleChange}
              isInvalid={
                errors.subtitle !== undefined &&
                errors.subtitle.length > 0 &&
                touched.subtitle
              }
            />
            <Form.Text className="invalid-feedback">
              {errors.subtitle}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="ltr">
            <Form.Label>Description</Form.Label>
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
          <Form.Group className="mb-4 mt-4" dir="rtl">
            <Form.Label>Title Arabic</Form.Label>
            <Form.Control
              name="titleAr"
              value={values.titleAr}
              type="text"
              onChange={handleChange}
              isInvalid={
                errors.titleAr !== undefined &&
                errors.titleAr.length > 0 &&
                touched.titleAr
              }
            />
            <Form.Text className="invalid-feedback">{errors.titleAr}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="rtl">
            <Form.Label>Subtitle Arabic</Form.Label>
            <Form.Control
              name="subtitleAr"
              value={values.subtitleAr}
              type="text"
              onChange={handleChange}
              isInvalid={
                errors.subtitleAr !== undefined &&
                errors.subtitleAr.length > 0 &&
                touched.subtitleAr
              }
            />
            <Form.Text className="invalid-feedback">
              {errors.subtitleAr}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="rtl">
            <Form.Label>Description Arabic</Form.Label>
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
          <Form.Group className="mb-4">
            <Form.Label>{t('otherPhotos')}</Form.Label>
            {values.photos.map((p, i) => (
              <InputGroup key={i}>
                <Form.Control
                  value={values.photos[i]}
                  type="text"
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      photos: [
                        ...prev.photos.slice(0, i),
                        e.target.value,
                        ...prev.photos.slice(i + 1),
                      ],
                    }))
                  }
                />
                <Button
                  onClick={() =>
                    setValues((prev) => ({
                      ...prev,
                      photos: [
                        ...prev.photos.slice(0, i),
                        ...prev.photos.slice(i + 1),
                      ],
                    }))
                  }
                  variant="danger"
                >
                  <RiDeleteBack2Line />
                </Button>
              </InputGroup>
            ))}
            <Button
              onClick={() =>
                setValues((prev) => ({
                  ...prev,
                  photos: [...prev.photos, ''],
                }))
              }
            >
              {t('addPhoto')}
            </Button>
          </Form.Group>
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('plannedDates')}</Form.Label>
            <ReactDatePicker
              onChange={(date) =>
                date
                  ? setValues((prev) => ({
                      ...prev,
                      plannedDates: prev.plannedDates.includes(date)
                        ? prev.plannedDates.filter((d) => d === date)
                        : [...prev.plannedDates, date],
                    }))
                  : null
              }
              highlightDates={values.plannedDates.map((d) => new Date(d))}
              locale={lang}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <FloatingLabel label={t('longitude')}>
              <Form.Control
                placeholder={t('longitude')}
                name="longitude"
                type="number"
                step={0.00001}
                onChange={handleChange}
                isInvalid={
                  errors.longitude !== undefined &&
                  errors.longitude.length > 0 &&
                  touched.longitude
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.longitude}
              </Form.Text>
            </FloatingLabel>
            <FloatingLabel label={t('latitude')}>
              <Form.Control
                name="latitude"
                onChange={handleChange}
                step={0.00001}
                type="number"
                placeholder={t('latitude')}
                isInvalid={
                  errors.latitude !== undefined &&
                  errors.latitude.length > 0 &&
                  touched.latitude
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.latitude}
              </Form.Text>
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-4">
            <FloatingLabel label={t('priceBaisa')}>
              <Form.Control
                placeholder={t('priceBaisa')}
                name="priceBaisa"
                type="number"
                onChange={handleChange}
                step={1}
                isInvalid={
                  errors.priceBaisa !== undefined &&
                  errors.priceBaisa.length > 0 &&
                  touched.priceBaisa
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.priceBaisa}
              </Form.Text>
              <Form.Text className="muted">
                {t('totalPrice')}{' '}
                {new Intl.NumberFormat(lang, {
                  style: 'currency',
                  currency: 'OMR',
                }).format(values.priceBaisa / 1000)}
              </Form.Text>
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Check
              type="radio"
              label={t('trip')}
              checked={values.kind === ProductKind.trip}
              onClick={() =>
                setValues((prev) => ({ ...prev, kind: ProductKind.trip }))
              }
            />
            <Form.Check
              type="radio"
              label={t('adventure')}
              checked={values.kind === ProductKind.adventure}
              onClick={() =>
                setValues((prev) => ({
                  ...prev,
                  kind: ProductKind.adventure,
                }))
              }
            />
          </Form.Group>
          <div style={{ display: 'flex', gap: '2rem' }} className="mb-4 mt-4">
            <Button variant="outline-primary" type="submit">
              {t('submit')}
            </Button>
            {id && (
              <Button variant="danger" onClick={() => deleteProduct()}>
                {t('remove')}
              </Button>
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export default ProductForm
