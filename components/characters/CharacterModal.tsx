import { MouseEventHandler, useState, useEffect } from 'react'
import { Switch, Tooltip, Typography, DialogActions, FormControlLabel, MenuItem, Checkbox, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, Box, Stack, TextField, Button, Paper, Popover } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleIcon from '@mui/icons-material/People'

import Router from 'next/router'

import ColorPicker from "./edit/ColorPicker"
import CharacterType from './edit/CharacterType'
import FortuneSelect from "./edit/FortuneSelect"
import EditActionValues from "./edit/EditActionValues"

import DeathMarks from "./DeathMarks"
import PlayerTypeOnly from "../PlayerTypeOnly"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useSession } from 'next-auth/react'
import Client from "../Client"

import type { Person, Fight, Character, Toast, ID } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharacterModalParams {
  open: Character,
  setOpen: React.Dispatch<React.SetStateAction<Character>>
  fight?: Fight,
  setFight?: React.Dispatch<React.SetStateAction<Fight>>
  character: Person | null
}

export default function CharacterModal({ open, setOpen, character:activeCharacter }: CharacterModalParams) {
  const { fight, setFight, reloadFight } = useFight()
  const { client } = useClient()
  const { setToast } = useToast()

  const [saving, setSaving] = useState(false);

  const [character, setCharacter] = useState<Person>(activeCharacter || defaultCharacter)
  const newCharacter = !character.id

  useEffect(() => {
    if (activeCharacter) {
      setCharacter(activeCharacter)
    }
  }, [activeCharacter])

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacter((prevState: Person) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleCheck = (event: any) => {
    setCharacter((prevState: Person) => ({ ...prevState, [event.target.name]: event.target.checked }))
  }

  const handleAVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { action_values } = character || {}
    setCharacter((prevState: Person) => ({ ...prevState, action_values: { ...action_values, [event.target.name]: event.target.value } }))
  }

  const handleDeathMarks = (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
    const { action_values } = character || {}
    const value = (newValue === character.action_values["Marks of Death"]) ? 0 : newValue
    setCharacter((prevState: Person) => ({ ...prevState, action_values: { ...action_values, "Marks of Death": value as number } }))
  }

  const cancelForm = () => {
    setCharacter(character || defaultCharacter)
    setOpen(defaultCharacter)
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    setSaving(true)
    event.preventDefault()

    const response = newCharacter ?
      await client.createCharacter(character, fight) :
      await client.updateCharacter(character, fight)

    if (response.status === 200) {
      const data = await response.json()

      setCharacter(data)
      setSaving(false)
      cancelForm()
      if (newCharacter) {
        setToast({ open: true, message: `${character.name} created.`, severity: "success" })
      } else {
        setToast({ open: true, message: `${character.name} updated.`, severity: "success" })
      }
      if (fight?.id && setFight) {
        await reloadFight(fight)
      } else {
        Router.reload()
      }
    } else {
      setToast({ open: true, message: `There was an error`, severity: "error" })
      setSaving(false)
      cancelForm()
    }
  }

  const woundsLabel = character.action_values["Type"] === "Mook" ? "Mooks" : "Wounds"
  const dialogTitle = newCharacter ? "Create Character" : "Update Character"

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

  const healCharacter = () => {
    if (character.action_values["Type"] === "Mook") return

    const actionValues = character.action_values
    actionValues["Wounds"] = 0
    actionValues["Fortune"] = actionValues["Max Fortune"]
    actionValues["Marks of Death"] = 0
    setCharacter((prev: Character) => ({ ...prev, impairments: 0, action_values: actionValues }))
  }

  return (
    <>
      <Dialog
        open={!!(open.id || open.new) && open.category === "character"}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} pb={1}>
          <DialogContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <CharacterType value={character.action_values?.['Type'] as string || ''} onChange={handleAVChange} />
                { character.action_values["Type"] === "PC" && <TextField name="Archetype" label="Archetype" fullWidth value={character.action_values["Archetype"]} onChange={handleAVChange} /> }
                <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField autoFocus label="Name" variant="filled" size="medium" sx={{paddingBottom: 2}} fullWidth required name="name" value={character.name} onChange={handleChange} />
                { fight &&
                <TextField label="Shot" type="number" name="current_shot" value={character.current_shot === null ? '' : (character.current_shot || '')} onChange={handleChange} sx={{width: 80}} /> }
              </Stack>
              <Stack spacing={2} direction="row" alignItems='center'>
                <TextField label={woundsLabel}
                  type="number"
                  name="Wounds"
                  value={character.action_values?.['Wounds'] || ''}
                  onChange={handleAVChange}
                  InputProps={
                    {startAdornment: woundsAdornment()}
                  }
                />
                <PlayerTypeOnly character={character} only="PC">
                  <DeathMarks character={character} onChange={handleDeathMarks} />
                </PlayerTypeOnly>
                <TextField label="Impairments" type="number" name="impairments" value={character.impairments || ''} onChange={handleChange} />
                <ColorPicker character={character} onChange={handleChange} setCharacter={setCharacter} />
              </Stack>
              <Typography variant="h6">Action Values</Typography>
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
              <Stack spacing={2} direction="row">
                <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
              </Stack>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
