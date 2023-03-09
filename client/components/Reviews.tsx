import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import useSWRInfinite from "swr/infinite";
import {
  emptyUserReview,
  Product,
  Review,
  UserReview,
} from "../types/requests";
import axiosServer, { fetcher } from "../utils/axiosServer";
import styles from "../styles/Reviews.module.scss";
import useSWR from "swr";
import useTranslation from "next-translate/useTranslation";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { useGlobal } from "../context/global";
import { RatingWithCount } from "./RatingWithCount";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const Reviews = ({ product }: { product: Product }) => {
  const { t, lang } = useTranslation('experiences');
  const { setAlert } = useGlobal()

  const getKey = (pageIndex: number, previousPageData: Review[]) => {
    if (previousPageData && !previousPageData.length) {
      return null
    }
    return `products/${product.id}/reviews?page=${pageIndex + 1}`
  }

  const ReviewSchema = Yup.object().shape({
    title: Yup.string().min(1, t('common:tooShort')).max(30, t('common:tooLong')).optional(),
    review: Yup.string().min(2, t('common:tooShort')).optional(),
  });

  const [openModal, setOpenModal] = useState(false);
  const { user } = useGlobal();
  const { data: userReview } = useSWR(
    user ? `user/products/${product.id}/review` : null,
    fetcher<UserReview>
  );
  const { data: reviews, size, setSize } = useSWRInfinite(getKey, fetcher<Review[]>);

  const isAr = lang === "ar";

  const handleSubmit = async (values: UserReview) => {
    try {
      const response = await axiosServer.post('user/products/review', values)
      if (response.status === 200) {
        setAlert?.({ type: 'success', message: t('successfulReview') })
      } else {
        setAlert?.({ type: 'warning', message: t('failedReview') })
      }
    } catch (error) {
      setAlert?.({ type: 'warning', message: t('failedReview') })
    } finally {
      setOpenModal(false)
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h3>{t('reviews')}</h3>
          <RatingWithCount
            rating={product.rating}
            ratingCount={product.ratingCount}
          />
        </div>

        {user ?
          <Button variant="outline-primary" onClick={() => setOpenModal(true)}>{t('addReview')}</Button>
          :
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{t('common:loginFirst')}</Tooltip>}>
            <span className="d-inline-block">
              <Button variant="outline-primary" disabled>{t('addReview')}</Button>
            </span>
          </OverlayTrigger>}
      </div>
      {reviews ?
        <>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry>
              {reviews.flat().map(r => <SingleReview key={r.userId} review={r} />)}
            </Masonry>
          </ResponsiveMasonry>
          {size <= reviews.length && <Button onClick={() => setSize((prev) => prev + 1)}>{t('loadMore')}</Button>}
        </>
        : <h4>No customer reviews yet 😔</h4>
      }
      {openModal &&
        <Modal show onHide={() => setOpenModal(false)} dir={isAr ? 'rtl' : 'ltr'}>
          <Modal.Header closeButton={!isAr}>
            <Modal.Title>{t('userReview', { name: user?.name })}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={userReview ?? emptyUserReview}
              onSubmit={handleSubmit}
              validationSchema={ReviewSchema}
            >
              {({ errors, handleChange, values, setValues, touched }) => (
                <FormikForm>
                  <div className="flex gap-1 items-center justify-center">
                    <ReactStars
                      count={5}
                      size={23}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      activeColor="var(--orange)"
                      onChange={(e: number) => setValues(prev => ({ ...prev, rating: e }))}
                      value={values.rating}
                    />
                    <p className="m-0 p-0">{`${values.rating}/5`}</p>
                  </div>
                  <Form.Group className="mb-4 mt-4">
                    <Form.Label>{t('experiences:reviewTitle')}</Form.Label>
                    <Form.Control
                      name="title"
                      value={values.title}
                      type="text"
                      onChange={handleChange}
                      isInvalid={errors.title !== undefined && (errors.title.length > 0) && touched.title}
                    />
                    <Form.Text className="invalid-feedback">
                      {errors.title}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>{t('experiences:reviewDesc')}</Form.Label>
                    <Form.Control
                      name="review"
                      value={values.review}
                      onChange={handleChange}
                      isInvalid={errors.review !== undefined && (errors.review.length > 0) && touched.review}
                      as="textarea"
                      rows={4}
                    />
                    <Form.Text className="invalid-feedback">
                      {errors.review}
                    </Form.Text>
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setOpenModal(false)}>
                      {t('close')}
                    </Button>
                    <Button variant="outline-primary" type="submit">
                      {t('submit')}
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      }
    </div>
  );
};

const SingleReview = ({ review }: { review: Review }) => {
  const { lang } = useTranslation();
  const lastUpdated = new Date(review.lastUpdated)

  return (
    <div className={styles.reviewCard} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h4>{review.name}</h4>
      <div>
        <ReactStars
          count={5}
          size={23}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="var(--orange)"
          edit={false}
          value={review.rating}
        />
      </div>
      <h3>{review.title}</h3>
      <p>{review.review}</p>
      <h6>{`${lastUpdated.getDate()}/${lastUpdated.getMonth()}/${lastUpdated.getFullYear()}`}</h6>
    </div>
  );
};

export default Reviews;
