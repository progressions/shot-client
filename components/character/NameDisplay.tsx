import { Stack, Box, Typography } from "@mui/material"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import { IoSkull, IoSkullOutline } from "react-icons/io5"
import DeathMarks from "./DeathMarks"
import EditButtons from "./EditButtons"

import type { Character, Toast, Person, Vehicle } from "../../types/types"
import { useState } from "react"

interface NameDisplayProps {
  character: Character
  editCharacter: (character: Character) => void
  deleteCharacter: (character: Character) => void
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function NameDisplay({ character, editCharacter, deleteCharacter, setToast }: NameDisplayProps) {
  const [open, setOpen] = useState<boolean>(false)

  const showButtons = () => {
    setOpen(true)
  }

  const hideButtons = () => {
    setOpen(false)
  }

  const subheading = () => {
    if (character.category !== "character" || character.action_values["Type"] !== "PC") {
      return null
    }
    return (
      <Typography variant="caption" sx={{textTransform: "uppercase", color: "text.secondary"}}>
        { character.action_values["Archetype"] }
        &nbsp;
        <DeathMarks character={character} readOnly />
      </Typography>
    )
  }

  return (
    <Box>
      <Box onMouseEnter={showButtons} onMouseLeave={hideButtons}>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography variant="h4" sx={{fontWeight: 'bold', overflow: "hidden", textOverflow: "ellipsis", width: "100%"}}>
            { character.name }
          </Typography>
          <Box visibility={open ? "visible" : "hidden"}>
            <EditButtons character={character} editCharacter={editCharacter} deleteCharacter={deleteCharacter} setToast={setToast} />
          </Box>
        </Stack>
        { subheading() }
      </Box>
    </Box>
  )
}
