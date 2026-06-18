// 브라우저에 남겨도 되는 UI 상태만 localStorage에 저장
import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'honbap:'

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* 저장 실패는 무시 (용량 초과 등) */
  }
}

// 상태 + localStorage 동기화 훅
export function usePersistentState(key, initial) {
  const [state, setState] = useState(() => loadJSON(key, initial))

  useEffect(() => {
    saveJSON(key, state)
  }, [key, state])

  const reset = useCallback(() => setState(initial), [initial])

  return [state, setState, reset]
}

// 오늘 날짜 YYYY-MM-DD (로컬 타임존)
export function todayStr(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().slice(0, 10)
}

export function uid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
