import { FaCarSide } from "react-icons/fa"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { Typography, Stack, Box } from "@mui/material"
import { Vehicle } from "../../types/types"

interface PositionDisplayProps {
  character: Vehicle
}

export default function PositionDisplay({ character }: PositionDisplayProps) {
  const spacing = (character.action_values["Position"] === "near") ? 1 : 3
  const pursuer = character.action_values["Pursuer"] == "true"
  const firstColor = pursuer ? (character.color || "secondary.main") : "inherit"
  const secondColor = !pursuer ? (character.color || "secondary.main") : "inherit"

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Typography>{pursuer ? "Pursuer" : "Evader" }</Typography>
        <Stack direction="row" spacing={spacing}>
          <Box color={firstColor}>
            <FaCarSide size={20} />
          </Box>
          <ArrowForwardIcon />
          <Box color={secondColor}>
            <FaCarSide size={20} />
          </Box>
        </Stack>
      </Stack>
    </>
  )
}
