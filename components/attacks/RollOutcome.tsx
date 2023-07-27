import { Grid, Tooltip, Typography } from '@mui/material'
import type { MookResult } from "../../reducers/attackState"
import type { ChaseState } from "../../reducers/chaseState"

export interface RollOutcomeParams {
  result: MookResult
}

export default function RollOutcome({ result }: RollOutcomeParams) {
  const { success, actionResult } = result

  const style = (success) ? {color: "red", fontWeight: "bold"} : {}

  return (
    <Grid item xs={2}>
      <Typography sx={style} variant='h5'>
        { actionResult }
      </Typography>
    </Grid>
  )
}
