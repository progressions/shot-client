import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { colors, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import { useState } from "react"

export default function SchticksDisplay({ schticks }: any) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  function closePopover() {
    setAnchorEl(null)
    setOpen(false)
  }

  function showSchticks(event: any) {
    setAnchorEl(event.target)
    setOpen(true)
  }

  if (!schticks.length) return <></>

  return (
    <>
      <Tooltip title="Schticks">
        <IconButton onMouseEnter={showSchticks} color="inherit">
          <LightbulbIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Box p={2} sx={{backgroundColor: colors.lightBlue[100]}}>
          {
            schticks.map((schtick: any) => (
              <Typography key={schtick.id} gutterBottom sx={{color: "primary.dark"}}><strong>{schtick.title}</strong>: {schtick.description}</Typography>
            ))
          }
        </Box>
      </Popover>
    </>
  )
}
