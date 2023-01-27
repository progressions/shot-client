import { Link, Stack, Box, Typography } from "@mui/material"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import { IoSkull, IoSkullOutline } from "react-icons/io5"
import DeathMarks from "./DeathMarks"
import EditButtons from "./EditButtons"

import GamemasterOnly from "../GamemasterOnly"
import type { Character, Toast, Person, Vehicle } from "../../types/types"
import { useState } from "react"
import { useSession } from 'next-auth/react'

interface NameDisplayProps {
  character: Character
  editCharacter: (character: Character) => void
  deleteCharacter: (character: Character) => void
}

export default function NameDisplay({ character, editCharacter, deleteCharacter }: NameDisplayProps) {
  const [open, setOpen] = useState<boolean>(false)
  const session: any = useSession({ required: true })

  const showButtons = () => {
    if (session?.data?.user?.gamemaster) {
      setOpen(true)
      return
    }
    if (character?.user?.id == session?.data?.user?.id) {
      setOpen(true)
    }
  }

  const hideButtons = () => {
    setOpen(false)
  }

  const subheading = () => {
    if (character.category !== "character" || character.action_values["Type"] !== "PC") {
      return null
    }
    if (!character.action_values["Archetype"] && !character.action_values["Death Marks"]) {
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
              <Link color="inherit" href={`/characters/${character.id}`} target="_blank">
                { character.name }
              </Link>
            </Typography>
            <GamemasterOnly user={session?.data?.user} character={character}>
              <Box visibility={open ? "visible" : "hidden"}>
                <EditButtons character={character} editCharacter={editCharacter} deleteCharacter={deleteCharacter} />
              </Box>
            </GamemasterOnly>
          </Stack>
          { subheading() }
        </Box>
      </Box>
  )
}
