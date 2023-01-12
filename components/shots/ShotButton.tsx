import { Button, IconButton, Typography, Box, Popover } from "@mui/material"
import { useState } from "react"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

import type { Fight } from "../../types/types"

interface ShotButtonProps {
  fight: Fight
  shot: number
}

export default function ShotButton({ fight, shot }: ShotButtonProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [timer, setTimer] = useState<any>(null)

  const label = shot === null ? "hidden" : shot

  const showShotButton = (event: any) => {
    clearTimeout(timer as any)
    setOpen(true)
    setAnchorEl(event.target)
    setTimer(closeAfterTimeout)
  }

  const closeAfterTimeout = () => {
    return (setTimeout(() => {
      setOpen(false)
    }, 3000))
  }

  return (
    <>
      <Typography variant="h3">
        <Box onClick={showShotButton} onMouseEnter={showShotButton}>
          {label}
        </Box>
      </Typography>
      <Popover anchorEl={anchorEl} open={open} onClose={() => setOpen(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Box p={2}>
          <Button startIcon={<AddCircleOutlineOutlinedIcon />}>
            Add Effect
          </Button>
        </Box>
      </Popover>
    </>
  )
}
