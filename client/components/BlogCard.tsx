import { format } from 'date-fns'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from 'react-bootstrap'
import styles from '../styles/BlogCard.module.scss'
import { BlogPreface } from '../types/requests'

const BlogCard = ({ blogPreface }: { blogPreface: BlogPreface }) => {
  const { t, lang } = useTranslation('blog')
  const isAr = lang === 'ar'

  return (
    <article className={`${styles.postcard} ${styles.dark} ${styles.blue}`}>
      <Link
        className={styles.postcardImgLink}
        href={`/blogs/${blogPreface.id}`}
        passHref
      >
        <Image
          className={styles.postcardImg}
          src={blogPreface.photo}
          alt={isAr ? blogPreface.titleAr : blogPreface.title}
          width={300}
          height={300}
        />
      </Link>
      <div className={styles.postcardText}>
        <h1 className={`${styles.postcardTitle} ${styles.blue}`}>
          <Link href={`/blogs/${blogPreface.id}`}>
            {isAr ? blogPreface.titleAr : blogPreface.title}
          </Link>
        </h1>
        <div className={`${styles.postcardSubtitle} ${styles.small}`}>
          {`${blogPreface.firstname} ${blogPreface.lastname} | ${format(
            new Date(blogPreface.createdAt),
            'dd/MM/yyyy'
          )}`}
        </div>
        <div className={styles.postcardBar} />
        <div className={styles.postcardPreviewText}>
          {isAr ? blogPreface.descriptionAr : blogPreface.description}
        </div>
        <ul className={styles.postcardTagbox}>
          <Link href={`/blogs/${blogPreface.id}`} passHref>
            <Button>{t('readMore')}</Button>
          </Link>
        </ul>
      </div>
    </article>
  )
}

export default BlogCard
