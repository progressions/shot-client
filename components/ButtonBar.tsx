import { Box, Paper } from "@mui/material"

interface ButtonBarProps {
  sx?: any
}

export default function ButtonBar({ children, sx }: any) {
  return (
    <Box component={Paper} p={1} mb={1} sx={sx}>
      { children }
    </Box>
  )
}
