import { Box, Stack, IconButton, Typography, Link } from '@mui/material'
import type { Character, Vehicle } from "@/types/types"
import ClearIcon from '@mui/icons-material/Clear'
import ImageDisplay from "@/components/images/ImageDisplay"
import CS from "@/services/CharacterService"

interface MemberProps {
  character: Character
  removeCharacter: (character: Character | Vehicle) => void
}

export default function Member({ character, removeCharacter }: MemberProps) {
  const url = CS.isVehicle(character) ? `/vehicles/${character.id}` : `/characters/${character.id}`

  return (
    <>
      <Stack direction="row" alignItems="top" spacing={2}>
        <ImageDisplay entity={character} />
        <Box>
          <Typography variant="h6">
            <IconButton key="delete" onClick={() => removeCharacter(character)}>
              <ClearIcon />
            </IconButton>
            <Link color="inherit" underline="hover" href={url}>
              {character.name}
            </Link>
          </Typography>
          <Typography ml={5} variant="caption" sx={{textTransform: "uppercase", color: "text.secondary", fontSize: 15}}>
            { character.action_values["Archetype"] }
            { (character.action_values["Archetype"] && character.faction) && " - " }
            { character.faction?.name }
          </Typography>
        </Box>
      </Stack>
    </>
  )
}
