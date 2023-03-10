import { useState } from 'react'
import { Alert, Snackbar, Box, Paper, Stack, Typography, TextField, Button } from '@mui/material'
import Router from "next/router"
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Client from "../../utils/Client"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import type { Fight, Toast } from "../../types/types"
import { defaultFight } from "../../types/types"
import { FightsStateType, FightsActionType, FightsActions } from '../../reducers/fightsState';
import { FightStateType, FightActionType, FightActions } from '../../reducers/fightState';

interface AddFightProps {
  state: FightsStateType
  dispatch: React.Dispatch<FightsActionType>
}

export default function AddFight({ state:fightsState, dispatch:dispatchFights }: AddFightProps) {
  const { jwt, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const { state, dispatch } = useFight()
  const { open, saving, fight } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: FightActions.UPDATE_FIGHT, name: event.target.name, value: event.target.value })
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    dispatch({ type: FightActions.SAVING })
    event.preventDefault()

    try {
      await client.createFight(fight)
      cancelForm()
      dispatchFights({ type: FightsActions.EDIT })
      toastSuccess(`Fight ${fight.name} created.`)
    } catch(error) {
      toastError()
    }
  }

  const cancelForm = (): void => {
    dispatch({ type: FightActions.RESET })
    dispatch({ type: FightActions.CLOSE })
  }

  if (open) {
    return (
      <>
        <Box m={1} mb={4} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Stack direction="row" mb={1}>
              <Button color="primary" variant="outlined" endIcon={<KeyboardDoubleArrowUpIcon />} onClick={() => cancelForm()}>Add Fight</Button>
            </Stack>
            <Stack direction="row">
              <Typography variant="h4">Add Fight</Typography>
            </Stack>
            <Stack spacing={1}>
              <Stack>
                <TextField label="Fight" autoFocus required name="name" value={fight.name} onChange={handleChange} />
              </Stack>
              <Stack spacing={2} direction="row">
                <Button color="primary" variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button color="primary" variant="contained" type="submit" disabled={saving}>Save Changes</Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </>
    )
  } else {
    return (
      <>
        <Stack direction="row" mb={1}>
          <Button color="primary" variant="contained" endIcon={<KeyboardDoubleArrowDownIcon />} onClick={() => dispatch({ type: FightActions.OPEN, payload: null })}>Add Fight</Button>
        </Stack>
      </>
    )
  }
}
