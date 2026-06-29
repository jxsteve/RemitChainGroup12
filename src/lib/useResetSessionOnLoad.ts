import { useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useAuth } from './auth'

/**
 * Sign the user out on every full page load (app boot / refresh — i.e. each time
 * the app starts from the splash screen), regardless of any persisted session.
 *
 * This runs once per page load: client-side navigation keeps the user signed in
 * while they use the app, but a hard refresh clears the session so they must
 * re-authenticate and Privy sends a fresh OTP to get back in.
 */
export function useResetSessionOnLoad() {
  const { ready, authenticated, logout: privyLogout } = usePrivy()
  const { logout: mockLogout } = useAuth()
  const done = useRef(false)

  useEffect(() => {
    if (done.current || !ready) return
    done.current = true
    if (authenticated) {
      privyLogout().catch(() => {
        /* ignore */
      })
    }
    mockLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])
}
