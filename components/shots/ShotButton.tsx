import { Stack, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, Button, IconButton, Typography, Box, Popover } from "@mui/material"
import { useState } from "react"
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

import type { Fight, Toast } from "../../types/types"

interface ShotButtonProps {
  fight: Fight
  shot: number
  setToast: React.Dispatch<React.SetStateAction<Toast>>
  setFight: React.Dispatch<React.SetStateAction<Fight>>
}

export default function ShotButton({ fight, shot, setToast, setFight }: ShotButtonProps) {
  const label = shot === null ? <VisibilityOffOutlinedIcon sx={{width: 40, height: 40}} />: shot

  return (
    <>
      <Typography variant="h2" sx={{fontWeight: "bold", color: "text.disabled"}}>
        {label}
      </Typography>
    </>
  )
}
