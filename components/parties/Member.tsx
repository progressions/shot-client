import { Typography, Link } from '@mui/material'
import type { Character } from "../../types/types"

interface MemberProps {
  character: Character
}

export default function Member({ character }: MemberProps) {
  return (
    <Typography mb={1}>
      <Link color="inherit" underline="hover" href={`/characters/${character.id}`}>
        {character.name}
      </Link>
    </Typography>
  )
}
