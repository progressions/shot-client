import { MenuItem, Box, Dialog, DialogTitle, DialogContent, DialogContentText, Stack, Button, TextField } from "@mui/material"
import { useState } from "react"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"

import type { Toast, Effect, Fight } from "@/types/types"
import { defaultEffect } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"

interface EffectModalProps {
  shot: number
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EffectModal({ shot, open, setOpen }: EffectModalProps) {
  const { fight, dispatch } = useFight()

  const initialEffect = { ...defaultEffect, start_sequence: fight.sequence, end_sequence: fight.sequence+1, start_shot: shot, end_shot: shot }

  const [effect, setEffect] = useState<Effect>(initialEffect)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const { client } = useClient()

  const cancelForm = () => {
    setEffect(initialEffect)
    setOpen(false)
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaving(true)
    event.preventDefault()

    try {
      const data = await client.createEffect(effect, fight)
      setEffect(data)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Effect ${effect.name} added.`)
    } catch(error)  {
      toastError()
    }
    cancelForm()
    setSaving(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEffect((prev: Effect) => { return { ...prev, [event.target.name]: event.target.value } })
  }

  return (
    <>
      <StyledFormDialog
        open={open}
        onClose={cancelForm}
        disableRestoreFocus
        title="Add Effect"
        onSubmit={handleSubmit}
        onCancel={cancelForm}
        saving={saving}
      >
        <StyledTextField autoFocus label="Name" variant="filled" size="medium" sx={{paddingBottom: 2}} fullWidth required name="name" value={effect.name} onChange={handleChange} />
        <StyledTextField label="Description" fullWidth name="description" value={effect.description} onChange={handleChange} />
        <Stack direction="row" spacing={1}>
          <StyledTextField label="First Sequence" name="start_sequence" type="number" fullWidth required value={effect.start_sequence} onChange={handleChange} />
          <StyledTextField label="Last Sequence" name="end_sequence" type="number" fullWidth required value={effect.end_sequence} onChange={handleChange} />
          <StyledTextField label="Severity" name="severity" select fullWidth required value={effect.severity} onChange={handleChange}>
            <MenuItem value="error">Danger</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="success">Success</MenuItem>
          </StyledTextField>
        </Stack>
        <Stack direction="row" spacing={1}>
          <StyledTextField label="First Shot" type="number" name="start_shot" fullWidth required value={effect.start_shot} onChange={handleChange} />
          <StyledTextField label="Last Shot" type="number" name="end_shot" fullWidth required value={effect.end_shot} onChange={handleChange} />
        </Stack>
      </StyledFormDialog>
    </>
  )
}
