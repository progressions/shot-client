import { Button, IconButton, Typography, Box, Popover } from "@mui/material"
import { useState } from "react"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

export default function ShotButton({ fight, shot }) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [timer, setTimer] = useState(null)

  const label = shot === null ? "hidden" : shot

  const showShotButton = (event) => {
    clearTimeout(timer)
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
