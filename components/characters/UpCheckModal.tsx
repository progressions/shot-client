import { useState } from "react"
import { DialogContent, Box, Stack, TextField, Typography, Button, Dialog } from "@mui/material"

import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import CS from "@/services/CharacterService"
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"

interface UpCheckModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function UpCheckModal({open, setOpen, character }: UpCheckModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [smackdown, setSmackdown] = useState<number>(0)
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmackdown(parseInt(event.target.value))
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const wounds = CS.calculateWounds(character, smackdown)
    const updatedCharacter = CS.takeSmackdown(character, smackdown)

    try {
      await client.updateCharacter(updatedCharacter, fight)
      dispatchFight({ type: FightActions.EDIT })
      setSmackdown(0)
      setOpen(false)
      toastSuccess(`${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
  }
  const cancelForm = () => {
    setSmackdown(0)
    setOpen(false)
  }
  const label = "Up Check"

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      onSubmit={submitWounds}
      onCancel={cancelForm}
      width="xs"
    >
      <Typography>
        Add 1 Mark of Death for each Fortune die rolled.
      </Typography>
      <StyledTextField autoFocus type="number" label={label} required name="wounds" value={smackdown || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}
