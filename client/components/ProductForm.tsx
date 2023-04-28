import useTranslation from 'next-translate/useTranslation'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { Button, FloatingLabel, Form, InputGroup, Dropdown } from 'react-bootstrap'
import { ProductDetails, ProductKind } from '../types/requests'
import { useGlobal } from '../context/global'
import axiosServer from '../utils/axiosServer'
import { useRouter } from 'next/router'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ar from 'date-fns/locale/ar'
import 'react-quill/dist/quill.snow.css'
import MyQuill from './MyQuill'
import { isAfter } from 'date-fns'
import { AiOutlineClose } from 'react-icons/ai'

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
    photo: Yup.string().required(),
    basePriceBaisa: Yup.number().integer('common:onlyInt').required(),
    pricePer: Yup.number().integer(t('common:onlyInt')).required(),
    extraPriceBaisa: Yup.number().integer('common:onlyInt').required(),
    longitude: Yup.number().required().max(180, t('common:below', { value: 180 })).min(-180, t('common:above', { value: -180 })),
    latitude: Yup.number().required().max(90, t('common:below', { value: 90 })).min(-90, t('common:above', { value: -90 })),
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
        <FormikForm style={{ maxWidth: '300rem', margin: 'auto', textAlign: 'initial' }}>
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('form.title')}</Form.Label>
            <Form.Control
              dir="ltr"
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
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('form.subtitle')}</Form.Label>
            <Form.Control
              dir="ltr"
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
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('form.desc')}</Form.Label>
            <MyQuill
              value={values.description}
              setValue={(v) =>
                setValues((prev) => ({ ...prev, description: v }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('form.arTitle')}</Form.Label>
            <Form.Control
              dir="rtl"
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
          <Form.Group className="mb-4 mt-4">
            <Form.Label>{t('form.arSubtitle')}</Form.Label>
            <Form.Control
              dir="rtl"
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
          <Form.Group className="mb-4 mt-4">
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
                  <AiOutlineClose />
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
              className="mx-2"
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
                    if (index !== -1) {
                      return {
                        ...prev,
                        plannedDates: [
                          ...prev.plannedDates.slice(0, index),
                          ...prev.plannedDates.slice(index + 1),
                        ],
                      }
                    } else if (isAfter(new Date(date), new Date())) {
                      return {
                        ...prev,
                        plannedDates: [...prev.plannedDates, new Date(date)],
                      }
                    }
                    return prev
                  })
                  : console.log('CLICKED NOTHING')
              }
              highlightDates={values.plannedDates.map((d) => new Date(d))}
              locale={lang}
            />
            <div className="flex gap-2 flex-wrap my-2">
              {values.plannedDates.filter(d => isAfter(d, new Date())).map((d) => <div className="flex items-center gap-2 bg-[#fff] rounded shadow-sm" key={`date-${d.toDateString()}`}><p className="mb-0 p-2">{d.toLocaleDateString()}</p>
                <Button
                  onClick={() =>
                    setValues((prev) => {
                      const index = prev.plannedDates.findIndex(
                        (pd) =>
                          new Date(d).toDateString() ===
                          new Date(pd).toDateString()
                      )
                      return {
                        ...prev,
                        plannedDates: [
                          ...prev.plannedDates.slice(0, index),
                          ...prev.plannedDates.slice(index + 1),
                        ],
                      }
                    })
                  }
                  variant="danger"
                >
                  <AiOutlineClose />
                </Button>
              </div>)}
            </div>
          </Form.Group>
          <Form.Group className="mb-4 flex gap-3">
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
          <Form.Group className="mb-2 flex gap-3">
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
            <FloatingLabel label={t('form.pricePer')}>
              <Form.Control
                placeholder={t('form.pricePer')}
                name="pricePer"
                type="number"
                onChange={handleChange}
                step={1}
                value={values.pricePer}
                isInvalid={
                  errors.pricePer !== undefined &&
                  errors.pricePer.length > 0 &&
                  touched.pricePer
                }
              />
              <Form.Text className="invalid-feedback">
                {errors.pricePer}
              </Form.Text>
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-4 w-48">
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
                {Object.values(ProductKind).map(k => <Dropdown.Item
                  onClick={() => setValues(prev => ({ ...prev, kind: k }))}
                  key={k}
                  active={values.kind === k}>
                  {t(`common:productkind.${k}.title`)}
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
