import { Box, Tooltip, Stack, Typography } from "@mui/material"
import { SxProps, Theme } from '@mui/material/styles'
import type { Fight, CharacterEffect, Character } from "../../types/types"
import { useFight } from "../../contexts/FightContext"
import CS from "../../services/CharacterService"
import CES from "../../services/CharacterEffectService"

interface ActionValueDisplayParams {
  name: string
  label: string
  description: string
  character: Character
  ignoreImpairments?: boolean
  sx?: SxProps<Theme>
}

const colorForValue = (changed: number): string => {
  if (changed === -1) return "red"
  if (changed == 1) return "green"

  return "inherit"
}

export default function ActionValueDisplay({ name, description, label, character, ignoreImpairments, sx }: ActionValueDisplayParams) {
  const impairments = ignoreImpairments ? 0 : character.impairments

  const { fight } = useFight()

  const [changed, actionValue] = CES.adjustedActionValue(character, name, fight, ignoreImpairments as boolean)

  const color = colorForValue(changed)

  const value = (name === "Fortune") ?
    <Typography variant="body1" color={color} sx={{fontWeight: "normal"}}>{character.action_values["Fortune"]} / {character.action_values["Max Fortune"]}</Typography> :
    <Typography variant="body1" color={color} sx={{fontWeight: "normal"}}>{actionValue}</Typography>

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
