import React, { ReactNode } from 'react'
import styles from '../styles/Section.module.css'

interface SectionProps {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <div className={styles.section}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

export default Section
