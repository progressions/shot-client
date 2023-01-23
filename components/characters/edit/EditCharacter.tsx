import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"

import ColorPicker from "./ColorPicker"
import EditActionValues from "./EditActionValues"
import CharacterType from "./CharacterType"
import FortuneSelect from "./FortuneSelect"
import Description from "./Description"
import Faction from "./Faction"

import { useMemo, useReducer, useCallback } from "react"

import { Typography, Box, Stack, TextField, FormControlLabel, Switch, Button, InputAdornment } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleIcon from '@mui/icons-material/People'

import PlayerTypeOnly from "../../PlayerTypeOnly"
import DeathMarks from "../DeathMarks"

export default function EditCharacter({ character:initialCharacter }: any) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const initialState = useMemo(() => ({
    edited: false,
    saving: false,
    character: initialCharacter
  }), [initialCharacter])

  const characterReducer = useCallback((state: any, action: any) => {
    switch(action.type) {
      case "update":
        return {
          ...state,
          edited: true,
          character: {
            ...state.character,
            [action.name]: action.value
          }
        }
      case "action_value":
        return {
          ...state,
          edited: true,
          character: {
            ...state.character,
            action_values: {
              ...state.character.action_values,
              [action.name]: action.value
            }
          }
        }
      case "description":
        return {
          ...state,
          edited: true,
          character: {
            ...state.character,
            description: {
              ...state.character.description,
              [action.name]: action.value
            }
          }
        }
      case "submit":
        return {
          ...state,
          edited: false,
          saving: true,
        }
      case "replace":
        return {
          ...state,
          saving: false,
          edited: false,
          character: action.character
        }
      case "reset":
        return {
          ...state,
          saving: false
        }
      default:
        return initialState
    }
  }, [initialState])

  const [state, dispatch] = useReducer(characterReducer, initialState)
  const { edited, saving, character } = state
  const { description, action_values } = character

  console.log({ description })

  async function handleSubmit(event: any) {
    event.preventDefault()
    dispatch({ type: "submit" })

    const response = await client.updateCharacter(character)
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: "replace", character: data })
      toastSuccess("Character updated.")
    } else {
      dispatch({ type: "reset" })
      toastError()
    }
  }

  function handleChange(event: any) {
    dispatch({ type: "update", name: event.target.name, value: event.target.value || event.target.checked })
  }

  function handleCheck(event: any) {
    dispatch({ type: "update", name: event.target.name, value: event.target.checked })
  }

  function handleAVChange(event: any) {
    dispatch({ type: "action_value", name: event.target.name, value: event.target.value })
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

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <TextField name="name" label="Name" required autoFocus fullWidth onChange={handleChange} value={character.name} />
            <Faction faction={action_values["Faction"]} onChange={handleAVChange} />
            <FormControlLabel label="Active" name="active" control={<Switch checked={character.active} />} onChange={handleCheck} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <CharacterType value={action_values.Type} onChange={handleAVChange} />
            <TextField name="Archetype" label="Archetype" autoFocus fullWidth onChange={handleAVChange} value={action_values.Archetype} />
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
            <ColorPicker character={character} onChange={handleChange} dispatch={dispatch} />
          </Stack>
          <Typography variant="h6">Action Values</Typography>
          <EditActionValues character={character} onChange={handleAVChange} />
          <Stack direction="row" spacing={2}>
            <FortuneSelect character={character} onChange={handleAVChange} />
          </Stack>
          <Description description={description} onChange={handleDescriptionChange} />
          <Stack spacing={2} direction="row">
            <Button variant="outlined" color="secondary" disabled={saving || !edited} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit" disabled={saving || !edited}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
