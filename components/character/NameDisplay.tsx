import { Stack, Box, Typography } from "@mui/material"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import { IoSkull, IoSkullOutline } from "react-icons/io5"
import DeathMarks from "./DeathMarks"

import type { Character, Person, Vehicle } from "../../types/types"

interface NameDisplayProps {
  character: Character
}

export default function NameDisplay({ character }: NameDisplayProps) {
  return (
    <Box component="div" sx={{}}>
      <Typography variant="h4" sx={{fontWeight: 'bold', overflow: "hidden", textOverflow: "ellipsis"}}>
        { character.name }
      </Typography>
      <Typography variant="caption" sx={{textTransform: "uppercase", color: "text.secondary"}}>
        { character.action_values["Archetype"] }
        &nbsp;
        <DeathMarks character={character} readOnly />
      </Typography>
    </Box>
  )
}
