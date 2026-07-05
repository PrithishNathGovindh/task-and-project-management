import { useCallback, useEffect, useMemo, useState } from 'react'

import { AuthContext } from './auth'
import { getApiErrorMessage } from '../services/api'
import { authService } from '../services/authService'

const TOKEN_KEY = 'taskflow-token'
const USER_KEY = 'taskflow-user'

function getStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(getStoredUser)
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))
  const [sessionMessage, setSessionMessage] = useState('')

  const clearAuth = useCallback((message = '') => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setSessionMessage(message)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function validateSession() {
      if (!token) {
        setIsCheckingAuth(false)
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()

        if (!isMounted) {
          return
        }

        localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
        setUser(currentUser)
      } catch {
        if (isMounted) {
          clearAuth('Session Expired')
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    validateSession()

    return () => {
      isMounted = false
    }
  }, [clearAuth, token])

  async function register(payload) {
    try {
      await authService.register(payload)
      return { success: true }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }

  async function login(payload) {
    try {
      const response = await authService.login(payload)

      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      setToken(response.token)
      setUser(response.user)

      return { success: true }
    } catch (error) {
      return { success: false, message: getApiErrorMessage(error) }
    }
  }

  const logout = useCallback(() => {
    clearAuth('')
  }, [clearAuth])

  const consumeSessionMessage = useCallback(() => {
    setSessionMessage('')
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isCheckingAuth,
      sessionMessage,
      consumeSessionMessage,
      register,
      login,
      logout,
    }),
    [consumeSessionMessage, isCheckingAuth, logout, sessionMessage, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
