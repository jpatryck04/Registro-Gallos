'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            border: '1px solid rgba(16, 185, 129, 0.3)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        },
      }}
    />
  )
}