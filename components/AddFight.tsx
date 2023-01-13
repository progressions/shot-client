import { useState } from 'react'
import { Alert, Snackbar, Box, Paper, Stack, Typography, TextField, Button } from '@mui/material'
import Router from "next/router"
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { useSession } from 'next-auth/react'
import Client from "./Client"

import type { Fight, Toast } from "../types/types"
import { defaultFight } from "../types/types"
import { loadFights } from "./fights/FightDetail"

interface AddFightProps {
  setFights: React.Dispatch<React.SetStateAction<Fight[]>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function AddFight({ setFights, setToast }: AddFightProps) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [open, setOpen] = useState<boolean>(false)
  const [fight, setFight] = useState<Fight>(defaultFight)
  const [saving, setSaving] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFight((prev: Fight) => ({ ...prev, name: event.target.value }))
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
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
    setFight(defaultFight)
    setToast((prevToast: Toast) => { return { ...prevToast, open: false }})
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
