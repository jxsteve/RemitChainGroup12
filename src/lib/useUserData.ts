import { useCallback, useEffect, useState } from 'react'
import { useUserIdentity } from './useUserIdentity'
import { loadUserData, patchUserData, saveUserData, type UserData } from './userStore'

/**
 * React access to the current user's saved record, keyed by the canonical
 * `userId` from useUserIdentity. Re-loads automatically when the identity
 * changes (e.g. after a Privy login replaces the mock session).
 */
export function useUserData() {
  const { userId } = useUserIdentity()
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    if (!userId) {
      setData(null)
      setLoading(false)
      return
    }
    loadUserData(userId).then((d) => {
      if (active) {
        setData(d)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [userId])

  /** Overwrite the whole record. */
  const save = useCallback(
    async (next: UserData) => {
      if (!userId) return
      await saveUserData(userId, next)
      setData(next)
    },
    [userId],
  )

  /** Shallow-merge a partial update. */
  const patch = useCallback(
    async (partial: UserData) => {
      if (!userId) return null
      const next = await patchUserData(userId, partial)
      setData(next)
      return next
    },
    [userId],
  )

  return { userId, data, loading, save, patch }
}
