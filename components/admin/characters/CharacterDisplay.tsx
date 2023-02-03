import { TableRow, TableCell, Typography } from "@mui/material"
import Link from "next/link"
import { User, Character } from "../../../types/types"
import ActionValues from "../../characters/ActionValues"
import AvatarBadge from "../../characters/AvatarBadge"

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
          <Link color="text.primary" href={`/characters/${character.id}`}>
            {character.name}
          </Link> }
          { character.category === "vehicle" &&
            character.name }
        </Typography>
      </TableCell>
      <TableCell>{character.action_values["Type"]}</TableCell>
      <TableCell><ActionValues character={character} /></TableCell>
      <TableCell>{character.user?.first_name} {character.user?.last_name}</TableCell>
    </TableRow>
  )
}
