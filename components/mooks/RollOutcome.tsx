import { Grid, Tooltip, Typography } from '@mui/material'
import type { AttackRollType } from "../../services/ActionService"

export interface RollOutcomeParams {
  attackRoll: AttackRollType
}

export default function RollOutcome({ attackRoll }: RollOutcomeParams) {
  const style = (attackRoll.success) ? {color: "red", fontWeight: "bold"} : {}

  return (
    <Grid item xs={2}>
      <Typography sx={style} variant='h5'>
        {attackRoll.actionResult}
      </Typography>
    </Grid>
  )
}
