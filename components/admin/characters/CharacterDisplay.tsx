import { Link, TableRow, TableCell, Typography } from "@mui/material"
import { User, Character } from "@/types/types"
import ActionValues from "@/components/characters/ActionValues"
import AvatarBadge from "@/components/characters/AvatarBadge"
import CS from "@/services/CharacterService"

interface CharacterDisplayProps {
  character: Character
  user: User
}

export default function CharacterDisplay({ character, user }: CharacterDisplayProps) {
  return (
    <TableRow key={character.id}>
      <TableCell sx={{width: 50}}>
        <AvatarBadge character={character} user={user} />
      </TableCell>
      <TableCell sx={{width: 200}}>
        <Typography variant="h5">
          { character.category === "character" &&
          <Link underline="hover" color="inherit" href={`/characters/${character.id}`}>
            {character.name}
          </Link> }
          { character.category === "vehicle" &&
          <Link underline="hover" color="inherit" href={`/vehicles/${character.id}`}>
            {character.name}
          </Link> }
        </Typography>
      </TableCell>
      <TableCell>{CS.type(character)}</TableCell>
      <TableCell>{CS.archetype(character)}</TableCell>
      <TableCell>{CS.faction(character)?.name}</TableCell>
      <TableCell>{character.user?.first_name} {character.user?.last_name}</TableCell>
    </TableRow>
  )
}
