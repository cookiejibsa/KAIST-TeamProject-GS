import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // 앱 시작 시 저장된 토큰으로 세션 복구
  useEffect(() => {
    const token = getToken()
    if (!token) { setAuthLoading(false); return }
    api.get('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setAuthLoading(false))
  }, [])

  const signup = useCallback(async ({ email, password, nickname }) => {
    if (!email || !password || !nickname) return { error: '모든 항목을 입력해 주세요.' }
    if (password.length < 8) return { error: '비밀번호는 8자 이상이어야 해요.' }
    try {
      const { token, user } = await api.post('/auth/signup', {
        email: email.trim().toLowerCase(),
        password,
        nickname: nickname.trim(),
      })
      setToken(token)
      setUser(user)
      return { ok: true }
    } catch (err) {
      return { error: err.message }
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    if (!email || !password) return { error: '이메일과 비밀번호를 입력해 주세요.' }
    try {
      const { token, user } = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      })
      setToken(token)
      setUser(user)
      return { ok: true }
    } catch (err) {
      return { error: err.message }
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, authLoading, signup, login, logout }),
    [user, authLoading, signup, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
