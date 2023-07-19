import { Link, Stack, Box, Typography } from "@mui/material"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import { IoSkull, IoSkullOutline } from "react-icons/io5"
import DeathMarks from "./DeathMarks"
import EditButtons from "./EditButtons"
import Location from "../locations/Location"
import ImageDisplay from "./ImageDisplay"

import GamemasterOnly from "../GamemasterOnly"
import type { User, AuthSession, Character, Toast, Person, Vehicle } from "../../types/types"
import { useState } from "react"
import { useSession } from 'next-auth/react'
import { useClient } from "../../contexts/ClientContext"

interface NameDisplayProps {
  character: Character
  editCharacter: (character: Character) => void
  deleteCharacter: (character: Character) => void
  hideCharacter?: (character: Character | Vehicle) => Promise<void>
  showCharacter?: (character: Character | Vehicle) => Promise<void>
  hidden?: boolean
  shot: number
}

export default function NameDisplay({ character, editCharacter, deleteCharacter, hideCharacter, showCharacter, hidden, shot }: NameDisplayProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useClient()

  const showButtons = () => {
    if (user?.gamemaster) {
      setOpen(true)
      return
    }
    if (character?.user?.id == user?.id) {
      setOpen(true)
    }
  }

  const hideButtons = () => {
    setOpen(false)
  }

  const subheading = () => {
    if (!character.action_values["Archetype"] && !character.action_values["Death Marks"] && !character.faction) {
      return null
    }
    return (
      <Typography variant="caption" sx={{textTransform: "uppercase", color: "text.secondary"}}>
        { character.action_values["Archetype"] }
        { (character.action_values["Archetype"] && character.faction) && " - " }
        { character.faction?.name }
        &nbsp;
        <DeathMarks character={character} readOnly />
      </Typography>
    )
  }

  const link = character?.category == "vehicle" ? `/vehicles/${character.id}` : `/characters/${character.id}`

  return (
      <Box>
        <Box onMouseEnter={showButtons} onMouseLeave={hideButtons}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <ImageDisplay character={character} />
            <Typography variant="h4" sx={{fontWeight: 'bold', overflow: "hidden", textOverflow: "ellipsis", width: "100%"}}>
              <Link color="inherit" href={link} target="_blank">
                { character.name }
              </Link>
              <Location shot={shot} character={character} />
            </Typography>
            <GamemasterOnly user={user} character={character}>
              <Box visibility={open ? "visible" : "hidden"}>
                <EditButtons
                  character={character}
                  editCharacter={editCharacter}
                  deleteCharacter={deleteCharacter}
                  hideCharacter={hideCharacter}
                  showCharacter={showCharacter}
                  hidden={hidden}
                />
              </Box>
            </GamemasterOnly>
          </Stack>
          { subheading() }
        </Box>
      </Box>
  )
}
