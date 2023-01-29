import { colors, Stack, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, Button, IconButton, Typography, Box, Popover } from "@mui/material"
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

interface ShotButtonProps {
  shot: number
}

export default function ShotButton({ shot }: ShotButtonProps) {
  const label = shot === null ? <VisibilityOffOutlinedIcon sx={{width: 40, height: 40}} />: shot

  return (
    <>
      <Typography variant="h2" sx={{fontWeight: "bold", color: colors.blueGrey[300]}}>
        {label}
      </Typography>
    </>
  )
}
