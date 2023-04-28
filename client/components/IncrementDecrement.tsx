import React, { useState, useEffect, useCallback } from 'react'

const IncrementDecrement: React.FC = () => {
  const [count, setCount] = useState<number>(0)
  const [isPressing, setIsPressing] = useState<boolean>(false)
  const [intervalDuration, setIntervalDuration] = useState<number>(200)
  const [incrementing, setIncrementing] = useState<boolean>(false)

  const handlePress = (increment: boolean): void => {
    setIsPressing(true)
    setIncrementing(increment)
    if (increment) {
      setCount((prevCount) => Math.min(prevCount + 1, 500))
    } else {
      setCount((prevCount) => Math.max(prevCount - 1, 0))
    }
  }

  const handleRelease = (): void => {
    setIsPressing(false)
    setIntervalDuration(200)
  }

  const getIntervalDuration = useCallback((): number => {
    let newIntervalDuration = intervalDuration
    if (isPressing) {
      newIntervalDuration = Math.max(50, newIntervalDuration - count / 5)
    }
    return newIntervalDuration
  }, [count, intervalDuration, isPressing])

  const getIncreaseAmount = useCallback((): number => {
    if (intervalDuration > 100) {
      return 1
    }
    return 5
  }, [intervalDuration])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isPressing) {
      intervalId = setInterval(() => {
        if (isPressing) {
          if (count > 0 && count < 500) {
            setIntervalDuration(getIntervalDuration())
          }
          setCount((prevCount) => {
            if (isPressing) {
              return incrementing
                ? Math.min(prevCount + getIncreaseAmount(), 500)
                : Math.max(prevCount - getIncreaseAmount(), 0)
            }
            return prevCount
          })
        }
      }, intervalDuration)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [
    isPressing,
    count,
    intervalDuration,
    incrementing,
    getIntervalDuration,
    getIncreaseAmount,
  ])

  return (
    <div>
      <button
        onMouseDown={() => handlePress(true)}
        onMouseUp={handleRelease}
        onTouchStart={() => handlePress(true)}
        onTouchEnd={handleRelease}
        onTouchCancel={handleRelease}
      >
        +
      </button>
      <div>{count}</div>
      <button
        onMouseDown={() => handlePress(false)}
        onMouseUp={handleRelease}
        onTouchStart={() => handlePress(false)}
        onTouchEnd={handleRelease}
        onTouchCancel={handleRelease}
      >
        -
      </button>
    </div>
  )
}

export default IncrementDecrement
