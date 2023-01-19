import { Tooltip, ButtonGroup, Button, IconButton } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Character, CharacterType } from "../../types/types"

interface EditButtonsProps {
  character: Character,
  editCharacter: (character: Character) => void
  deleteCharacter: (character: Character) => void
}

export default function EditButtons({ character, editCharacter, deleteCharacter }: EditButtonsProps) {
  return (
    <ButtonGroup size="small">
      <Tooltip title="Edit Character" arrow>
        <Button variant="contained" color="primary" onClick={() => {editCharacter(character)}}>
          <EditIcon />
        </Button>
      </Tooltip>
      { deleteCharacter &&
      <Tooltip title="Delete Character" arrow>
        <Button variant="contained" color="primary" onClick={() => deleteCharacter(character)}>
          <DeleteIcon />
        </Button>
      </Tooltip> }
    </ButtonGroup>
  )
}
