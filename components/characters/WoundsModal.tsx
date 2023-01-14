import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import type { Person, Character, Fight, Toast, ActionValues } from "../../types/types"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

const WoundsModal = ({open, setOpen, character }: WoundsModalParams) => {
  const [fight, setFight] = useFight()
  const [smackdown, setSmackdown] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { setToast } = useToast()

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

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

    const wounds: number = calculateWounds()
    const newWounds: number = calculateNewTotal(wounds)
    const actionValues: ActionValues = character.action_values
    actionValues['Wounds'] = newWounds

    const response = await client.updateCharacter({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setSmackdown(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        setToast({ open: true, message: `${character.name} lost ${wounds} mooks.`, severity: "success" })
      } else {
        setToast({ open: true, message: `${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`, severity: "success" })
      }
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
          <TextField autoFocus type="number" label={label} required name="wounds" value={smackdown} onChange={handleChange} />
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
