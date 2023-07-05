import { IconButton, Typography, Link } from '@mui/material'
import type { Character, Vehicle } from "../../types/types"
import ClearIcon from '@mui/icons-material/Clear'

interface MemberProps {
  character: Character
  removeCharacter: (character: Character | Vehicle) => void
}

export default function Member({ character, removeCharacter }: MemberProps) {
  return (
    <Typography mb={1}>
      <IconButton key="delete" onClick={() => removeCharacter(character)}>
        <ClearIcon />
      </IconButton>
      <Link color="inherit" underline="hover" href={`/characters/${character.id}`}>
        {character.name}
      </Link>
    </Typography>
  )
}
