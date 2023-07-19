import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCharacter } from "../../../contexts/CharacterContext"

import ColorPicker from "./ColorPicker"
import EditActionValues from "./EditActionValues"
import CharacterType from "./CharacterType"
import FortuneSelect from "./FortuneSelect"
import Description from "./Description"
import Faction from "./Faction"
import Schticks from "../../schticks/Schticks"
import SchtickSelector from "../../schticks/SchtickSelector"
import Skills from "./Skills"
import Advancements from "../../advancements/Advancements"
import Sites from "./sites/Sites"
import Weapons from "../../weapons/Weapons"
import CharacterImage from "./CharacterImage"

import { useEffect } from "react"

import { colors, Typography, Box, Stack, TextField, FormControlLabel, Switch, Button, InputAdornment } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleIcon from '@mui/icons-material/People'

import PlayerTypeOnly from "../../PlayerTypeOnly"
import DeathMarks from "../DeathMarks"
import { Subhead, StyledTextField } from "../../StyledFields"

import type { Character } from "../../../types/types"
import type { SchticksStateType } from "../../../reducers/schticksState"
import { initialSchticksState as initialSchticksState } from "../../../reducers/schticksState"
import type { WeaponsStateType } from "../../../reducers/weaponsState"
import { initialWeaponsState as initialWeaponsState } from "../../../reducers/weaponsState"
import { CharacterActions } from "../../../reducers/characterState"
import CS from "../../../services/CharacterService"

interface EditCharacterProps {
  character: Character
}

export default function EditCharacter({ character:initialCharacter }: EditCharacterProps) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { state:characterState, dispatch:dispatchCharacter, updateCharacter } = useCharacter()

  const { edited, saving, character } = characterState
  const { weapons, schticks, skills, description, action_values } = character

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault()

    await updateCharacter()
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    dispatchCharacter({ type: CharacterActions.UPDATE, name: event.target.name, value: event.target.value || event.target.checked })
  }

  function handleCheck(event: React.SyntheticEvent<Element, Event>, checked: boolean): void {
    const target = event.target as HTMLInputElement
    dispatchCharacter({ type: CharacterActions.UPDATE, name: target.name, value: checked })
  }

  function handleAVChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    dispatchCharacter({ type: CharacterActions.ACTION_VALUE, name: event.target.name, value: event.target.value || newValue })
  }

  function handleFactionChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    dispatchCharacter({ type: CharacterActions.UPDATE, name: event.target.name, value: event.target.value || newValue })
  }

  function handleSkillsChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchCharacter({ type: CharacterActions.SKILLS, name: event.target.name, value: event.target.value })
  }

  function handleDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchCharacter({ type: CharacterActions.DESCRIPTION, name: event.target.name, value: event.target.value })
  }

  const handleDeathMarks = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
    const { action_values } = character || {}
    const value = (newValue === CS.marksOfDeath(character)) ? 0 : newValue
    dispatchCharacter({ type: CharacterActions.ACTION_VALUE, name: "Marks of Death", value: value as number })
  }

  async function cancelForm() {
    try {
      const data = await client.getCharacter(character)
      dispatchCharacter({ type: CharacterActions.CHARACTER, payload: data })
      toastSuccess("Changes reverted.")
    } catch(error) {
      toastError()
    }
  }

  const woundsLabel = CS.isType(character, "Mooks") ? "Mooks" : "Wounds"

  const woundsAdornment = () => {
    if (CS.isType(character, "Mooks")) {
      return (
        <InputAdornment position="start"><PeopleIcon color='error' /></InputAdornment>
      )
    }
    return (
      <InputAdornment position="start"><FavoriteIcon color='error' /></InputAdornment>
    )
  }

  const schticksState:SchticksStateType = { ...initialSchticksState, schticks: schticks }
  const weaponsState:WeaponsStateType = { ...initialWeaponsState, weapons: weapons }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <StyledTextField name="name" label="Name" required autoFocus fullWidth onChange={handleChange} value={character.name} />
            <Faction faction={character.faction} onChange={handleFactionChange} />
            <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <CharacterType value={action_values.Type as string} onChange={handleAVChange} />
            <StyledTextField name="Archetype" label="Archetype" autoFocus fullWidth onChange={handleAVChange as React.ChangeEventHandler} value={action_values.Archetype} />
          </Stack>
          <Stack spacing={2} direction="row" alignItems='center'>
            <StyledTextField label={woundsLabel}
              type="number"
              name="Wounds"
              value={character.action_values?.['Wounds'] || ''}
              onChange={handleAVChange as React.ChangeEventHandler}
              InputProps={
                {startAdornment: woundsAdornment()}
              }
            />
            <PlayerTypeOnly character={character} only="PC">
              <DeathMarks character={character} onChange={handleDeathMarks} />
            </PlayerTypeOnly>
            <StyledTextField label="Impairments" type="number" name="impairments" value={character.impairments || ''} onChange={handleChange} />
            <ColorPicker character={character} onChange={handleChange} dispatch={dispatchCharacter} />
          </Stack>
          <EditActionValues character={character} onChange={handleAVChange as React.ChangeEventHandler} />
          <PlayerTypeOnly character={character} only="PC">
            <FortuneSelect character={character} onChange={handleAVChange as React.ChangeEventHandler} readOnly={false} />
          </PlayerTypeOnly>
          <Skills character={character} onChange={handleSkillsChange} />
          <Weapons state={weaponsState} />
          <PlayerTypeOnly character={character} only="PC">
            <Advancements character={character} />
          </PlayerTypeOnly>
          <Sites character={character} />
          <CharacterImage character={character} onChange={handleChange} />
          <Description character={character} onChange={handleDescriptionChange} />
          <Schticks state={schticksState} />
          <SchtickSelector />
        </Stack>
      </Box>
    </>
  )
}
