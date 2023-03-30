import React from 'react'
import styles from '../styles/Smartphone.module.css'

const Smartphone = () => {
  return (
    <div className={styles.mobile}>
      <video
        src={'/homeVideo.mp4'}
        controls
        autoPlay
        loop
        className={styles.video}
      />
    </div>
  )
}

export default Smartphone
