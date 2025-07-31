'use client'

import { Toaster } from 'react-hot-toast'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ToastProvider() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Toaster position="top-right" />
  }

  const isDark = theme === 'dark' || resolvedTheme === 'dark'

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#374151' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
        },
        success: {
          style: {
            background: isDark ? '#065f46' : '#d1fae5',
            color: isDark ? '#a7f3d0' : '#047857',
            border: `1px solid ${isDark ? '#047857' : '#a7f3d0'}`,
          },
        },
        error: {
          style: {
            background: isDark ? '#7f1d1d' : '#fee2e2',
            color: isDark ? '#fca5a5' : '#dc2626',
            border: `1px solid ${isDark ? '#dc2626' : '#fca5a5'}`,
          },
        },
        loading: {
          style: {
            background: isDark ? '#1e40af' : '#dbeafe',
            color: isDark ? '#93c5fd' : '#1e40af',
            border: `1px solid ${isDark ? '#1e40af' : '#93c5fd'}`,
          },
        },
      }}
      reverseOrder={false}
    />
  )
}