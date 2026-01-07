'use client'

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'
import EmotionRegistry from '@/lib/emotion-cache'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EmotionRegistry>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </EmotionRegistry>
  )
}
