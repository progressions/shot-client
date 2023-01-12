import { Box, Tooltip, Stack, Typography } from "@mui/material"
import { SxProps, Theme } from '@mui/material/styles'
import type { Character } from "../types/types"

interface ActionValueDisplayParams {
  name: string,
  label: string,
  description: string,
  character: Character,
  sx?: SxProps<Theme>
}

export default function ActionValueDisplay({ name, description, label, character, sx }: ActionValueDisplayParams) {
  const borderColor = "#aaa"
  const color = character.impairments ? 'red' : borderColor
  const styles = {
    width: 40,
    borderColor: borderColor,
    borderRight: 'none'
  }
  if (character.action_values?.[name]) {
    return (
      <Tooltip title={description} arrow>
        <Stack spacing={1} sx={sx || styles} border={1}>
          <Typography variant="body2" color="white" align="center" component="div"><Box bgcolor={borderColor} sx={{overflow: "hidden", whiteSpace: "nowrap"}}>{label}</Box></Typography>
          <Typography variant="h6" align="center" sx={{color: color}}>{(character.action_values[name] as number) - (character.impairments || 0)}</Typography>
        </Stack>
    </Tooltip>
    )
  } else {
    return <></>
  }
}
