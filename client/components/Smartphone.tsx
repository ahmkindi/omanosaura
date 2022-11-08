import React from 'react'
import styles from '../styles/Smartphone.module.css'

const Smartphone = () => {
  return (
    <div className={styles.mobile}>
      <div className={styles.phone}>
        <div className={styles.phoneMirror}>
          <div className={styles.topWrapper}>
            <div className={styles.camera}></div>
            <div className={styles.lineRec}></div>
          </div>
          <video src={'/video.mp4'} autoPlay loop width={312} height={535} />
        </div>
      </div>
    </div>
  )
}

export default Smartphone
