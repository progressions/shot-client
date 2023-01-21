import { Stack, Button, Typography, IconButton, ButtonGroup } from "@mui/material"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useSession } from 'next-auth/react'
import Client from "../Client"

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import { Toast, Fight } from "../../types/types"

export default function Sequence() {
  const { client } = useClient()
  const { toastSuccess } = useToast()
  const { fight, setFight, reloadFight } = useFight()

  const addSequence = async () => {
    const updatedFight = fight
    updatedFight.sequence = updatedFight.sequence+1

    const response = await client.updateFight(updatedFight)
    if (response.status === 200) {
      await reloadFight(fight)
      toastSuccess(`Sequence increased.`)
    }
  }

  const minusSequence = async () => {
    const updatedFight = fight
    updatedFight.sequence = updatedFight.sequence-1

    const response = await client.updateFight(updatedFight)
    if (response.status === 200) {
      await reloadFight(fight)
      toastSuccess(`Sequence decreased.`)
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
