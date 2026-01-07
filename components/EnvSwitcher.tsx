'use client'

import { useState, useEffect } from 'react'
import { Box, Switch, FormControlLabel, Typography } from '@mui/material'

export default function EnvSwitcher() {
  const [isProduction, setIsProduction] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkCurrentEnv()
  }, [])

  const checkCurrentEnv = async () => {
    try {
      const response = await fetch('/api/env/check')
      const data = await response.json()
      if (response.ok) {
        setIsProduction(data.environment === 'production')
      }
    } catch (error) {
      console.error('Error verificando entorno:', error)
    }
  }

  const handleToggle = async () => {
    const newEnv = !isProduction ? 'production' : 'development'
    
    try {
      const response = await fetch('/api/env/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environment: newEnv }),
      })

      if (response.ok) {
        setIsProduction(!isProduction)
        // Recargar para aplicar cambios
        setTimeout(() => window.location.reload(), 500)
      } else {
        alert('Error al cambiar entorno')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  // Solo mostrar en desarrollo local
  if (!mounted || process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={isProduction}
            onChange={handleToggle}
            color="success"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {isProduction ? '🟢 PROD' : '🔵 DEV'}
            </Typography>
          </Box>
        }
      />
    </Box>
  )
}
