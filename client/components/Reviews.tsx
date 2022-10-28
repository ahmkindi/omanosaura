import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import useSWRInfinite from "swr/infinite";
import {
  emptyUserReview,
  Product,
  Review,
  UserReview,
} from "../types/requests";
import axiosServer, { fetcher } from "../utils/axiosServer";
import styles from "../styles/Reviews.module.scss";
import useUser from "../hooks/useUser";
import useSWR from "swr";
import useTranslation from "next-translate/useTranslation";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { useGlobal } from "../context/global";
import { RatingWithCount } from "./RatingWithCount";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const Reviews = ({ product }: { product: Product }) => {
  const { t, lang } = useTranslation();
  const { setAlert } = useGlobal()

  const getKey = (pageIndex: number, previousPageData: Review[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `products/${product.id}/reviews?page=${pageIndex+1}`;
  };

  const ReviewSchema = Yup.object().shape({
    title: Yup.string().min(1, t('common:tooShort')).max(50, t('common:tooLong')).optional(),
    review: Yup.string().min(2, t('common:tooShort')).optional(),
  });

  const [openModal, setOpenModal] = useState(false);
  const { user } = useUser();
  const { data: userReview } = useSWR(
    user ? `user/products/${product.id}/review` : null,
    fetcher<UserReview>
  );
  const { data: reviews, setSize } = useSWRInfinite(getKey, fetcher<Review[]>);

  const isAr = lang === "ar";

  const handleSubmit = async (values: UserReview) => {
    try {
      const response = await axiosServer.post('user/products/review', values)
      //TODO: Use reusable toast
      if (response.status === 200) {
        setAlert?.({ type: 'success', message: t('experiences:successfulReview')})
      } else {
        setAlert?.({ type: 'warning', message: t('experiences:failedReview')})
      }
    } catch (error) {
        setAlert?.({ type: 'warning', message: t('experiences:failedReview')})
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
        {user && <Button variant="outline-primary" onClick={() => setOpenModal(true)}>{t('addReview')}</Button>}
      </div>
        {reviews ?
<ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
        <Masonry> 
            {reviews.flat().map(r => <SingleReview key={r.userId} review={r} />)}
        </Masonry> 
      <Button onClick={() => setSize((prev) => prev + 1)}>{t('loadMore')}</Button>
      </ResponsiveMasonry>
: <h4>No customer reviews yet 😔</h4>
      }
      {openModal && 
      <Modal show onHide={() => setOpenModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('experiences:userReview', {name: user?.firstname})}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={userReview ?? emptyUserReview}
            onSubmit={handleSubmit}
            validationSchema={ReviewSchema}
          >
            {({ errors, handleChange, values, setValues }) => (
              <FormikForm>
                <Rating
                  initialValue={values.rating}
                  allowFraction
                  size={23}
                  fillColor="var(--orange)"
                  showTooltip
                  rtl={isAr}
                  onClick={(r) => setValues((prev) => ({ ...prev, rating: r }))}
                  tooltipStyle={{ backgroundColor: 'white', color: 'var(--primary)', padding: '0px'}}
                />
                <Form.Group className="mb-4 mt-4">
                  <Form.Label>{t('experiences:reviewTitle')}</Form.Label>
                  <Form.Control
                    name="tilte"
                    value={values.title}
                    type="text"
                    placeholder="Enter short title"
                    onChange={handleChange}
                    isInvalid={errors.title !== undefined}
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
                    isInvalid={errors.rating !== undefined}
                    as="textarea"
                    rows={4}
                  />
                  <Form.Text className="invalid-feedback">
                    {errors.rating}
                  </Form.Text>
                </Form.Group>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpenModal(false)}>
            {t('close')}
          </Button>
          <Button variant="primary" type="submit">
            {t('submit')}
          </Button>
        </Modal.Footer>
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
      <h4>{`${review.firstname} ${review.lastname}`}</h4>
      <Rating
        initialValue={review.rating}
        allowFraction
        size={23}
        fillColor="var(--orange)"
        rtl={lang === "ar"}
        readonly
      />
      <h3>{review.title}</h3>
      <p>{review.review}</p>
      <h6>{`${lastUpdated.getDate()}/${lastUpdated.getMonth()}/${lastUpdated.getFullYear()}`}</h6>
    </div>
  );
};

export default Reviews;
