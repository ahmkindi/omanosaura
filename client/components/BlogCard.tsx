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
    <div className={styles.card}>
      <Image
        src={blogPreface.photo}
        width={300}
        height={400}
        alt={blogPreface.title}
      />
      <h1>{isAr ? blogPreface.titleAr : blogPreface.title}</h1>
      <h4>{format(new Date(blogPreface.createdAt), 'dd/MM/YYYY')}</h4>
      <p>
        {blogPreface.firstname} {blogPreface.lastname}
      </p>
      <Link href={blogPreface.id} passHref>
        <Button>{t('readMore')}</Button>
      </Link>
    </div>
  )
}

export default BlogCard
