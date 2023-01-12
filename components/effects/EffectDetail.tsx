import InfoIcon from '@mui/icons-material/Info'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useState } from "react"
import { Tooltip, Alert, AlertTitle, Popover, Box, Stack, Typography, IconButton } from "@mui/material"

export default function EffectDetail({ effect }) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [timer, setTimer] = useState(null)

  const showEffect = (event) => {
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
        <IconButton onMouseEnter={showEffect} color={effect.severity}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={effect.severity} sx={{paddingRight: 5}}>
          <AlertTitle>{effect.title}</AlertTitle>
          <Typography>{effect.description}</Typography>
          <Typography variant="caption">Until sequence {effect.end_sequence}, shot {effect.end_shot}</Typography>
        </Alert>
      </Popover>
    </>
  )
}
