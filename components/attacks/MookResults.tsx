import { AttackState } from "@/reducers/attackState"
import { Typography, Stack } from "@mui/material"
import CS from "@/services/CharacterService"

interface MookResultsProps {
  state: AttackState
}

export default function MookResults({ state }: MookResultsProps) {
  const { weapon, outcome, wounds, success, attacker, target, defense, swerve,
    stunt, typedSwerve, edited, smackdown, toughness, actionValueName, actionValue,
    modifiedActionValue, modifiedDefense, actionResult, mookDefense, count } = state
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

  if (!success && !actionValueName && mookDefense) {
    return (<>
      <Typography variant="h4">{ statusMessage() } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + Action Value { modifiedActionValue } &lt; { target.name ? `${target.name}'s` : "" } Defense { mookDefense }
      </Typography>
    </>)
  }

  if (!success && actionValueName && mookDefense) {
    return (<>
      <Typography variant="h4">{ statusMessage() } Miss!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue } &lt; { target.name ? `${target.name}'s` : "" } Defense { mookDefense }
      </Typography>
    </>)
  }

  if (success && actionValueName && mookDefense) {
    return (<>
      <Typography variant="h4">{ statusMessage() } Hit! { attacker.name || "You" } took out { count } { count == 1 ? "Mook" : "Mooks"}!</Typography>
      <Typography variant="subtitle1" sx={subtitleStyle}>
        Swerve { result } + { actionValueName } { modifiedActionValue } - Defense { mookDefense }
      </Typography>
    </>)
  }

  return (
    <><p>Hello</p></>
  )
}
