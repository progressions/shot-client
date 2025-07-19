import { useReducer, MouseEventHandler, useState, useEffect, SyntheticEvent } from "react"
import { colors, FormControl, Switch, Tooltip, Typography, DialogActions, FormControlLabel, MenuItem, Checkbox, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, Box, Stack, TextField, Button, Paper, Popover } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PeopleIcon from "@mui/icons-material/People"
import { StyledTextField, SaveCancelButtons, SaveButton, CancelButton, StyledDialog } from "@/components/StyledFields"
import { FormActions, formReducer, initializeFormState } from '@/reducers/formState'

import Router from "next/router"

import ColorPicker from "@/components/characters/edit/ColorPicker"
import CharacterType from "@/components/characters/edit/CharacterType"
import FortuneSelect from "@/components/characters/edit/FortuneSelect"
import EditActionValues from "@/components/characters/edit/EditActionValues"

import DeathMarks from "@/components/characters/DeathMarks"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"

import { useToast, useFight, useClient } from "@/contexts"

import type { Person, Fight, Character, Toast, ID } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import CS from "@/services/CharacterService"

interface CharacterModalParams {
  open: Character,
  setOpen: React.Dispatch<React.SetStateAction<Character>>
  character: Person | null
  reload?: () => Promise<void>
}

export default function CharacterModal({ open, setOpen, character:activeCharacter, reload }: CharacterModalParams) {
  const initialFormState = initializeFormState({ character: activeCharacter || defaultCharacter })
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState)
  const { saving, disabled, formData } = formState
  const { character }  = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const newCharacter = !character.id

  useEffect(() => {
    if (activeCharacter) {
      dispatchForm({ type: FormActions.UPDATE, name: "character", value: activeCharacter })
    }
  }, [activeCharacter])

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: { ...character, [event.target.name]: event.target.value } })
  }

  const handleCheck = (event: SyntheticEvent<Element, Event>) => {
    const target = event.target as HTMLInputElement
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: { ...character, [target.name]: target.checked } })
  }

  const handleWounds = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCharacter = CS.updateWounds(character, parseInt(event.target.value) || 0)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCharacter = CS.updateActionValue(character, event.target.name, event.target.value)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const handleDeathMarks = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
    const updatedCharacter = CS.setDeathMarks(character, newValue || 0)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
    setOpen(false)
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    try {
      const data = newCharacter ?
        await client.createCharacter(character, fight) :
        await client.updateCharacter(character, fight)

      dispatchForm({ type: FormActions.UPDATE, name: "character", value: data })

      if (newCharacter) {
        toastSuccess(`${character.name} created.`)
      } else {
        toastSuccess(`${character.name} updated.`)
      }
      if (fight?.id) {
        await client.touchFight(fight)
        dispatchFight({ type: FightActions.EDIT })
      } else if (reload) {
        await reload()
      }
    } catch(error) {
      toastError()
      dispatchForm({ type: FormActions.RESET, payload: initialFormState })
    }
    cancelForm()
  }

  const woundsLabel = CS.isType(character, "Mook") ? "Mooks" : "Wounds"
  const dialogTitle = newCharacter ? "Create Character" : `${character.name}`

  const woundsAdornment = () => {
    if (CS.isType(character, "Mook")) {
      return (
        <InputAdornment position="start"><PeopleIcon color='error' /></InputAdornment>
      )
    }
    return (
      <InputAdornment position="start"><FavoriteIcon color='error' /></InputAdornment>
    )
  }

  const healCharacter = () => {
    const updatedCharacter = CS.fullHeal(character)
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  const setCharacter = (updatedCharacter: Character) => {
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: updatedCharacter })
  }

  return (
    <>
      <StyledDialog
        open={!!(open.id || open.new) && open.category === "character"}
        onClose={handleClose}
        title={dialogTitle}
        onSubmit={handleSubmit}
        disabled={saving}
      >
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <CharacterType value={character.action_values?.['Type'] as string || ''} onChange={handleAVChange} />
              { character.action_values["Type"] === "PC" && <StyledTextField name="Archetype" label="Archetype" fullWidth value={character.action_values["Archetype"]} onChange={handleAVChange} /> }
              <FormControlLabel label="Task" name="task" control={<Switch checked={!!character.task} />} onChange={handleCheck} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <StyledTextField autoFocus label="Name" size="medium" sx={{paddingBottom: 2}} fullWidth required name="name" value={character.name} onChange={handleChange} />
              { fight?.id &&
              <StyledTextField label="Shot" type="number" name="current_shot" value={character.current_shot === null ? "" : character.current_shot} onChange={handleChange} sx={{width: 80}} /> }
            </Stack>
            <Stack spacing={2} direction="row" alignItems='center'>
              <PlayerTypeOnly character={character} except="Mook">
                <StyledTextField label={woundsLabel}
                  type="number"
                  name="Wounds"
                  value={character.action_values?.["Wounds"] || ""}
                  onChange={handleWounds}
                  InputProps={
                    {startAdornment: woundsAdornment()}
                  }
                />
              </PlayerTypeOnly>
              <PlayerTypeOnly character={character} only="Mook">
                <StyledTextField label={woundsLabel}
                  type="number"
                  name="count"
                  value={character.count || ""}
                  onChange={handleChange}
                  InputProps={
                    {startAdornment: woundsAdornment()}
                  }
                />
              </PlayerTypeOnly>
              <PlayerTypeOnly character={character} only="PC">
                <DeathMarks character={character} onChange={handleDeathMarks} />
              </PlayerTypeOnly>
              <StyledTextField label="Impairments" type="number" name="impairments" value={character.impairments || ''} onChange={handleChange} />
              <ColorPicker character={character} onChange={handleChange} setCharacter={setCharacter as React.Dispatch<React.SetStateAction<Character>>} />
            </Stack>
            <EditActionValues character={character} onChange={handleAVChange} />
            <PlayerTypeOnly character={character} only="PC">
              <Stack direction="row" spacing={2}>
                <FortuneSelect character={character} onChange={handleAVChange} />
              </Stack>
            </PlayerTypeOnly>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} direction="row">
            <PlayerTypeOnly character={character} except="Mook">
              <Tooltip title="Full Heal">
                <Button variant="outlined" onClick={healCharacter}>
                  <FavoriteIcon color="error" />
                </Button>
              </Tooltip>
            </PlayerTypeOnly>
            <SaveCancelButtons disabled={saving} onCancel={cancelForm} />
          </Stack>
        </DialogActions>
      </StyledDialog>
    </>
  )
}
