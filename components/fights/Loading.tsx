import { Box, Stack, Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <Box width={1000}>
      <Stack spacing={1} pt={3}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="rectangular" width={820} height={60} />
        </Stack>
        <Skeleton variant="rectangular" width={1000} height={60} />
        <Skeleton variant="rectangular" width={1000} height={60} />
      </Stack>
      <Stack spacing={1} pt={3}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="rectangular" width={820} height={60} />
        </Stack>
        <Skeleton variant="rectangular" width={1000} height={60} />
        <Skeleton variant="rectangular" width={1000} height={60} />
      </Stack>
      <Stack spacing={1} pt={3}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="rectangular" width={820} height={60} />
        </Stack>
        <Skeleton variant="rectangular" width={1000} height={60} />
        <Skeleton variant="rectangular" width={1000} height={60} />
      </Stack>
    </Box>
  )
}
