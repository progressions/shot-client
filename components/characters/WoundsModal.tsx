import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Person, Character, Fight, Toast, ActionValues } from "../../types/types"
import { FightActions } from '../../reducers/fightState'

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

const WoundsModal = ({open, setOpen, character }: WoundsModalParams) => {
  const { fight, dispatch:dispatchFight } = useFight()
  const [smackdown, setSmackdown] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const calculateImpairments = (originalWounds: number, newWounds: number): number => {
    if (character.action_values["Type"] === "Mook") { return 0 }

    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"] as string)) {
      // a Boss and an Uber-Boss gain 1 point of Impairment when their Wounds
      // goes from < 40 to between 40 and 44
      if (originalWounds < 40 && newWounds >= 40 && newWounds <= 45) {
        return 1
      }
      // and gain 1 point of Impairment when their Wounds go from
      // between 40 and 44 to > 45
      if (originalWounds >= 40 && originalWounds <= 45 && newWounds > 45) {
        return 1
      }
      // and gain 2 points of Impairment when their Wounds go from
      // < 40 to >= 45
      if (originalWounds < 40 && newWounds >= 45) {
        return 2
      }
    }

    // A PC, Ally, Featured Foe gain 1 point of Impairment when their Wounds
    // go from < 25 to between 25 and 30
    if (originalWounds < 25 && newWounds >= 25 && newWounds <= 30) {
      return 1
    }
    // and gain 1 point of Impairment when their Wounds go from
    // between 25 and 29 to >= 30
    if (originalWounds >= 25 && originalWounds < 30 && newWounds >= 30) {
      return 1
    }
    // and gain 2 points of Impairment when their Wounds go from
    // < 25 to >= 35
    if (originalWounds < 25 && newWounds >= 30) {
      return 2
    }

    return 0
  }

  const calculateWounds = (): number => {
    if (character.action_values["Type"] === "Mook") {
      return smackdown
    }

    const result = smackdown - (character.action_values["Toughness"] || 0) + (character.impairments)

    if (result >= 0) {
      return result
    }
    return 0
  }

  const calculateNewTotal = (smackdown: number) => {
    if (character.action_values["Type"] === "Mook") {
      return (character.action_values["Wounds"] - smackdown)
    }

    return (character.action_values["Wounds"] + smackdown)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmackdown(parseInt(event.target.value))
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const originalWounds: number = character.action_values["Wounds"]

    const wounds: number = calculateWounds()
    const newWounds: number = calculateNewTotal(wounds)
    const actionValues: ActionValues = character.action_values
    actionValues['Wounds'] = newWounds

    const impairments = character.impairments + calculateImpairments(originalWounds, newWounds)

    try {
      await client.updateCharacter({ ...character, impairments: impairments, "action_values": actionValues}, fight)
      dispatchFight({ type: FightActions.EDIT })
      setSmackdown(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        toastSuccess(`${character.name} lost ${wounds} mooks.`)
      } else {
        toastSuccess(`${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`)
      }
    } catch(error) {
      toastError()
    }
  }
  const cancelForm = () => {
    setSmackdown(0)
    setOpen(false)
  }
  const label = (character.action_values["Type"] === "Mook") ? "Mooks" : "Smackdown"

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
          <TextField autoFocus type="number" label={label} required name="wounds" value={smackdown || ""} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default WoundsModal
