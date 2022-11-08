import React, { PropsWithChildren } from 'react'
import styles from '../styles/Box.module.css'

const Box = ({ children }: PropsWithChildren) => {
  return <div className={styles.box}>{children}</div>
}

export default Box
