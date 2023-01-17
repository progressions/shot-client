import { Box, Tooltip, Stack, Typography } from "@mui/material"
import { SxProps, Theme } from '@mui/material/styles'
import type { Character } from "../../types/types"

interface ActionValueDisplayParams {
  name: string
  label: string
  description: string
  character: Character
  ignoreImpairments?: boolean
  sx?: SxProps<Theme>
}

export default function ActionValueDisplay({ name, description, label, character, ignoreImpairments, sx }: ActionValueDisplayParams) {
  const impairments = ignoreImpairments ? 0 : character.impairments
  const color = impairments ? 'red' : "inherit"

  const value = (name === "Fortune") ?
    <Typography variant="body1" sx={{color: color, fontWeight: "normal"}}>{character.action_values["Fortune"]} / {character.action_values["Max Fortune"]}</Typography> :
    <Typography variant="body1" sx={{color: color, fontWeight: "normal"}}>{(character.action_values[name] as number) - (impairments || 0)}</Typography>

  if (character.action_values[name]) {
    return (
      <>
        <Typography variant="body1" sx={{fontWeight: "bold", color: color}}>{label}</Typography>
        {value}
      </>
    )
  } else {
    return <></>
  }
}
