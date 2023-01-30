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
import Sites from "../../sites/Sites"

import { useEffect } from "react"

import { colors, Typography, Box, Stack, TextField, FormControlLabel, Switch, Button, InputAdornment } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleIcon from '@mui/icons-material/People'

import PlayerTypeOnly from "../../PlayerTypeOnly"
import DeathMarks from "../DeathMarks"
import { Subhead, StyledTextField } from "../../StyledFields"

export default function EditCharacter({ character:initialCharacter }: any) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { state, dispatch, updateCharacter } = useCharacter()

  const { edited, saving, character } = state
  const { schticks, skills, description, action_values } = character

  async function handleSubmit(event: any) {
    event.preventDefault()

    await updateCharacter()
  }

  function handleChange(event: any) {
    dispatch({ type: "update", name: event.target.name, value: event.target.value || event.target.checked })
  }

  function handleCheck(event: any) {
    dispatch({ type: "update", name: event.target.name, value: event.target.checked })
  }

  function handleAVChange(event: any, newValue: any) {
    dispatch({ type: "action_value", name: event.target.name, value: event.target.value || newValue })
  }

  function handleSkillsChange(event: any) {
    dispatch({ type: "skills", name: event.target.name, value: event.target.value })
  }

  function handleDescriptionChange(event: any) {
    dispatch({ type: "description", name: event.target.name, value: event.target.value })
  }

  const handleDeathMarks = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
    const { action_values } = character || {}
    const value = (newValue === character.action_values["Marks of Death"]) ? 0 : newValue
    dispatch({ type: "action_value", name: "Marks of Death", value: value })
  }

  async function cancelForm() {
    const response = await client.getCharacter(character)
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: "replace", character: data })
      toastSuccess("Changes reverted.")
    } else {
      toastError()
    }
  }

  const woundsLabel = character.action_values["Type"] === "Mook" ? "Mooks" : "Wounds"

  const woundsAdornment = () => {
    if (character.action_values["Type"] === "Mook") {
      return (
        <InputAdornment position="start"><PeopleIcon color='error' /></InputAdornment>
      )
    }
    return (
      <InputAdornment position="start"><FavoriteIcon color='error' /></InputAdornment>
    )
  }

  const filter = {
    schticks: schticks,
    meta: {}
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <StyledTextField name="name" label="Name" required autoFocus fullWidth onChange={handleChange} value={character.name} />
            <Faction faction={action_values["Faction"]} onChange={handleAVChange as any} />
            <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <CharacterType value={action_values.Type} onChange={handleAVChange} />
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
            <ColorPicker character={character} onChange={handleChange} dispatch={dispatch} />
          </Stack>
          <EditActionValues character={character} onChange={handleAVChange as React.ChangeEventHandler} />
          <PlayerTypeOnly character={character} only="PC">
            <FortuneSelect character={character} onChange={handleAVChange as React.ChangeEventHandler} readOnly={false} />
          </PlayerTypeOnly>
          <Skills skills={skills} onChange={handleSkillsChange} />
          <Advancements character={character} />
          <Sites character={character} />
          <Description description={description} onChange={handleDescriptionChange} />
          <Schticks schticks={schticks} filter={filter} state={state} dispatch={dispatch} />
          <SchtickSelector />
        </Stack>
      </Box>
    </>
  )
}
