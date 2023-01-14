import { Stack, Button, Typography, IconButton, ButtonGroup } from "@mui/material"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useSession } from 'next-auth/react'
import Client from "../Client"

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

import { loadFight } from "./FightDetail"

import { Toast, Fight } from "../../types/types"

export default function Sequence() {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const { setToast } = useToast()
  const [fight, setFight] = useFight()

  const addSequence = async () => {
    const updatedFight = fight
    updatedFight.sequence = updatedFight.sequence+1

    const response = await client.updateFight(updatedFight)
    if (response.status === 200) {
      await loadFight({jwt, id: updatedFight.id as string, setFight})
      setToast({ open: true, message: `Sequence increased`, severity: "success" })
    }
  }

  const minusSequence = async () => {
    const updatedFight = fight
    updatedFight.sequence = updatedFight.sequence-1

    const response = await client.updateFight(updatedFight)
    if (response.status === 200) {
      await loadFight({jwt, id: updatedFight.id as string, setFight})
      setToast({ open: true, message: `Sequence decreased`, severity: "success" })
    }
  }

  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="h4">
        Sequence {fight.sequence}
      </Typography>
      <ButtonGroup>
        <Button size="small" onClick={minusSequence}>
          <RemoveIcon />
        </Button>
        <Button variant="contained" size="small" onClick={addSequence}>
          <AddIcon />
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
