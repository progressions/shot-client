import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { colors, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import { useState } from "react"
import type { Schtick } from "../../types/types"

interface SchticksDisplayProps {
  schticks: Schtick[]
}

export default function SchticksDisplay({ schticks }: SchticksDisplayProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [open, setOpen] = useState(false)

  function closePopover() {
    setAnchorEl(null)
    setOpen(false)
  }

  function showSchticks(event: React.SyntheticEvent<Element, Event>) {
    setAnchorEl(event.target as Element)
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
        <Box p={2} sx={{width: 500, backgroundColor: colors.amber[100]}}>
          {
            schticks.map((schtick: Schtick) => (
              <Typography key={schtick.id} gutterBottom sx={{color: "primary.dark"}}>
                <Box component="span" sx={{color: schtick.color, fontWeight: "bold"}}>{schtick.title}</Box>: {schtick.description}
              </Typography>
            ))
          }
        </Box>
      </Popover>
    </>
  )
}
