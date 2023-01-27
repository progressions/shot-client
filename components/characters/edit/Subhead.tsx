import { colors, Divider, Box, Typography } from "@mui/material"

export default function Subhead(props: any) {
  return (
    <>
      <Divider color={colors.blue[100]} />
      <Box marginTop={3} marginBottom={1}>
        <Typography variant="h6" gutterBottom {...props}>
          { props.children }
        </Typography>
      </Box>
    </>
  )
}
