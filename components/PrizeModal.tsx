'use client'

import { Modal, Box, Typography, Button } from '@mui/material'
import { Celebration, Refresh, SentimentDissatisfied } from '@mui/icons-material'
import Image from 'next/image'

interface Prize {
  id: string
  name: string
  quantityRemaining: number
}

interface PrizeModalProps {
  open: boolean
  prize: Prize | null
  isPrize: boolean // true = premio real, false = otro intento o suerte la próxima
  onClose: () => void
}

export default function PrizeModal({ open, prize, isPrize, onClose }: PrizeModalProps) {
  const prizeName = prize?.name || ''
  const isAnotherTry = prizeName.toLowerCase().includes('otro intento')
  const isBetterLuck = prizeName.toLowerCase().includes('suerte la próxima') || prizeName.toLowerCase().includes('suerte la proxima')

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: { xs: '25px', sm: '40px' },
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        {isPrize ? (
          <>
            {/* Logo de Trébol en el centro con animación */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: '90px', sm: '120px' },
                height: { xs: '90px', sm: '120px' },
                margin: '0 auto 15px',
                animation: 'logo-entrance 0.8s ease-out',
                '@keyframes logo-entrance': {
                  '0%': { 
                    transform: 'scale(0) rotate(-180deg)',
                    opacity: 0,
                  },
                  '60%': { 
                    transform: 'scale(1.1) rotate(10deg)',
                    opacity: 1,
                  },
                  '100%': { 
                    transform: 'scale(1) rotate(0deg)',
                    opacity: 1,
                  },
                },
              }}
            >
              <Image
                src="/images/roulette/center-logo.png"
                alt="Helados Trébol"
                width={120}
                height={120}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(76, 175, 80, 0.3))',
                }}
                priority
              />
            </Box>
            
            {/* Ícono de celebración más pequeño */}
            <Celebration
              sx={{
                fontSize: { xs: '45px', sm: '60px' },
                color: '#FFD700',
                marginBottom: '15px',
                animation: 'bounce 0.6s ease-in-out 0.3s',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-15px)' },
                },
              }}
            />
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                animation: 'fade-in 0.5s ease-in 0.4s both',
                '@keyframes fade-in': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              ¡Ganaste!
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: '#4CAF50',
                marginBottom: '30px',
                fontWeight: '600',
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                animation: 'fade-in 0.5s ease-in 0.5s both',
                '@keyframes fade-in': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {prizeName}
            </Typography>
          </>
        ) : isAnotherTry ? (
          <>
            {/* Logo de Trébol más pequeño */}
            <Box
              sx={{
                position: 'relative',
                width: '80px',
                height: '80px',
                margin: '0 auto 10px',
                opacity: 0.9,
                animation: 'logo-fade-in 0.6s ease-out',
                '@keyframes logo-fade-in': {
                  '0%': { 
                    opacity: 0,
                    transform: 'scale(0.8)',
                  },
                  '100%': { 
                    opacity: 0.9,
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              <Image
                src="/images/roulette/center-logo.png"
                alt="Helados Trébol"
                width={80}
                height={80}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(255, 152, 0, 0.2))',
                }}
                priority
              />
            </Box>
            
            <Refresh
              sx={{
                fontSize: '60px',
                color: '#FF9800',
                marginBottom: '15px',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333',
              }}
            >
              ¡Otra oportunidad!
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: '#FF9800',
                marginBottom: '30px',
                fontWeight: '600',
              }}
            >
              {prizeName}
            </Typography>
          </>
        ) : (
          <>
            {/* Logo de Trébol más pequeño */}
            <Box
              sx={{
                position: 'relative',
                width: '80px',
                height: '80px',
                margin: '0 auto 10px',
                opacity: 0.7,
                animation: 'logo-fade-in 0.6s ease-out',
                '@keyframes logo-fade-in': {
                  '0%': { 
                    opacity: 0,
                    transform: 'scale(0.8)',
                  },
                  '100%': { 
                    opacity: 0.7,
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              <Image
                src="/images/roulette/center-logo.png"
                alt="Helados Trébol"
                width={80}
                height={80}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'grayscale(50%) drop-shadow(0 2px 8px rgba(158, 158, 158, 0.2))',
                }}
                priority
              />
            </Box>
            
            <SentimentDissatisfied
              sx={{
                fontSize: '60px',
                color: '#9E9E9E',
                marginBottom: '15px',
              }}
            />
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333',
              }}
            >
              {prizeName}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#757575',
                marginBottom: '30px',
              }}
            >
              No te desanimes, ¡sigue intentando!
            </Typography>
          </>
        )}
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: isPrize ? '#4CAF50' : isAnotherTry ? '#FF9800' : '#9E9E9E',
            color: '#fff',
            padding: '12px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: isPrize ? '#45a049' : isAnotherTry ? '#F57C00' : '#757575',
            },
          }}
        >
          Aceptar
        </Button>
      </Box>
    </Modal>
  )
}
