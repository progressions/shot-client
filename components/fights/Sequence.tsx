import { Grid, Stack, Box, Button, Typography, IconButton, ButtonGroup } from "@mui/material"

import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import RollInitiative from "@/components/fights/RollInitiative"
import Initiative from "@/components/initiative/Initiative"
import Locations from "@/components/fights/Locations"
import EventsLog from "@/components/fights/events/EventsLog"
import GamemasterOnly from "@/components/GamemasterOnly"
import { Toast, Fight } from "@/types/types"
import { FightActions } from "@/reducers/fightState"

export default function Sequence() {
  const { user, client } = useClient()
  const { toastSuccess } = useToast()
  const { fight, dispatch } = useFight()

  const addSequence = async () => {
    const updatedFight = { id: fight.id, sequence: fight.sequence + 1 } as Fight

    try {
      await client.updateFight(updatedFight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Sequence increased.`)
    } catch (error) {
      dispatch({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
    }
  }

  const minusSequence = async () => {
    const updatedFight = { id: fight.id, sequence: fight.sequence - 1 } as Fight

    try {
      await client.updateFight(updatedFight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Sequence decreased.`)
    } catch (error) {
      dispatch({ type: FightActions.ERROR, payload: error as Error })
      console.error(error)
    }
  }

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Stack direction="row" width="290px" spacing={2}>
          <Typography variant="h4">
            Sequence {fight.sequence}
          </Typography>
          <GamemasterOnly user={user}>
            <ButtonGroup>
              <Button size="small" onClick={minusSequence}>
                <RemoveIcon />
              </Button>
              <Button variant="contained" size="small" onClick={addSequence}>
                <AddIcon />
              </Button>
            </ButtonGroup>
          </GamemasterOnly>
        </Stack>
      </Grid>
      <Grid item xs>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" width="100%">
          <Stack direction="row" spacing={2}>
            <GamemasterOnly user={user}>
              <RollInitiative />
              <Initiative />
            </GamemasterOnly>
          </Stack>
          <Stack direction="row" spacing={2}>
            <EventsLog />
            <Locations />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  )
}
