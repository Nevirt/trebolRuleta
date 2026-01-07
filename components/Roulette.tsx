'use client'

import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import Image from 'next/image'
import PrizeModal from './PrizeModal'
import { DEFAULT_PRIZES, getDefaultPrizeConfig } from '@/lib/roulette/defaultPrizes'

interface Prize {
  id: string
  name: string
  quantityRemaining: number
}

interface RouletteProps {
  onSpinComplete?: (prize: Prize) => void
}

export default function Roulette({ onSpinComplete }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonPrize, setWonPrize] = useState<Prize | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loadingPrizes, setLoadingPrizes] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es mobile para optimizar animaciones
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cargar premios disponibles (deben estar en el orden correcto)
  useEffect(() => {
    setMounted(true)
    const fetchPrizes = async () => {
      try {
        const response = await fetch('/api/prizes')
        const data = await response.json()
        if (response.ok) {
          // Ordenar premios según el orden predeterminado de la ruleta
          const orderedPrizes = DEFAULT_PRIZES.map(defaultPrize => {
            return data.prizes.find((p: Prize) => 
              p.name.toLowerCase() === defaultPrize.name.toLowerCase()
            )
          }).filter(Boolean) as Prize[]
          
          setPrizes(orderedPrizes)
        }
      } catch (error) {
        console.error('Error cargando premios:', error)
      } finally {
        setLoadingPrizes(false)
      }
    }
    fetchPrizes()
  }, [])

  const sections = 6 // Siempre 6 segmentos fijos
  const sectionAngle = 360 / sections

  // Mapeo del nombre del premio a su posición visual en la ruleta
  // Este orden corresponde al orden visual real en la ruleta SVG cuando rotation = 0
  // El orden es en sentido horario desde la parte superior izquierda
  const PRIZE_VISUAL_POSITION: Record<string, number> = {
    'tenés otro intento': 0,
    'tenes otro intento': 0,
    'cucharita + stickers': 1,
    'cucharita stickers': 1,
    'un sombrerito': 2,
    'suerte la próxima': 3,
    'suerte la proxima': 3,
    'un llavero': 4,
    'una toallita': 5,
  }

  const handleSpin = async () => {
    if (isSpinning || prizes.length === 0) return

    setIsSpinning(true)

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || 'Error al girar la ruleta'
        alert(errorMessage)
        setIsSpinning(false)
        return
      }

      const prize = data.prize

      // Obtener la posición visual del premio ganado basado en su nombre
      const prizeNameLower = prize.name.toLowerCase().trim()
      const visualPosition = PRIZE_VISUAL_POSITION[prizeNameLower]
      
      if (visualPosition === undefined) {
        // Si no encontramos el premio en el mapeo, usar rotación completamente aleatoria
        const baseRotations = 5 + Math.random() * 3 // Entre 5 y 8 vueltas completas
        const extraRotation = Math.random() * 360
        const totalRotation = baseRotations * 360 + extraRotation
        animateRotation(totalRotation)
        return
      }

      // Calcular rotación para que el premio ganado quede centrado en la parte superior
      // Cuando rotation = 0, el primer premio "Tenés otro intento" está directamente arriba
      // El centro de cada segmento cuando rotation = 0:
      // segmento 0: 0° (ya está arriba)
      // segmento 1: 60° → necesita rotar -60° para llegar a 0°
      // segmento 2: 120° → necesita rotar -120° para llegar a 0°
      // segmento 3: 180° → necesita rotar -180° para llegar a 0°
      // segmento 4: 240° → necesita rotar -240° para llegar a 0°
      // segmento 5: 300° → necesita rotar -300° para llegar a 0°
      //
      // Fórmula: el centro del segmento está en: visualPosition * sectionAngle
      // Para llevarlo a 0° (parte superior), rotamos: -visualPosition * sectionAngle
      const targetAngle = -visualPosition * sectionAngle
      
      // Agregar múltiplos de 360 para efecto visual (entre 5 y 8 vueltas completas)
      // Esto mantiene la variabilidad visual pero siempre termina con el premio arriba
      const baseRotations = 5 + Math.random() * 3
      const totalRotation = baseRotations * 360 + targetAngle

      animateRotation(totalRotation, prize)
    } catch (error) {
      console.error('Error al girar:', error)
      alert('Error al conectar con el servidor')
      setIsSpinning(false)
    }
  }

  const animateRotation = (totalRotation: number, prize?: Prize) => {
    const duration = isMobile ? 2500 : 3000 // Más rápido en mobile para mejor performance
    const startTime = Date.now()
    const startRotation = rotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Función ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)

      // Pequeño rebote al final
      const bounce = progress > 0.9 ? Math.sin((progress - 0.9) * 10 * Math.PI) * 5 : 0

      const currentRotation = startRotation + totalRotation * easeOut + bounce
      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        if (prize) {
          setWonPrize(prize)
          setShowModal(true)
          if (onSpinComplete) {
            onSpinComplete(prize)
          }
        }
      }
    }

    animate()
  }

  // No renderizar nada hasta que esté montado en el cliente
  if (!mounted) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fffac6', // Color crema/amarillo claro
        }}
      >
        {/* Contenedor de la ruleta */}
        <Box
          sx={{
            width: {
              xs: 'min(90vw, 400px)',  // Mobile: más pequeño
              sm: 'min(80vw, 500px)',  // Tablet
              md: 'min(70vw, 600px)',  // Desktop pequeño
              lg: 'min(85vw, 700px)',  // Desktop grande
            },
            height: {
              xs: 'min(90vw, 400px)',
              sm: 'min(80vw, 500px)',
              md: 'min(70vw, 600px)',
              lg: 'min(85vw, 700px)',
            },
            maxWidth: '700px',
            maxHeight: '700px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1, // Por encima del fondo
          }}
        >
          {/* Ruleta SVG completa - ROTA */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${rotation}deg)`,
              willChange: 'transform',
              transition: isSpinning ? 'none' : 'transform 0.1s linear',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/images/roulette/wheel-complete.png"
              alt="Ruleta Helados Trébol"
              width={700}
              height={700}
              priority
              quality={isMobile ? 85 : 95}
              onError={(e) => {
                // Fallback si el PNG no carga
                const target = e.target as HTMLImageElement
                target.src = '/images/roulette/skeleton/wheel-skeleton.svg'
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />
          </Box>

          {/* Efectos visuales según el tipo de resultado */}
          {!isSpinning && wonPrize && (() => {
            const prizeConfig = getDefaultPrizeConfig(wonPrize.name)
            const isRealPrize = prizeConfig?.isPrize ?? false
            const isAnotherTry = wonPrize.name.toLowerCase().includes('otro intento')
            const isBetterLuck = wonPrize.name.toLowerCase().includes('suerte la próxima') || wonPrize.name.toLowerCase().includes('suerte la proxima')
            
            return (
              <>
                {/* ⭐ EXPLOSIÓN DE CONFETI ESPECTACULAR PARA PREMIOS REALES ⭐ */}
                {isRealPrize && (
                  <>
                    {/* 🎊 CONFETI EXPLOSIÓN DESDE LA IZQUIERDA - Optimizado para mobile */}
                    {[...Array(isMobile ? 12 : 25)].map((_, i) => {
                      const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF1744', '#00E676', '#FFC107', '#E91E63', '#9C27B0', '#FF9800']
                      const color = colors[i % colors.length]
                      const delay = i * 0.02 // Explosión más rápida y continua
                      
                      // Posición vertical aleatoria pero concentrada en el centro
                      const startY = 30 + (i % 10) * 4
                      
                      // Trayectoria en arco con física realista
                      const horizontalDistance = 120 + (i % 8) * 15 // Vuela hasta el 120-225% del ancho
                      const verticalPeak = -100 - (i % 6) * 30 // Sube primero (arco)
                      const verticalFall = 150 + (i % 7) * 40 // Luego cae con gravedad
                      const rotation = 720 + (i % 5) * 360 // Rotaciones variadas
                      
                      // Diferentes formas para más variedad
                      const shapes = ['50%', '0%', '30%', '20%']
                      const borderRadius = shapes[i % shapes.length]
                      
                      // Tamaños variados
                      const size = i % 4 === 0 ? 16 : i % 4 === 1 ? 12 : i % 4 === 2 ? 10 : 14
                      
                      return (
                        <Box
                          key={`confetti-explosion-left-${i}`}
                          sx={{
                            position: 'absolute',
                            top: `${startY}%`,
                            left: '-20px',
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: borderRadius,
                            backgroundColor: color,
                            zIndex: 5,
                            pointerEvents: 'none',
                            animation: `confetti-explode-left-${i % 10} 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`,
                            [`@keyframes confetti-explode-left-${i % 10}`]: {
                              '0%': {
                                transform: 'translate(0, 0) rotate(0deg) scale(0)',
                                opacity: 0,
                              },
                              '10%': {
                                transform: 'translate(0, 0) rotate(0deg) scale(1.2)',
                                opacity: 1,
                              },
                              '30%': {
                                // Punto máximo del arco (sube y avanza)
                                transform: `translate(${horizontalDistance * 0.4}vw, ${verticalPeak}px) rotate(${rotation * 0.3}deg) scale(1)`,
                                opacity: 1,
                              },
                              '60%': {
                                // Comienza a caer
                                transform: `translate(${horizontalDistance * 0.7}vw, ${verticalPeak * 0.3}px) rotate(${rotation * 0.7}deg) scale(1)`,
                                opacity: 1,
                              },
                              '100%': {
                                // Cae fuera de la pantalla
                                transform: `translate(${horizontalDistance}vw, ${verticalFall}vh) rotate(${rotation}deg) scale(0.3)`,
                                opacity: 0,
                              },
                            },
                          }}
                        />
                      )
                    })}
                    
                    {/* 🎊 CONFETI EXPLOSIÓN DESDE LA DERECHA - Optimizado para mobile */}
                    {[...Array(isMobile ? 12 : 25)].map((_, i) => {
                      const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF1744', '#00E676', '#FFC107', '#E91E63', '#9C27B0', '#FF9800']
                      const color = colors[i % colors.length]
                      const delay = i * 0.02
                      
                      const startY = 30 + (i % 10) * 4
                      const horizontalDistance = -(120 + (i % 8) * 15)
                      const verticalPeak = -100 - (i % 6) * 30
                      const verticalFall = 150 + (i % 7) * 40
                      const rotation = -(720 + (i % 5) * 360)
                      
                      const shapes = ['50%', '0%', '30%', '20%']
                      const borderRadius = shapes[i % shapes.length]
                      const size = i % 4 === 0 ? 16 : i % 4 === 1 ? 12 : i % 4 === 2 ? 10 : 14
                      
                      return (
                        <Box
                          key={`confetti-explosion-right-${i}`}
                          sx={{
                            position: 'absolute',
                            top: `${startY}%`,
                            right: '-20px',
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: borderRadius,
                            backgroundColor: color,
                            zIndex: 5,
                            pointerEvents: 'none',
                            animation: `confetti-explode-right-${i % 10} 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`,
                            [`@keyframes confetti-explode-right-${i % 10}`]: {
                              '0%': {
                                transform: 'translate(0, 0) rotate(0deg) scale(0)',
                                opacity: 0,
                              },
                              '10%': {
                                transform: 'translate(0, 0) rotate(0deg) scale(1.2)',
                                opacity: 1,
                              },
                              '30%': {
                                transform: `translate(${horizontalDistance * 0.4}vw, ${verticalPeak}px) rotate(${rotation * 0.3}deg) scale(1)`,
                                opacity: 1,
                              },
                              '60%': {
                                transform: `translate(${horizontalDistance * 0.7}vw, ${verticalPeak * 0.3}px) rotate(${rotation * 0.7}deg) scale(1)`,
                                opacity: 1,
                              },
                              '100%': {
                                transform: `translate(${horizontalDistance}vw, ${verticalFall}vh) rotate(${rotation}deg) scale(0.3)`,
                                opacity: 0,
                              },
                            },
                          }}
                        />
                      )
                    })}
                    
                    {/* ⭐ ESTRELLAS BRILLANTES QUE EMERGEN Y FLOTAN */}
                    {[...Array(isMobile ? 4 : 8)].map((_, i) => {
                      const angle = (i * 360) / 8 // Distribuir en círculo
                      const distance = 180 + (i % 3) * 40
                      const delay = 0.3 + i * 0.05
                      
                      return (
                        <Box
                          key={`star-${i}`}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '20px',
                            height: '20px',
                            zIndex: 6,
                            pointerEvents: 'none',
                            animation: `star-burst-${i} 2s ease-out ${delay}s forwards`,
                            '&::before': {
                              content: '"⭐"',
                              fontSize: '20px',
                              display: 'block',
                            },
                            [`@keyframes star-burst-${i}`]: {
                              '0%': {
                                transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                                opacity: 0,
                              },
                              '20%': {
                                transform: 'translate(-50%, -50%) scale(1.5) rotate(180deg)',
                                opacity: 1,
                              },
                              '100%': {
                                transform: `translate(calc(-50% + ${Math.cos((angle * Math.PI) / 180) * distance}px), calc(-50% + ${Math.sin((angle * Math.PI) / 180) * distance}px)) scale(0.5) rotate(720deg)`,
                                opacity: 0,
                              },
                            },
                          }}
                        />
                      )
                    })}
                    
                    {/* 💫 ONDA DE CHOQUE EXPANSIVA */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '4px solid rgba(76, 175, 80, 0.8)',
                        zIndex: 4,
                        pointerEvents: 'none',
                        animation: 'shockwave 1s ease-out forwards',
                        '@keyframes shockwave': {
                          '0%': {
                            transform: 'translate(-50%, -50%) scale(0.8)',
                            opacity: 1,
                          },
                          '100%': {
                            transform: 'translate(-50%, -50%) scale(2.5)',
                            opacity: 0,
                          },
                        },
                      }}
                    />
                    
                    {/* ✨ RESPLANDOR PULSANTE DORADO */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '110%',
                        height: '110%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, rgba(76, 175, 80, 0.3) 40%, transparent 70%)',
                        zIndex: 1,
                        pointerEvents: 'none',
                        animation: 'victory-glow 1.5s ease-in-out infinite',
                        '@keyframes victory-glow': {
                          '0%, 100%': {
                            opacity: 0.6,
                            transform: 'translate(-50%, -50%) scale(1)',
                          },
                          '50%': {
                            opacity: 1,
                            transform: 'translate(-50%, -50%) scale(1.1)',
                          },
                        },
                      }}
                    />
                  </>
                )}
                
                {/* Efecto naranja para "Tenés otro intento" */}
                {isAnotherTry && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '110%',
                      height: '110%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0.1) 50%, transparent 80%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      animation: 'another-try-glow 2s ease-in-out infinite',
                      '@keyframes another-try-glow': {
                        '0%, 100%': {
                          opacity: 0.3,
                          transform: 'translate(-50%, -50%) scale(1)',
                        },
                        '50%': {
                          opacity: 0.5,
                          transform: 'translate(-50%, -50%) scale(1.05)',
                        },
                      },
                    }}
                  />
                )}
                
                {/* Efecto gris para "Suerte la próxima" */}
                {isBetterLuck && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '105%',
                      height: '105%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(158, 158, 158, 0.2) 0%, rgba(158, 158, 158, 0.05) 50%, transparent 80%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      animation: 'better-luck-glow 2s ease-in-out infinite',
                      '@keyframes better-luck-glow': {
                        '0%, 100%': {
                          opacity: 0.2,
                          transform: 'translate(-50%, -50%) scale(1)',
                        },
                        '50%': {
                          opacity: 0.35,
                          transform: 'translate(-50%, -50%) scale(1.02)',
                        },
                      },
                    }}
                  />
                )}
              </>
            )
          })()}

          {/* Centro de la ruleta con logo - Fijo (no rota) */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: {
                xs: '100px',   // Mobile: más pequeño
                sm: '130px',   // Tablet
                md: '160px',   // Desktop pequeño
                lg: '180px',   // Desktop grande
              },
              height: {
                xs: '100px',
                sm: '130px',
                md: '160px',
                lg: '180px',
              },
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Botón con logo - Clickable, siempre visible */}
            <Box
              onClick={handleSpin}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSpinning || prizes.length === 0 || loadingPrizes ? 'not-allowed' : 'pointer',
                opacity: isSpinning || prizes.length === 0 || loadingPrizes ? 0.7 : 1,
                transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '3px solid #4CAF50',
                boxSizing: 'border-box',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                pointerEvents: isSpinning || prizes.length === 0 || loadingPrizes ? 'none' : 'auto',
              }}
            >
              {/* Logo central (PNG) - Siempre visible */}
              <Image
                src="/images/roulette/center-logo.png"
                alt="Logo Helados Trébol"
                width={180}
                height={180}
                onError={(e) => {
                  // Si la imagen no existe, ocultar y mostrar fallback de texto
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  display: 'block',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
                className="logo-image"
                priority
              />
              {/* Fallback si no hay imagen del logo */}
              <Box
                sx={{
                  display: 'none',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
                className="logo-fallback"
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: '#FF0000',
                    lineHeight: 1.1,
                  }}
                >
                  Helados
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.2 }}>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      color: '#4CAF50',
                      lineHeight: 1,
                    }}
                  >
                    TREBOL
                  </Typography>
                  <Box sx={{ fontSize: '14px' }}>🍀</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Mensaje si no hay premios */}
        {!loadingPrizes && prizes.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: '20px', sm: '50px' },
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: '90%', sm: 'auto' },
              maxWidth: '500px',
              textAlign: 'center',
              padding: { xs: '15px', sm: '20px' },
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              zIndex: 1, // Por encima del fondo
            }}
          >
            <Typography variant="h6" color="error" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              No hay premios disponibles
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Por favor, inicializa los premios predeterminados ejecutando: npm run db:init-prizes
            </Typography>
          </Box>
        )}

        {/* Footer discreto con Copyright */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 16px',
            backgroundColor: '#fffac6', // Mismo color del fondo
            zIndex: 1,
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
      </Box>

      <PrizeModal
        open={showModal}
        prize={wonPrize}
        isPrize={wonPrize ? (getDefaultPrizeConfig(wonPrize.name)?.isPrize ?? false) : false}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
