import React, { ReactNode, useState } from 'react'
import styles from '../styles/FlipCard.module.css'

const FlipCard = ({ back, front }: { back: ReactNode; front: ReactNode }) => {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={styles.card}
      onDoubleClick={() => setFlipped((prev) => !prev)}
    >
      <div className={`${styles.cardBack} ${flipped ? styles.flipped : null}`}>
        {back}
      </div>
      <div className={`${styles.cardFront} ${flipped ? styles.flipped : null}`}>
        {front}
      </div>
    </div>
  )
}

export default FlipCard
