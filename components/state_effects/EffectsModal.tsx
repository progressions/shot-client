import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { Button, Dialog, DialogTitle, Box, TextField, MenuItem, DialogContent, DialogActions, IconButton, Stack } from "@mui/material"

import { useMemo, useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"

import type { Character, CharacterEffect } from "../../types/types"
import { defaultCharacterEffect } from "../../types/types"
import { FightActions } from '../../reducers/fightState'

interface EffectsModalProps {
  character: Character
}

export default function EffectsModal({ character }: EffectsModalProps) {
  const initialEffect = { ...defaultCharacterEffect, character_id: character?.id }
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
      { label: "Defense", value: "Defense" }
    ]

    if (character.category === "character") {
      return characterActionValues
    } else {
      return []
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
      toastSuccess(`Effect ${effect.title} added.`)
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
      <Dialog
        open={open}
        onClose={cancelForm}
        disableRestoreFocus
      >
        <Box component="form" onSubmit={handleSubmit} sx={{width: 400}}>
          <DialogTitle>Add Effect</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{paddingTop: 2}}>
              <Stack direction="row" spacing={1}>
              <TextField autoFocus label="Title" variant="filled" size="medium" sx={{paddingBottom: 2}} fullWidth required name="title" value={effect.title} onChange={handleChange} />
                <TextField label="Severity" name="severity" select fullWidth required value={effect.severity} onChange={handleChange}>
                  <MenuItem value="error">Danger</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                </TextField>
              </Stack>
              <TextField label="Description" fullWidth name="description" value={effect.description} onChange={handleChange} />
            </Stack>
            <Stack spacing={2} sx={{paddingTop: 2}} direction="row">
              <TextField label="Action Value" name="action_value" select fullWidth value={effect.action_value || ""} onChange={handleChange}>
                <MenuItem value="">None</MenuItem>
                {
                  actionValues.map(({label, value}) => <MenuItem key={value} value={value}>{label}</MenuItem>)
                }
              </TextField>
              <TextField label="Change" fullWidth name="change" value={effect.change || ""} onChange={handleChange} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack alignItems="flex-end" spacing={2} direction="row">
              <Button variant="contained" color="error" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
