import { Tooltip, ButtonGroup, Button, IconButton } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Character, CharacterType, Toast } from "../../types/types"

interface EditButtonsProps {
  character: Character,
  editCharacter: (character: Character) => void
  deleteCharacter: (character: Character) => void
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function EditButtons({ character, editCharacter, deleteCharacter, setToast }: EditButtonsProps) {
  return (
    <ButtonGroup size="small">
      <Tooltip title="Edit Character" arrow>
        <Button onClick={() => {editCharacter(character)}}>
          <EditIcon />
        </Button>
      </Tooltip>
      { deleteCharacter &&
      <Tooltip title="Delete Character" arrow>
        <Button onClick={() => deleteCharacter(character)}>
          <DeleteIcon />
        </Button>
      </Tooltip> }
    </ButtonGroup>
  )
}
