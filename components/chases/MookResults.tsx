import { ChaseState } from "@/reducers/chaseState"
import { Typography, Stack } from "@mui/material"
import CS from "@/services/CharacterService"

interface MookResultsProps {
  state: ChaseState
}

export default function MookResults({ state }: MookResultsProps) {
  const { actionValue, attacker, target, success, swerve, actionResult, mookDefense,
    count } = state
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

  if (!success) {
    return (<>
      <Typography variant="h4">{ statusMessage() } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Driving { actionValue } &lt; { target.name ? `${target.name}'s` : "" } Driving { mookDefense }
      </Typography>
    </>)
  }

  if (success) {
    return (<>
      <Typography variant="h4">{ statusMessage() } Hit! { attacker.name || "You" } took out { count } { count == 1 ? "Mook" : "Mooks"}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Driving { actionValue } - Driving { mookDefense }
      </Typography>
    </>)
  }

  return (
    <><p>Hello</p></>
  )
}
