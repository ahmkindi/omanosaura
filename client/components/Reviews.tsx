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
import Masonry from "react-grid-masonry";

const Reviews = ({ product }: { product: Product }) => {
  const { t, lang } = useTranslation();
  const getKey = (pageIndex: number, previousPageData: Review[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `product/${product.id}/reviews?page=${pageIndex}`;
  };

  const ReviewSchema = Yup.object().shape({
    title: Yup.string().min(1, t('common:tooShort')).max(50, t('common:tooLong')).optional(),
    review: Yup.string().min(2, t('common:tooShort')).optional(),
  });

  const [openModal, setOpenModal] = useState(false);
  const { user } = useUser();
  const { data: userReview } = useSWR(
    user ? `user/product/${product.id}/review` : null,
    fetcher<UserReview>
  );
  const { data: reviews, setSize } = useSWRInfinite(getKey, fetcher<Review[]>);

  const isAr = lang === "ar";

  const handleSubmit = async (values: UserReview) => {
    try {
      const response = await axiosServer.post('user/products/review', values)
      //TODO: Use reusable toast
      if (response.status === 200) {
        setAlertText(successEmail)
      } else {
        setAlertText(failedEmail)
      }
    } catch (error) {
      setAlertText(failedEmail)
    } finally {
      setLoading(false)
      setFormOpen(false)
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h3>{t('reviews')}</h3>
        <Rating
          initialValue={product.rating}
          allowFraction
          size={23}
          fillColor="var(--orange)"
          readonly
          rtl={isAr}
        />
        {user && <Button onClick={() => setOpenModal(true)}>{t('addReview')}</Button>}
      </div>
      <div className={styles.reviews}>
        <Masonry
          comp={SingleReview}
          uid="uuid"
          item={reviews}
          columnWidth={300}
          gutter={15}
          minCols={1}
        />
      </div>
      <Button onClick={() => setSize((prev) => prev + 1)}>{t('loadMore')}</Button>
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
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
              <FormikForm style={{ maxWidth: "50%", margin: "auto" }}>
                <Rating
                  initialValue={values.rating}
                  allowFraction
                  size={23}
                  fillColor="var(--orange)"
                  showTooltip
                  rtl={isAr}
                  onClick={(r) => setValues((prev) => ({ ...prev, rating: r }))}
                />
                <Form.Group className="mb-4">
                  <Form.Label>{t('reviewTitle')}</Form.Label>
                  <Form.Control
                    name="email"
                    value={values.title}
                    type="email"
                    placeholder="Enter email"
                    onChange={handleChange}
                    isInvalid={errors.title !== undefined}
                  />
                  <Form.Text className="invalid-feedback">
                    {errors.title}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{t('reviewDesc')}</Form.Label>
                  <Form.Control
                    name="firstname"
                    value={values.rating}
                    onChange={handleChange}
                    type="text"
                    isInvalid={errors.rating !== undefined}
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
    </div>
  );
};

const SingleReview = ({ review }: { review: Review }) => {
  const { lang } = useTranslation();

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
      <h6>{`${review.lastUpdated.getDate()}/${review.lastUpdated.getMonth()}/${review.lastUpdated.getFullYear()}`}</h6>
    </div>
  );
};

export default Reviews;
