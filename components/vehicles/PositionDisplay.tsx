import { FaCarSide } from "react-icons/fa"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { Stack, Box } from "@mui/material"

export default function PositionDisplay({ character }) {
  const spacing = (character.action_values["Position"] === "near") ? 1 : 3
  const pursuer = character.action_values["Pursuer"] == "true"
  const firstColor = pursuer ? (character.color || "secondary.main") : "inherit"
  const secondColor = !pursuer ? (character.color || "secondary.main") : "inherit"

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box>{pursuer ? "Pursuer" : "Evader" }</Box>
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
