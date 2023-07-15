import { useState } from "react"
import { DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Person, Character, Fight, Toast, ActionValues } from "../../types/types"
import { FightActions } from "../../reducers/fightState"
import { StyledFormDialog, StyledTextField } from "../StyledFields"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

interface woundThresholdType {
  low: number,
  high: number,
}
interface woundThresholdsType {
  [key: string]: woundThresholdType,
}

const woundThresholds: woundThresholdsType = {
  "Boss": { "low": 40, "high": 45 },
  "Uber-Boss": { "low": 40, "high": 45 },
  "PC": { "low": 25, "high": 30 },
  "Ally": { "low": 25, "high": 30 },
  "Featured Foe": { "low": 25, "high": 30 },
}

export default function WoundsModal({open, setOpen, character }: WoundsModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [smackdown, setSmackdown] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const calculateImpairments = (originalWounds: number, newWounds: number): number => {
    const threshold = woundThresholds[character.action_values["Type"] as string]

    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"] as string)) {
      // a Boss and an Uber-Boss gain 1 point of Impairment when their Wounds
      // goes from < 40 to between 40 and 44
      if (originalWounds < threshold.low && newWounds >= threshold.low && newWounds <= threshold.high) {
        return 1
      }
      // and gain 1 point of Impairment when their Wounds go from
      // between 40 and 44 to > 45
      if (originalWounds >= threshold.low && originalWounds <= threshold.high && newWounds > 45) {
        return 1
      }
      // and gain 2 points of Impairment when their Wounds go from
      // < 40 to >= 45
      if (originalWounds < threshold.low && newWounds >= threshold.high) {
        return 2
      }
    }

    // A PC, Ally, Featured Foe gain 1 point of Impairment when their Wounds
    // go from < 25 to between 25 and 30
    if (originalWounds < threshold.low && newWounds >= threshold.low && newWounds <= threshold.high) {
      return 1
    }
    // and gain 1 point of Impairment when their Wounds go from
    // between 25 and 29 to >= 30
    if (originalWounds >= threshold.low && originalWounds < threshold.high && newWounds >= 30) {
      return 1
    }
    // and gain 2 points of Impairment when their Wounds go from
    // < 25 to >= 35
    if (originalWounds < threshold.low && newWounds >= threshold.high) {
      return 2
    }

    return 0
  }

  const calculateWounds = (): number => {
    const toughness = Math.max(0, (character.action_values["Toughness"] || 0) - character.impairments)
    const result = smackdown - toughness

    if (result >= 0) {
      return result
    }
    return 0
  }

  const calculateNewTotal = (smackdown: number) => {
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
      await client.updateCharacter({ ...character, count: newWounds, impairments: impairments, "action_values": actionValues}, fight)
      dispatchFight({ type: FightActions.EDIT })
      setSmackdown(0)
      setOpen(false)
      toastSuccess(`${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`)
    } catch(error) {
      toastError()
    }
  }
  const cancelForm = () => {
    setSmackdown(0)
    setOpen(false)
  }
  const label = "Smackdown"

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      onSubmit={submitWounds}
      saving={saving}
      onCancel={cancelForm}
    >
      <StyledTextField autoFocus type="number" label={label} required name="wounds" value={smackdown || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}
