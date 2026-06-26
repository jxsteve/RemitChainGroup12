import { useEffect, useState } from 'react'

/** Counts down from `start` seconds to 0. `restart()` resets it. */
export function useCountdown(start: number) {
  const [seconds, setSeconds] = useState(start)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const restart = () => setSeconds(start)

  return { seconds, restart }
}
