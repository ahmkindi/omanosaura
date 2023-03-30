import React, { CSSProperties, PropsWithChildren } from 'react'
import styles from '../styles/Box.module.css'

const Box = ({ children, style, className }: PropsWithChildren & {style?: CSSProperties, className?: string}) => {
  return <div style={style} className={`${styles.box} ${className}`}>{children}</div>
}

export default Box
