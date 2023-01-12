import { useState } from "react"
import { Typography, Popover, Box, Stack, IconButton } from "@mui/material"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import AddAlarmIcon from '@mui/icons-material/AddAlarm';

export default function ShotEffects({ }) {
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [open, setOpen] = useState<boolean>(false)

  const openPopup = (event: any) => {
    setOpen(true)
    setAnchorEl(event.target)
  }
  const handleClose = (event: any) => {
    setOpen(false)
  }

  return (
    <>
      <IconButton>
        <AddAlarmIcon />
      </IconButton>
      <IconButton onClick={openPopup}>
        <ErrorOutlineIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box p={2}>
          <Stack spacing={1}>
            <Typography variant="h5">
              Status Effect
            </Typography>
            <Typography>
              +1 to all heroes&rsquo; attacks
            </Typography>
            <Typography variant="caption">
              Until Sequence 3, shot 12
            </Typography>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
