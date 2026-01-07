'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Chip,
} from '@mui/material'
import { Settings } from '@mui/icons-material'

export default function EnvSwitcher() {
  const [open, setOpen] = useState(false)
  const [currentEnv, setCurrentEnv] = useState<string>('unknown')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  const checkCurrentEnv = async () => {
    try {
      const response = await fetch('/api/env/check')
      const data = await response.json()
      if (response.ok) {
        setCurrentEnv(data.environment)
      }
    } catch (error) {
      console.error('Error verificando entorno:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    checkCurrentEnv()
  }, [])

  const switchEnv = async (environment: 'development' | 'production') => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/env/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environment }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setCurrentEnv(environment)
        setTimeout(() => {
          setMessage(null)
          setOpen(false)
          // Recargar página para aplicar cambios
          window.location.reload()
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cambiar entorno' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  const getEnvLabel = (env: string) => {
    switch (env) {
      case 'development':
        return 'DESARROLLO'
      case 'production':
        return 'PRODUCCIÓN'
      default:
        return 'DESCONOCIDO'
    }
  }

  const getEnvColor = (env: string) => {
    switch (env) {
      case 'development':
        return 'info'
      case 'production':
        return 'success'
      default:
        return 'default'
    }
  }

  // No renderizar hasta que esté montado
  if (!mounted) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          minWidth: 'auto',
          padding: '8px',
        }}
      >
        <Settings />
        <Chip
          label={getEnvLabel(currentEnv)}
          color={getEnvColor(currentEnv)}
          size="small"
          sx={{ ml: 1, height: '24px' }}
        />
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Entorno de Base de Datos</DialogTitle>
        <DialogContent>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Selecciona el entorno de base de datos que deseas usar. Los cambios requieren reiniciar el servidor.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant={currentEnv === 'development' ? 'contained' : 'outlined'}
              color="info"
              onClick={() => switchEnv('development')}
              disabled={loading || currentEnv === 'development'}
              fullWidth
              sx={{ py: 1.5 }}
            >
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="h6">Desarrollo</Typography>
                <Typography variant="caption" color="textSecondary">
                  ep-dry-resonance-ac3splmm-pooler
                </Typography>
              </Box>
            </Button>

            <Button
              variant={currentEnv === 'production' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => switchEnv('production')}
              disabled={loading || currentEnv === 'production'}
              fullWidth
              sx={{ py: 1.5 }}
            >
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography variant="h6">Producción</Typography>
                <Typography variant="caption" color="textSecondary">
                  ep-gentle-cell-ac7k8ivc-pooler
                </Typography>
              </Box>
            </Button>
          </Box>

          <Alert severity="warning" sx={{ mt: 3 }}>
            ⚠️ El cambio de entorno requiere reiniciar el servidor de desarrollo.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
