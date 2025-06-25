import { useClient, useToast, useCharacter } from "@/contexts"

import ColorPicker from "@/components/characters/edit/ColorPicker"
import EditActionValues from "@/components/characters/edit/EditActionValues"
import CharacterType from "@/components/characters/edit/CharacterType"
import FortuneSelect from "@/components/characters/edit/FortuneSelect"
import Description from "@/components/characters/edit/Description"
import Faction from "@/components/characters/edit/Faction"
import Schticks from "@/components/schticks/Schticks"
import SchtickSelector from "@/components/schticks/SchtickSelector"
import Skills from "@/components/characters/edit/Skills"
import Advancements from "@/components/advancements/Advancements"
import Sites from "@/components/characters/edit/sites/Sites"
import ImageManager from "@/components/images/ImageManager"
import Weapons from "@/components/weapons/Weapons"
import UploadImage from "@/components/characters/edit/UploadImage"
import ImageDisplay from "@/components/characters/ImageDisplay"
import NotionLink from "@/components/notion/NotionLink"
import AssignUser from "@/components/characters/edit/AssignUser"
import UserAvatar from "@/components/UserAvatar"

import { useEffect } from "react"

import { Tooltip, Grid, ButtonGroup, Link, colors, Typography, Box, Stack, TextField, FormControlLabel, Switch, Button, InputAdornment } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'

import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import DeathMarks from "@/components/characters/DeathMarks"
import { Subhead, StyledTextField } from "@/components/StyledFields"

import type { Character } from "@/types/types"
import type { SchticksStateType } from "@/reducers/schticksState"
import { initialSchticksState as initialSchticksState } from "@/reducers/schticksState"
import type { WeaponsStateType } from "@/reducers/weaponsState"
import { initialWeaponsState as initialWeaponsState } from "@/reducers/weaponsState"
import { CharacterActions } from "@/reducers/characterState"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"

interface EditCharacterProps {
  character: Character
}

export default function EditCharacter({ character:initialCharacter }: EditCharacterProps) {
  const { user, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { state:characterState, dispatch:dispatchCharacter, updateCharacter } = useCharacter()

  const { edited, saving, character } = characterState
  const { weapons, schticks, skills, description, action_values } = character

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault()

    await updateCharacter()
  }

  async function deleteImage(character: Character) {
    await client.deleteCharacterImage(character as Character)
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

  const woundsLabel = CS.isMook(character) ? "Mooks" : "Wounds"

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
  const notionLink = CS.notionLink(character)
  const userDisplay = (<>
    <Stack direction="row" spacing={1}>
      <UserAvatar user={character?.user} />
      <Typography variant="h5" sx={{pt: 0.4}}>
        {[character?.user?.first_name, character?.user?.last_name].filter(Boolean).join(" ") || character?.user?.email}
      </Typography>
    </Stack>
  </>)

  return (
    <>
      { (edited || saving) && <Typography>Saving...</Typography> }
      { !(edited || saving) && character?.user?.email && userDisplay }
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Stack spacing={2}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={6}>
                  <FormControlLabel label="Task" name="task" control={<Switch checked={character.task} />} onChange={handleCheck} />
                  <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
                </Grid>
                <Grid item xs={2}>
                  { CS.isPC(character) &&
                  <GamemasterOnly user={user} character={character}>
                    <AssignUser />
                  </GamemasterOnly> }
                </Grid>
                <Grid item xs={4}>
                  <NotionLink />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} width={600} alignItems="center">
                <StyledTextField name="name" label="Name" required autoFocus fullWidth onChange={handleChange} value={character.name} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Faction faction={character.faction} onChange={handleFactionChange} />
                <CharacterType value={action_values.Type as string} onChange={handleAVChange} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <StyledTextField name="Archetype" label="Archetype" autoFocus fullWidth onChange={handleAVChange as React.ChangeEventHandler} value={action_values.Archetype} />
              </Stack>
            </Stack>
            { character?.id && <ImageManager name="character" entity={character} updateEntity={updateCharacter} deleteImage={deleteImage} apiEndpoint="allCharacters" /> }
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
          <Description character={character} onChange={handleDescriptionChange} />
          <Schticks />
        </Stack>
      </Box>
    </>
  )
}
