import { MenuItem, Box, Dialog, DialogTitle, DialogContent, DialogContentText, Stack, Button, TextField } from "@mui/material"
import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"

import type { Toast, Effect, Fight } from "../../types/types"
import { defaultEffect } from "../../types/types"

interface EffectModalProps {
  shot: number
  open: boolean
  setOpen: any
}

export default function EffectModal({ shot, open, setOpen }: EffectModalProps) {
  const { fight, reloadFight } = useFight()

  const initialEffect = { ...defaultEffect, start_sequence: fight.sequence, end_sequence: fight.sequence+1, start_shot: shot, end_shot: shot }

  const [effect, setEffect] = useState<Effect>(initialEffect)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const { client } = useClient()

  const cancelForm = () => {
    setEffect(initialEffect)
    setOpen(false)
  }

  const handleSubmit = async (event: any) => {
    setSaving(true)
    event.preventDefault()

    const response = await client.createEffect(effect, fight)
    if (response.status === 200) {
      const data = await response.json()
      setEffect(data)
      if (reloadFight) {
        await reloadFight(fight)
        toastSuccess(`Effect ${effect.title} added.`)
      }
    } else {
      toastError()
    }
    cancelForm()
    setSaving(false)
  }

  const handleChange = (event: any) => {
    setEffect((prev: Effect) => { return { ...prev, [event.target.name]: event.target.value } })
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={cancelForm}
        disableRestoreFocus
      >
        <DialogTitle>Add Effect</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{width: 400}}>
            <Stack spacing={2}>
              <TextField autoFocus label="Title" variant="filled" size="medium" sx={{paddingBottom: 2}} fullWidth required name="title" value={effect.title} onChange={handleChange} />
              <TextField label="Description" fullWidth name="description" value={effect.description} onChange={handleChange} />
              <Stack direction="row" spacing={1}>
                <TextField label="First Sequence" name="start_sequence" type="number" fullWidth required value={effect.start_sequence} onChange={handleChange} />
                <TextField label="Last Sequence" name="end_sequence" type="number" fullWidth required value={effect.end_sequence} onChange={handleChange} />
                <TextField label="Severity" name="severity" select fullWidth required value={effect.severity} onChange={handleChange}>
                  <MenuItem value="error">Danger</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                </TextField>
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField label="First Shot" type="number" name="start_shot" fullWidth required value={effect.start_shot} onChange={handleChange} />
                <TextField label="Last Shot" type="number" name="end_shot" fullWidth required value={effect.end_shot} onChange={handleChange} />
              </Stack>
              <Stack alignItems="flex-end" spacing={2} direction="row">
                <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
