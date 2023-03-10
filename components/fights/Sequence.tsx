import { Stack, Button, Typography, IconButton, ButtonGroup } from "@mui/material"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import { Toast, Fight } from "../../types/types"
import { FightActions } from "../../reducers/fightState"

export default function Sequence() {
  const { client } = useClient()
  const { toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const addSequence = async () => {
    const updatedFight = fight
    updatedFight.sequence = updatedFight.sequence+1

    try {
      await client.updateFight(updatedFight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Sequence increased.`)
    } catch(error) {
      dispatch({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
    }
  }

  const minusSequence = async () => {
    const updatedFight = fight
    updatedFight.sequence = updatedFight.sequence-1

    try {
      await client.updateFight(updatedFight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Sequence decreased.`)
    } catch(error) {
      dispatch({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
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
