import { Box, Stack, Typography } from "@mui/material"

export default function Schticks({ schticks, dispatch }: any) {
  if (!schticks) return (<></>)
  return (
    <>
      <Stack spacing={1}>
        <Typography variant="h3">Schticks</Typography>
        {
          schticks.map((schtick: any) => (
            <Box key={schtick.id}>
              <Typography variant="h4">
                {schtick.title}
              </Typography>
              <Typography>
                {schtick.description}
              </Typography>
            </Box>
          ))
        }
      </Stack>
    </>
  )
}
