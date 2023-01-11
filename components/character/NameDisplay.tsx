import { Stack, Box, Typography } from "@mui/material"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"

import type { Character, Person, Vehicle } from "../../types/types"

interface NameDisplayProps {
  character: Character
}

export default function NameDisplay({ character }: NameDisplayProps) {
  return (
    <Box component="div" sx={{width: 200, textOverflow: "ellipsis"}}>
      <Typography variant="h4" sx={{fontWeight: 'bold', overflow: "hidden", textOverflow: "ellipsis"}}>
        { character.name }
        { character.category === "vehicle" &&
          <DirectionsCarIcon sx={{color: "#aaa"}} /> }
      </Typography>
    </Box>
  )
}
