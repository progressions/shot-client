import { Stack, Button } from "@mui/material"
import { StyledTextField } from "@/components/StyledFields"
import type { AttackState } from "@/reducers/attackState"
import type { ChaseState } from "@/reducers/chaseState"
import SS from "@/services/SharedService"
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CasinoIcon from '@mui/icons-material/Casino'

interface SwerveButtonProps {
  state: AttackState | ChaseState
  handleSwerve: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAttack: () => void
}

export default function SwerveButton({ state, handleSwerve, handleAttack }: SwerveButtonProps) {
  const { typedSwerve, edited, attacker } = state

  return (
    <>
      <Stack direction="row" spacing={5} alignItems="top">
        { !edited && !SS.isMook(attacker) &&
        <StyledTextField
          name="typedSwerve"
          value={typedSwerve || ""}
          onChange={handleSwerve}
          label="Swerve"
          type="number"
          InputProps={{sx: {height: 80, width: 120, fontSize: 50, fontWeight: "bold"}}}
        /> }
        { !edited &&
          <Button
            sx={{width: 400, fontSize: 20}}
            endIcon={typedSwerve ? <PlayArrowIcon /> : <CasinoIcon />}
            onClick={handleAttack}
            variant="contained"
            color="error"
          >
          { typedSwerve ? "Attack" : "Roll the Dice" }
        </Button>
        }
      </Stack>
    </>
  )
}
