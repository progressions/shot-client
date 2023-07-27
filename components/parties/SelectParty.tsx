import { Typography, colors, FormControlLabel, Switch, Stack, Popover, Box, Button } from '@mui/material'
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { useEffect, useReducer } from 'react'

import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import type { InputParamsType, Party, Fight } from "../../types/types"
import { PartiesActions, initialPartiesState, partiesReducer } from "../../reducers/partiesState"
import { FightActions } from '../../reducers/fightState'
import PartyAutocomplete from "./PartyAutocomplete"

export default function SelectParty() {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { fight, dispatch:dispatchFight } = useFight()

  const [state, dispatch] = useReducer(partiesReducer, initialPartiesState)
  const { open, anchorEl, loading, edited, party } = state

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getParties()
        dispatch({ type: PartiesActions.PARTIES, payload: data })
      } catch(error) {
        toastError()
      }
    }
    if (user && edited) {
      reload().catch(() => toastError())
    }
  }, [user, client, toastError, edited])

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: PartiesActions.RESET })
    dispatch({ type: PartiesActions.OPEN, payload: event.target as Element })
  }

  const handleClose = () => {
    dispatch({ type: PartiesActions.RESET })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!party?.id) {
      toastError("You must select a party.")
      return
    }

    try {
      await client.addPartyToFight(party, fight)
      toastSuccess(`${party.name} added.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatchFight({ type: FightActions.EDIT })
  }

  return (
    <>
      <Button variant="contained" color="highlight" startIcon={<PeopleAltIcon />} onClick={handleOpen}>Party</Button>
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
            <PartyAutocomplete state={state} dispatch={dispatch} />
            <Button disabled={!party?.id} type="submit" size="small" variant="contained">
              <GroupAddIcon />
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
