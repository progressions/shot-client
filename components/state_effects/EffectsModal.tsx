import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { Button, Dialog, DialogTitle, Box, TextField, MenuItem, DialogContent, DialogActions, IconButton, Stack } from "@mui/material"

import { useMemo, useState } from "react"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"

import type { Character, CharacterEffect } from "@/types/types"
import { defaultCharacterEffect } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"

interface EffectsModalProps {
  character: Character
}

export default function EffectsModal({ character }: EffectsModalProps) {
  const initialEffect = { ...defaultCharacterEffect, shot_id: character.shot_id }
  if (character.category === "character") {
    initialEffect.character_id = character.id
    initialEffect.vehicle_id = undefined
  } else {
    initialEffect.vehicle_id = character.id
    initialEffect.character_id = undefined
  }
  const { fight, dispatch:dispatchFight } = useFight()

  const [open, setOpen] = useState(false)
  const [effect, setEffect] = useState<CharacterEffect>(initialEffect)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  const cancelForm = () => {
    setEffect(initialEffect)
    setOpen(false)
  }

  const actionValues = useMemo(() => {
    const characterActionValues = [
      { label: "Attack", value: "MainAttack" },
      { label: "Defense", value: "Defense" },
      { label: "Toughness", value: "Toughness" },
    ]
    const vehicleActionValues = [
      { label: "Acceleration", value: "Acceleration" },
      { label: "Handling", value: "Handling" },
      { label: "Frame", value: "Frame" },
    ]

    if (character.category === "character") {
      return characterActionValues
    } else {
      return vehicleActionValues
    }
  }, [character])

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaving(true)
    event.preventDefault()

    try {
      const data = await client.createCharacterEffect(effect, fight)
      setEffect(data)
      cancelForm()
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`Effect ${effect.name} added.`)
    } catch(error) {
      toastError()
      cancelForm()
    }
    setSaving(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEffect((prev: CharacterEffect) => { return { ...prev, [event.target.name]: event.target.value } })
  }

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <AddCircleOutlineOutlinedIcon />
      </IconButton>
      <StyledFormDialog
        open={open}
        onClose={cancelForm}
        disableRestoreFocus
        onSubmit={handleSubmit}
        title="Add Effect"
        saving={saving}
        onCancel={cancelForm}
      >
        <Stack direction="row" spacing={1}>
          <StyledTextField autoFocus label="Title" variant="filled" size="medium" sx={{paddingBottom: 2}} fullWidth required name="name" value={effect.name} onChange={handleChange} />
          <StyledTextField label="Severity" name="severity" select fullWidth required value={effect.severity} onChange={handleChange}>
            <MenuItem value="error">Danger</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="success">Success</MenuItem>
          </StyledTextField>
        </Stack>
        <StyledTextField label="Description" fullWidth name="description" value={effect.description} onChange={handleChange} />
        <Stack spacing={2} sx={{paddingTop: 2}} direction="row">
          <StyledTextField label="Action Value" name="action_value" select fullWidth value={effect.action_value || ""} onChange={handleChange}>
            <MenuItem value="">None</MenuItem>
            {
              actionValues.map(({label, value}) => <MenuItem key={value} value={value}>{label}</MenuItem>)
            }
          </StyledTextField>
          <StyledTextField label="Change" fullWidth name="change" value={effect.change || ""} onChange={handleChange} />
        </Stack>
      </StyledFormDialog>
    </>
  )
}
