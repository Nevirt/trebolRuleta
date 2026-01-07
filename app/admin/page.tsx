'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  AppBar,
  Toolbar,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material'
import {
  Edit,
  ArrowBack,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { DEFAULT_PRIZES } from '@/lib/roulette/defaultPrizes'

interface Prize {
  id: string
  name: string
  quantityTotal: number
  quantityRemaining: number
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [formData, setFormData] = useState({ quantityTotal: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchPrizes()
  }, [])

  const fetchPrizes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prizes')
      const data = await response.json()
      if (response.ok) {
        // Ordenar premios según el orden predeterminado
        const orderedPrizes = DEFAULT_PRIZES.map(defaultPrize => {
          return data.prizes.find((p: Prize) => 
            p.name.toLowerCase() === defaultPrize.name.toLowerCase()
          )
        }).filter(Boolean) as Prize[]
        
        setPrizes(orderedPrizes)
      } else {
        setError('Error al cargar premios')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (prize: Prize) => {
    setEditingPrize(prize)
    setFormData({
      quantityTotal: prize.quantityTotal.toString(),
    })
    setOpenDialog(true)
    setError(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingPrize(null)
    setFormData({ quantityTotal: '' })
    setError(null)
  }

  const handleSubmit = async () => {
    if (!editingPrize || !formData.quantityTotal || parseInt(formData.quantityTotal) <= 0) {
      setError('La cantidad es requerida y debe ser mayor a 0')
      return
    }

    try {
      setError(null)
      const response = await fetch(`/api/prizes/${editingPrize.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingPrize.name, // El nombre no se puede cambiar
          quantityTotal: parseInt(formData.quantityTotal),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Cantidad actualizada correctamente')
        handleCloseDialog()
        fetchPrizes()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error || 'Error al actualizar cantidad')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const getPrizeType = (prizeName: string) => {
    const defaultPrize = DEFAULT_PRIZES.find(p => 
      p.name.toLowerCase() === prizeName.toLowerCase()
    )
    return defaultPrize?.isPrize ? 'premio' : 'no-premio'
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => router.push('/')}
            sx={{ 
              mr: 2,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            Gestión de Premios
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Premios Predeterminados
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Los premios están predeterminados. Solo puedes modificar la cantidad disponible de cada uno.
          </Typography>
          {prizes.length < DEFAULT_PRIZES.length && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Algunos premios no están inicializados. Ejecuta:{' '}
                <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                  npm run db:init-prizes
                </code>
              </Typography>
            </Alert>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer 
            component={Paper}
            sx={{
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#4CAF50',
                borderRadius: '4px',
              },
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Premio</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }} align="center">
                    Tipo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }} align="right">
                    Cantidad Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }} align="right">
                    Stock Restante
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }} align="center">
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prizes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        No hay premios registrados. Ejecuta: npm run db:init-prizes
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  prizes.map((prize) => {
                    const prizeType = getPrizeType(prize.name)
                    return (
                      <TableRow key={prize.id} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {prize.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={prizeType === 'premio' ? 'Premio' : 'Sin Premio'}
                            color={prizeType === 'premio' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {prizeType === 'no-premio' ? '-' : prize.quantityTotal}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: prize.quantityRemaining === 0 ? 'error.main' : 'success.main',
                            fontWeight: 'bold',
                          }}
                        >
                          {prizeType === 'no-premio' ? '-' : prize.quantityRemaining}
                        </TableCell>
                        <TableCell align="center">
                          {prizeType === 'premio' && (
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(prize)}
                              size="small"
                              title="Editar cantidad"
                            >
                              <Edit />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Footer discreto */}
        <Box
          sx={{
            mt: 6,
            pt: 2,
            pb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              color: 'rgba(0, 0, 0, 0.4)',
              textAlign: 'center',
            }}
          >
            © derechos reservados by Innomia
          </Typography>
        </Box>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar Cantidad - {editingPrize?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Solo puedes modificar la cantidad disponible. El nombre del premio no se puede cambiar.
            </Alert>
            <TextField
              fullWidth
              label="Nombre del Premio"
              value={editingPrize?.name || ''}
              margin="normal"
              disabled
              helperText="El nombre del premio es fijo y no se puede modificar"
            />
            <TextField
              fullWidth
              label="Cantidad Total"
              type="number"
              value={formData.quantityTotal}
              onChange={(e) =>
                setFormData({ ...formData, quantityTotal: e.target.value })
              }
              margin="normal"
              required
              inputProps={{ min: 1 }}
              helperText="Cantidad total disponible de este premio"
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              backgroundColor: '#4CAF50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#45a049',
              }
            }}
          >
            Actualizar Cantidad
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
