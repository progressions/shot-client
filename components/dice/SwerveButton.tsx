import { Box, Button, Tooltip } from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'

interface SwerveButtonProps {
  onClick: () => void
}

export default function SwerveButton({ onClick }: SwerveButtonProps) {
  return (
    <Tooltip title="Roll Swerve" arrow>
      <Button onClick={onClick}>
        <Box sx={{marginLeft: -3, height: 35, bgcolor: "black", borderRadius: 3}}>
          <Box sx={{marginTop: '-13px', whiteSpace: "nowrap"}} p={1}>
            <CasinoIcon sx={{color: 'white', width: 25, height: 45}} />
            <CasinoIcon sx={{color: 'red', width: 25, height: 45}} />
          </Box>
        </Box>
      </Button>
    </Tooltip>
  )
}
