import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePersistentState, todayStr, uid } from '../lib/storage'
import { getMenuById } from '../data/menus'
import { useAuth } from './AuthContext'
import { api } from '../lib/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user, authLoading } = useAuth()

  const [eatLogs, setEatLogs] = useState([])
  const [videoViews, setVideoViews] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  // lastInputs는 UI 상태라 여전히 localStorage 유지
  const [lastInputs, setLastInputs] = usePersistentState('lastInputs', {
    mood: null,
    weather: null,
    budget: 'mid',
  })

  // 로그인/로그아웃 시 서버에서 데이터 로드
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setEatLogs([])
      setVideoViews([])
      return
    }
    setRecordsLoading(true)
    Promise.all([
      api.get('/records').then(({ records }) => setEatLogs(records)),
      api.get('/videos').then(({ videos }) => setVideoViews(videos)),
    ])
      .catch(console.error)
      .finally(() => setRecordsLoading(false))
  }, [user?.id, authLoading])

  const addEatLog = useCallback(
    async (menu, { date, price, rating = 0, mode = 'manual', mood, weather, budget, aiReason } = {}) => {
      if (!user) return null
      try {
        const { record } = await api.post('/records', {
          menuId: menu.id,
          name: menu.name,
          emoji: menu.emoji,
          category: menu.category,
          date: date || todayStr(),
          price: price ?? menu.avgPrice,
          rating,
          mode,
          mood: mood || null,
          weather: weather || null,
          budget: budget || null,
          aiReason: aiReason || null,
        })
        setEatLogs((prev) => [record, ...prev])
        return record
      } catch (err) {
        console.error('기록 저장 실패:', err)
        return null
      }
    },
    [user]
  )

  const removeEatLog = useCallback(
    async (id) => {
      if (!user) return
      try {
        await api.delete(`/records/${id}`)
        setEatLogs((prev) => prev.filter((l) => l.id !== id))
      } catch (err) {
        console.error('기록 삭제 실패:', err)
      }
    },
    [user]
  )

  const updateRating = useCallback(
    async (id, rating) => {
      if (!user) return
      try {
        await api.patch(`/records/${id}/rating`, { rating })
        setEatLogs((prev) => prev.map((l) => (l.id === id ? { ...l, rating } : l)))
      } catch (err) {
        console.error('별점 수정 실패:', err)
      }
    },
    [user]
  )

  const addVideoView = useCallback(
    async ({ menuId, menuName, keyword, mode, mood, weather }) => {
      if (!user || !keyword) return
      try {
        await api.post('/videos', { menuId, menuName, keyword, mode, mood, weather })
        setVideoViews((prev) => [
          {
            id: uid(),
            menuId, menuName, keyword, mode, mood, weather,
            viewedAt: new Date().toISOString(),
          },
          ...prev,
        ])
      } catch (err) {
        console.error('영상 기록 저장 실패:', err)
      }
    },
    [user]
  )

  const value = useMemo(
    () => ({
      eatLogs,
      videoViews,
      recordsLoading,
      addEatLog,
      removeEatLog,
      updateRating,
      addVideoView,
      lastInputs,
      setLastInputs,
      getMenuById,
    }),
    [eatLogs, videoViews, recordsLoading, addEatLog, removeEatLog, updateRating, addVideoView, lastInputs, setLastInputs]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
