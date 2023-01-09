import { useState } from 'react'
import { Alert, Snackbar, Box, Paper, Stack, Typography, TextField, Button } from '@mui/material'
import Router from "next/router"
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { useSession } from 'next-auth/react'
import Client from "./Client"

import type { Fight } from "../types/types"
import { loadFights } from "./FightDetail"

interface AddFightProps {
  setFights: (fights: Fight[]) => void,
  setToast: any
}

export default function AddFight({ setFights, setToast }) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [open, setOpen] = useState<boolean>(false)
  const [fight, setFight] = useState<Fight>({name: ''})
  const [saving, setSaving] = useState<boolean>(false);

  const handleChange = (event: any): void => {
    setFight({ name: event.target.value })
  }

  const handleSubmit = async (event: any): Promise<void> => {
    setSaving(true)
    event.preventDefault()

    const response = await client.createFight(fight)
    if (response.status === 200) {
      setSaving(false)
      cancelForm()
      setToast({ open: true, message: `Fight ${fight.name} created.`, severity: "success" })
      loadFights({ jwt, setFights })
    }
  }

  const cancelForm = (): void => {
    setFight({name: ''})
    setToast((prevToast) => { return { ...prevToast, open: false }})
    setOpen(false)
  }

  if (open) {
    return (
      <>
        <Box m={1} mb={4} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Stack direction="row" mb={1}>
              <Button variant="outlined" endIcon={<KeyboardDoubleArrowUpIcon />} onClick={() => cancelForm()}>Add Fight</Button>
            </Stack>
            <Stack direction="row">
              <Typography variant="h4">Add Fight</Typography>
            </Stack>
            <Stack spacing={1}>
              <Stack>
                <TextField label="Fight" autoFocus required name="name" value={fight.name} onChange={handleChange} />
              </Stack>
              <Stack spacing={2} direction="row">
                <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
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
          <Button variant="outlined" endIcon={<KeyboardDoubleArrowDownIcon />} onClick={() => setOpen(true)}>Add Fight</Button>
        </Stack>
      </>
    )
  }
}
