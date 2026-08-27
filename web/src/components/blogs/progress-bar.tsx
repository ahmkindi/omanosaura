'use client'

import { motion, useScroll, useSpring } from 'motion/react'

/** Thin reading-progress bar pinned under the navbar on article pages. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      className="bg-secondary fixed inset-x-0 top-16 z-40 h-0.5 origin-left"
      style={{ scaleX }}
    />
  )
}
