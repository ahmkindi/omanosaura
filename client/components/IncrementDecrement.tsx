import React, { useState, useEffect, useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { PurchaseProduct } from '../types/requests'
import { GrAdd, GrSubtract } from 'react-icons/gr'

const IncrementDecrement = ({
  count,
  setCount,
}: {
  count: number
  setCount: React.Dispatch<React.SetStateAction<PurchaseProduct>>
}): JSX.Element => {
  const [isPressing, setIsPressing] = useState<boolean>(false)
  const [intervalDuration, setIntervalDuration] = useState<number>(200)
  const [incrementing, setIncrementing] = useState<boolean>(false)

  const handlePress = (increment: boolean): void => {
    setIsPressing(true)
    setIncrementing(increment)
    setCount((prev) => ({
      ...prev,
      quantity: increment
        ? Math.min(prev.quantity + 1, 500)
        : Math.max(prev.quantity - 1, 1),
    }))
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
          if (count > 1 && count < 500) {
            setIntervalDuration(getIntervalDuration())
          }
          setCount((prev) => {
            if (isPressing) {
              return incrementing
                ? {
                    ...prev,
                    quantity: Math.min(
                      prev.quantity + getIncreaseAmount(),
                      500
                    ),
                  }
                : {
                    ...prev,
                    quantity: Math.max(prev.quantity - getIncreaseAmount(), 1),
                  }
            }
            return prev
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
    setCount,
    intervalDuration,
    incrementing,
    getIntervalDuration,
    getIncreaseAmount,
  ])

  return (
    <div className="flex items-center">
      <Button
        variant="outline-secondary mx-1"
        onPointerDown={() => handlePress(false)}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
      >
        <GrSubtract />
      </Button>
      <h5 className="w-10 text-center">{count}</h5>
      <Button
        variant="outline-secondary mx-1"
        onPointerDown={() => handlePress(true)}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
      >
        <GrAdd />
      </Button>
    </div>
  )
}

export default IncrementDecrement
