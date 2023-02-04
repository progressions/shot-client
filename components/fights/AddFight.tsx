import { useState } from 'react'
import { Alert, Snackbar, Box, Paper, Stack, Typography, TextField, Button } from '@mui/material'
import Router from "next/router"
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Client from "../Client"

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import type { Fight, Toast } from "../../types/types"
import { defaultFight } from "../../types/types"
import { FightsStateType, FightsActionType, FightsActions } from './fightsState';

export default function AddFight() {
  const { jwt, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const { state, dispatch } = useFight()
  const { open, saving, fight } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: FightsActions.UPDATE_FIGHT, name: event.target.name, value: event.target.value })
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    dispatch({ type: FightsActions.SAVING })
    event.preventDefault()

    const response = await client.createFight(fight)
    if (response.status === 200) {
      cancelForm()
      dispatch({ type: FightsActions.EDIT })
      toastSuccess(`Fight ${fight.name} created.`)
    } else {
      toastError()
    }
  }

  const cancelForm = (): void => {
    dispatch({ type: FightsActions.RESET_FIGHT })
    dispatch({ type: FightsActions.CLOSE })
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
          <Button color="primary" variant="contained" endIcon={<KeyboardDoubleArrowDownIcon />} onClick={() => dispatch({ type: FightsActions.OPEN, payload: null })}>Add Fight</Button>
        </Stack>
      </>
    )
  }
}
