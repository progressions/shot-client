import { Stack, Box, Paper } from "@mui/material"

interface ButtonBarProps {
  sx?: any
}

export default function ButtonBar({ children, sx }: any) {
  return (
    <Box component={Paper} p={1} mb={1} sx={sx}>
      <Stack direction="row" spacing={2} alignItems="top">
        { children }
      </Stack>
    </Box>
  )
}
