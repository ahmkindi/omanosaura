import useTranslation from 'next-translate/useTranslation'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { Button, FloatingLabel, Form, InputGroup, Dropdown } from 'react-bootstrap'
import { ProductDetails, ProductKindLabel } from '../types/requests'
import { useGlobal } from '../context/global'
import axiosServer from '../utils/axiosServer'
import { useRouter } from 'next/router'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ar from 'date-fns/locale/ar'
import { RiDeleteBack2Line } from 'react-icons/ri'
import 'react-quill/dist/quill.snow.css'
import MyQuill from './MyQuill'

const ProductForm = ({
  product,
  kinds,
  id,
}: {
  product: ProductDetails
  kinds: ProductKindLabel[]
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
    photo: Yup.string().required(),
    basePriceBaisa: Yup.number().integer('common:onlyInt').required(),
    extraPriceBaisa: Yup.number().integer('common:onlyInt').required(),
    longitude: Yup.number().required(),
    latitude: Yup.number().required(),
    kind: Yup.string().required()
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
            <Form.Label>{t('form.title')}</Form.Label>
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
            <Form.Label>{t('form.subtitle')}</Form.Label>
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
            <Form.Label>{t('form.desc')}</Form.Label>
            <MyQuill
              value={values.description}
              setValue={(v) =>
                setValues((prev) => ({ ...prev, description: v }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-4 mt-4" dir="rtl">
            <Form.Label>{t('form.arTitle')}</Form.Label>
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
            <Form.Label>{t('form.arSubtitle')}</Form.Label>
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
            <Form.Label>{t('form.arDesc')}</Form.Label>
            <MyQuill
              value={values.descriptionAr}
              setValue={(v) =>
                setValues((prev) => ({ ...prev, descriptionAr: v }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>{t('form.photoUrl')}</Form.Label>
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
            <Form.Label>{t('form.otherPhotos')}</Form.Label>
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
              {t('form.addPhoto')}
            </Button>
          </Form.Group>
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('form.plannedDates')}</Form.Label>
            <ReactDatePicker
              onChange={(date) =>
                date
                  ? setValues((prev) => {
                    const index = prev.plannedDates.findIndex(
                      (d) =>
                        new Date(d).toDateString() ===
                        new Date(date).toDateString()
                    )
                    console.log(prev.plannedDates, date, index)
                    if (index !== -1) {
                      return {
                        ...prev,
                        plannedDates: [
                          ...prev.plannedDates.slice(0, index),
                          ...prev.plannedDates.slice(index + 1),
                        ],
                      }
                    } else
                      return {
                        ...prev,
                        plannedDates: [...prev.plannedDates, new Date(date)],
                      }
                  })
                  : console.log('CLICKED NOTHING')
              }
              highlightDates={values.plannedDates.map((d) => new Date(d))}
              locale={lang}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <FloatingLabel label={t('form.longitude')}>
              <Form.Control
                placeholder={t('form.longitude')}
                name="longitude"
                type="number"
                step={0.00001}
                value={values.longitude}
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
            <FloatingLabel label={t('form.latitude')}>
              <Form.Control
                name="latitude"
                onChange={handleChange}
                value={values.latitude}
                step={0.00001}
                type="number"
                placeholder={t('form.latitude')}
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
          <Form.Group className="mb-2">
            <FloatingLabel label={t('form.basePriceBaisa')}>
              <Form.Control
                placeholder={t('form.basePriceBaisa')}
                name="basePriceBaisa"
                type="number"
                onChange={handleChange}
                step={1}
                value={values.basePriceBaisa}
                isInvalid={
                  errors.basePriceBaisa !== undefined &&
                  errors.basePriceBaisa.length > 0 &&
                  touched.basePriceBaisa
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.basePriceBaisa}
              </Form.Text>
              <Form.Text className="muted">
                {t('totalPrice')}{' '}
                {new Intl.NumberFormat(lang, {
                  style: 'currency',
                  currency: 'OMR',
                }).format(values.basePriceBaisa / 1000)}
              </Form.Text>
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-4">
            <FloatingLabel label={t('form.extraPriceBaisa')}>
              <Form.Control
                placeholder={t('form.extraPriceBaisa')}
                name="extraPriceBaisa"
                type="number"
                onChange={handleChange}
                step={1}
                value={values.extraPriceBaisa}
                isInvalid={
                  errors.extraPriceBaisa !== undefined &&
                  errors.extraPriceBaisa.length > 0 &&
                  touched.extraPriceBaisa
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.extraPriceBaisa}
              </Form.Text>
              <Form.Text className="muted">
                {t('totalPrice')}{' '}
                {new Intl.NumberFormat(lang, {
                  style: 'currency',
                  currency: 'OMR',
                }).format(values.extraPriceBaisa / 1000)}
              </Form.Text>
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-4">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {t('kind')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {kinds.map(k => <Dropdown.Item
                  onClick={() => setValues(prev => ({ ...prev, kind: k.id }))}
                  key={k.id}
                  active={values.kind === k.id}>
                  {lang === 'ar' ? k.label_ar : k.label}
                </Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
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
