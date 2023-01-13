import { Stack, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, Button, IconButton, Typography, Box, Popover } from "@mui/material"
import { useState } from "react"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

import type { Fight, Toast } from "../../types/types"

interface ShotButtonProps {
  fight: Fight
  shot: number
  setToast: React.Dispatch<React.SetStateAction<Toast>>
  setFight: React.Dispatch<React.SetStateAction<Fight>>
}

export default function ShotButton({ fight, shot, setToast, setFight }: ShotButtonProps) {
  const label = shot === null ? "hidden" : shot

  return (
    <>
      <Typography variant="h2" sx={{fontWeight: "bold", color: "text.disabled"}}>
        {label}
      </Typography>
    </>
  )
}
