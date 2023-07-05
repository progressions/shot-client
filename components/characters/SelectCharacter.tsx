import { useEffect, useReducer, useCallback, useState } from 'react'
import { colors, FormControlLabel, Switch, Stack, Popover, Box, Button } from '@mui/material'
import GamemasterOnly from "../GamemasterOnly"
import { StyledTextField } from "../StyledFields"

import PersonIcon from '@mui/icons-material/Person'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'

import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import type { InputParamsType, Fight, Character, Vehicle } from "../../types/types"
import { defaultCharacter } from "../../types/types"
import { CharactersActions, initialCharactersState, charactersReducer } from "../../reducers/charactersState"
import CharacterFilters from './CharacterFilters'
import { FightActions } from '../../reducers/fightState'

interface SelectCharacterProps {
  addCharacter: (character: Character | Vehicle) => Promise<void>
}

export default function SelectCharacter({ addCharacter }: SelectCharacterProps) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { fight, dispatch:dispatchFight } = useFight()

  const [state, dispatch] = useReducer(charactersReducer, initialCharactersState)
  const { open, anchorEl, loading, edited, faction, archetype, character, characters, character_type, factions, search, showHidden } = state

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getCharactersAndVehicles({ faction_id: faction.id, archetype, search, character_type, fight_id: fight?.id, show_all: showHidden })
        dispatch({ type: CharactersActions.CHARACTERS, payload: data })
      } catch(error) {
        toastError()
      }
    }
    if (user && edited) {
      reload().catch(() => toastError())
    }
  }, [edited, user, client, dispatch, search, archetype, faction, fight?.id, character_type, showHidden, toastError])

  const handleOpen = async (event: React.SyntheticEvent<Element, Event>) => {
    dispatch({ type: CharactersActions.RESET })
    dispatch({ type: CharactersActions.OPEN, payload: event.target as Element })
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: CharactersActions.UPDATE, name: "showHidden", value: checked })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: Character) => {
    dispatch({ type: CharactersActions.CHARACTER, payload: value })
  }

  const handleClose = () => {
    dispatch({ type: CharactersActions.RESET })
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    if (!character?.id) return

    await addCharacter(character)
    dispatch({ type: CharactersActions.RESET_CHARACTER })
  }

  return (
    <>
      <Button variant="contained" color="secondary" endIcon={<PersonIcon />} startIcon={<DirectionsCarFilledIcon />} onClick={handleOpen}>Select</Button>
      <Popover
        disableAutoFocus={true}
        disableEnforceFocus={true}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Box component="form" onSubmit={handleSubmit} p={2} sx={{background: colors.blueGrey[100]}}>
          <Stack direction="row" spacing={1}>
            <CharacterFilters state={state} dispatch={dispatch} />
            <Button disabled={!character?.id} type="submit" size="small" variant="contained">
              <PersonAddIcon />
            </Button>
            <GamemasterOnly user={user}>
              <FormControlLabel sx={{color: "black"}} label="All" control={<Switch checked={showHidden} />} onChange={show} />
            </GamemasterOnly>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
