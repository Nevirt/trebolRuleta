'use client'

import { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  MoreVert,
  CardGiftcard,
  Download,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

export default function AdminMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleManagePrizes = () => {
    router.push('/admin')
    handleClose()
  }

  const handleExportExcel = () => {
    window.open('/api/export', '_blank')
    handleClose()
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleManagePrizes}>
          <ListItemIcon>
            <CardGiftcard fontSize="small" />
          </ListItemIcon>
          <ListItemText>Gestionar premios</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar Excel</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
