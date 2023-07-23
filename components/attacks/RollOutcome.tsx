import { Grid, Tooltip, Typography } from '@mui/material'
import type { AttackState } from "../../reducers/attackState"
import type { ChaseState } from "../../reducers/chaseState"

export interface RollOutcomeParams {
  state: AttackState | ChaseState
}

export default function RollOutcome({ state }: RollOutcomeParams) {
  const { success, actionResult } = state

  const style = (success) ? {color: "red", fontWeight: "bold"} : {}

  return (
    <Grid item xs={2}>
      <Typography sx={style} variant='h5'>
        { actionResult }
      </Typography>
    </Grid>
  )
}
