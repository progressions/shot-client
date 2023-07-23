import { ChaseState } from "../../reducers/chaseState"
import { Divider, Box, Grid, Typography, Stack } from "@mui/material"
import CS from "../../services/CharacterService"
import RollOutcome from "../attacks/RollOutcome"
import Smackdowns from "./Smackdowns"

interface MookResultsProps {
  state: ChaseState
  handleClose: () => void
}

export default function MookResults({ state, handleClose }: MookResultsProps) {
  const { swerve, mookResults } = state
  const { boxcars, result } = swerve

  const subtitleStyle = { fontSize: 14 }

  function statusMessage() {
    if (state.wayAwfulFailure) {
      return "Way Awful Failure!"
    }
    if (boxcars) {
      return "Boxcars! "
    }
  }

  return (
    <>
      <Box py={2}>
        <Grid container sx={{width: "100%"}}>
          {
            mookResults.map((attackRoll: ChaseState, index: number) => <RollOutcome state={attackRoll} key={index} />)
          }
        </Grid>
      </Box>
      <Divider />
      <Box py={2}>
        <Smackdowns state={state} handleClose={handleClose} />
      </Box>
    </>
  )
}
