import { Box, Tooltip, Stack, Typography } from "@mui/material"
import { SxProps, Theme } from '@mui/material/styles'
import type { Fight, CharacterEffect, Character } from "../../types/types"
import { useFight } from "../../contexts/FightContext"

interface ActionValueDisplayParams {
  name: string
  label: string
  description: string
  character: Character
  ignoreImpairments?: boolean
  sx?: SxProps<Theme>
}

const effectForCharacter = (fight: Fight, character: Character, name: String): CharacterEffect | undefined => {
  const effects = fight.character_effects[character.id as string] || []
  const effect = effects.find((e: CharacterEffect) => {
    if (e.action_value === name) {
      return true
    }
    if (e.action_value === "MainAttack" && name === character.action_values["MainAttack"]) {
      return true
    }
    return false
  })

  return effect
}

const valueChange = (original: number, newValue: number): number => {
  if (newValue > original) return 1
  if (newValue < original) return -1

  return 0
}

const adjustedReturnValue = (original: number, newValue: number): [number, number] => {
  return [valueChange(original, newValue), newValue]
}

const colorForValue = (changed: number): string => {
  if (changed === -1) return "red"
  if (changed == 1) return "green"

  return "inherit"
}

const adjustedValue = (character: Character, name: string, fight: Fight, impairments: number) => {
  const effect = effectForCharacter(fight, character, name)
  const original = (character.action_values[name] || 0) as number

  if (effect) {
    if (["+", "-"].includes(effect.change?.[0] as string)) {
      const newValue = original + parseInt(effect.change as string)
      return adjustedReturnValue(original, newValue)
    }
    const newValue = (effect.change || 0) as number
    return adjustedReturnValue(original, newValue)
  }

  const newValue = original - impairments
  return adjustedReturnValue(original, newValue)
}

export default function ActionValueDisplay({ name, description, label, character, ignoreImpairments, sx }: ActionValueDisplayParams) {
  const impairments = ignoreImpairments ? 0 : character.impairments

  const { fight } = useFight()

  const [changed, actionValue] = adjustedValue(character, name, fight, impairments)

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
