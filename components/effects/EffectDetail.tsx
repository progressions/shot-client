import InfoIcon from '@mui/icons-material/Info'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useState } from "react"
import { Tooltip, Alert, AlertTitle, Popover, Box, Stack, Typography, IconButton } from "@mui/material"

import type { Effect } from "../../types/types"

interface EffectDetailProps {
  effect: Effect
}

export default function EffectDetail({ effect }: EffectDetailProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [timer, setTimer] = useState<any>(null)

  const showEffect = (event: any) => {
    clearTimeout(timer)
    setOpen(true)
    setAnchorEl(event.target)
    setTimer(closeAfterTimeout)
  }

  const closeAfterTimeout = () => {
    return (setTimeout(() => {
      closePopover()
    }, 3000))
  }

  const closePopover = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title={effect.title}>
        <IconButton onMouseEnter={showEffect} color={effect.severity as any}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={effect.severity as any} sx={{paddingRight: 5}}>
          <AlertTitle>{effect.title}</AlertTitle>
          <Typography>{effect.description}</Typography>
          <Typography variant="caption">Until sequence {effect.end_sequence}, shot {effect.end_shot}</Typography>
        </Alert>
      </Popover>
    </>
  )
}
