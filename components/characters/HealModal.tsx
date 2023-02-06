import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import Client from "../../utils/Client"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Person, Character, Fight, Toast, ActionValues } from "../../types/types"
import { FightActions } from '../../reducers/fightState'

interface HealModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function HealModal({open, setOpen, character }: HealModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [healing, setHealing] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  const calculateImpairments = (originalWounds: number, newWounds: number): number => {
    if (character.action_values["Type"] === "Mook") { return 0 }

    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"] as string)) {
      // a Boss and an Uber-Boss lose 1 point of Impairment when their Wounds
      // go from above 45 to between 40 and 45
      if (originalWounds > 45 && newWounds >= 40 && newWounds <= 45) {
        return -1
      }
      // and lose 1 point of Impairment when their Wounds
      // go from between 40 and 45 to below 40
      if (originalWounds >= 40 && originalWounds <= 45 && newWounds < 40) {
        return -1
      }
      // and lose 2 points of Impairment when their Wounds go from
      // above 45 to below 40
      if (originalWounds >= 45 && newWounds < 40) {
        return -2
      }
    }

    // A PC, Ally, Featured Foe lose 1 point of Impairment when their Wounds
    // go from above 30 to between 25 and 30
    if (originalWounds > 30 && newWounds >= 25 && newWounds <= 30) {
      return -1
    }
    // and lose 1 point of Impairment when their Wounds go from
    // between 25 and 30 to below 25
    if (originalWounds >= 25 && originalWounds <= 30 && newWounds < 25) {
      return -1
    }
    // and lose 2 points of Impairment when their Wounds go from
    // >= 30 to < 25
    if (originalWounds >= 30 && newWounds < 25 ) {
      return -2
    }

    return 0
  }

  const calculateNewTotal = (woundsHealed: number) => {
    return (character.action_values["Wounds"] - woundsHealed)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHealing(parseInt(event.target.value))
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const originalWounds: number = character.action_values["Wounds"]
    const newWounds: number = calculateNewTotal(healing)
    const actionValues: ActionValues = character.action_values
    actionValues['Wounds'] = newWounds

    const impairments = character.impairments + calculateImpairments(originalWounds, newWounds)

    try {
      await client.updateCharacter({ ...character, impairments: impairments, "action_values": actionValues}, fight)
      dispatchFight({ type: FightActions.EDIT })
      setHealing(0)
      setOpen(false)
      toastSuccess(`${character.name} healed ${healing} Wounds.`)
    } catch(error) {
      toastError()
    }
  }
  const cancelForm = () => {
    setHealing(0)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Box component="form" onSubmit={submitWounds}>
        <Stack p={4} spacing={2}>
          <TextField autoFocus type="number" label="Heal Wounds" required name="healing" value={healing || ""} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}
