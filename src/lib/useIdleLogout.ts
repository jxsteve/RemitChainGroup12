import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
import { useAuth } from './auth'

/**
 * Auto sign-out after a period of inactivity.
 *
 * Privy keeps users signed in indefinitely once a session exists, so a returning
 * user is logged straight in without a fresh OTP. For a money app we want the
 * session to expire: after `VITE_SESSION_TIMEOUT_MIN` minutes of no interaction
 * (default 2) we sign the user out — so next time they must re-authenticate and
 * Privy sends a new one-time code. Any activity resets the timer.
 *
 * (Tapping "Log out" in Profile still ends the session immediately.)
 */
const TIMEOUT_MIN = Number(import.meta.env.VITE_SESSION_TIMEOUT_MIN) || 2
const TIMEOUT_MS = Math.max(1, TIMEOUT_MIN) * 60_000
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'pointerdown', 'scroll'] as const

export function useIdleLogout() {
  const navigate = useNavigate()
  const { authenticated, logout: privyLogout } = usePrivy()
  const { user, logout: mockLogout } = useAuth()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const signedIn = authenticated || Boolean(user)

  useEffect(() => {
    if (!signedIn) return

    const signOut = async () => {
      try {
        await privyLogout()
      } catch {
        /* ignore */
      }
      try {
        mockLogout()
      } catch {
        /* ignore */
      }
      navigate('/login', { replace: true })
    }

    const reset = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(signOut, TIMEOUT_MS)
    }

    reset()
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    return () => {
      if (timer.current) clearTimeout(timer.current)
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn])
}
