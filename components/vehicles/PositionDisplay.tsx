import { FaCarSide } from "react-icons/fa"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"

import { IconButton, Typography, Stack, Box } from "@mui/material"
import { Vehicle } from "../../types/types"
import VS from "../../services/VehicleService"
import { FightActions } from '../../reducers/fightState'

interface PositionDisplayProps {
  character: Vehicle
}

export default function PositionDisplay({ character }: PositionDisplayProps) {
  const { fight, dispatch } = useFight()
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()

  const spacing = VS.isNear(character) ? 1 : 10
  const pursuer = VS.isPursuer(character)
  const firstColor = pursuer ? (character.color || "secondary.main") : "inherit"
  const secondColor = !pursuer ? (character.color || "secondary.main") : "inherit"

  async function changePosition() {
    try {
      const updatedCharacter = await VS.changePosition(character)
      await client.updateVehicle(updatedCharacter, fight)
      toastSuccess(`${character.name} updated.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatch({ type: FightActions.EDIT })
  }

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>{pursuer ? "Pursuer" : "Evader" }</Typography>
        <Stack direction="row" spacing={spacing} alignItems="center">
          <Box color={firstColor}>
            <FaCarSide size={25} />
          </Box>
          <IconButton size="small" color="inherit" onClick={changePosition}>
            <ArrowForwardIcon />
          </IconButton>
          <Box color={secondColor}>
            <FaCarSide size={25} />
          </Box>
        </Stack>
      </Stack>
    </>
  )
}
