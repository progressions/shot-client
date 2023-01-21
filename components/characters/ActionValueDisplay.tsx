import { Box, Tooltip, Stack, Typography } from "@mui/material"
import { SxProps, Theme } from '@mui/material/styles'
import type { Character } from "../../types/types"
import { useFight } from "../../contexts/FightContext"

interface ActionValueDisplayParams {
  name: string
  label: string
  description: string
  character: Character
  ignoreImpairments?: boolean
  sx?: SxProps<Theme>
}

const effectForCharacter = (fight, character, name) => {
  const effects = fight.character_effects[character.id] || []
  const effect = effects.find((e: any) => {
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

const valueChange = (original, newValue) => {
  if (newValue > original) return 1
  if (newValue === original) return 0
  if (newValue < original) return -1
}

const adjustedReturnValue = (original, newValue) => {
  return [valueChange(original, newValue), newValue]
}

const colorForValue = (changed) => {
  if (changed === -1) return "red"
  if (changed === 0) return "inherit"
  if (changed == 1) return "green"
}

const adjustedValue = (character, name, fight, impairments) => {
  const effect = effectForCharacter(fight, character, name)
  const original = character.action_values[name]

  if (effect) {
    if (["+", "-"].includes(effect.change[0])) {
      const newValue = original + parseInt(effect.change)
      return adjustedReturnValue(original, newValue)
    }
    const newValue = effect.change
    return adjustedReturnValue(original, newValue)
  }

  const newValue = original - impairments
  return adjustedReturnValue(original, newValue)
}

export default function ActionValueDisplay({ name, description, label, character, ignoreImpairments, sx }: ActionValueDisplayParams) {
  const impairments = ignoreImpairments ? 0 : character.impairments

  const { fight } = useFight()

  const [changed, actionValue] = adjustedValue(character, name, fight, impairments)
  console.log(name, changed, actionValue)

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
