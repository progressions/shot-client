import { MookResult, AttackState } from "@/reducers/attackState"
import { Divider, Box, Grid, Typography, Stack } from "@mui/material"
import CS from "@/services/CharacterService"
import RollOutcome from "@/components/attacks/RollOutcome"
import Smackdowns from "@/components/attacks/Smackdowns"

interface MookResultsProps {
  state: AttackState
  handleClose: () => void
}

export default function MookResults({ state, handleClose }: MookResultsProps) {
  const { weapon, outcome, wounds, success, attacker, target, defense, swerve,
    stunt, typedSwerve, edited, smackdown, toughness, actionValueName, actionValue,
    modifiedActionValue, modifiedDefense, actionResult, mookDefense, count,
    mookResults } = state
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
            mookResults.map((attackRoll: MookResult, index: number) => <RollOutcome result={attackRoll} key={index} />)
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
