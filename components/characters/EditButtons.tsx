import { Tooltip, ButtonGroup, Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import type { Character, CharacterType } from "../../types/types"

interface EditButtonsProps {
  character: Character,
  editCharacter: (character: Character) => void
  deleteCharacter: (character: Character) => void
  hideCharacter?: (character: Character) => void
  showCharacter?: (character: Character) => void
  hidden?: boolean
}

export default function EditButtons({ character, editCharacter, deleteCharacter, hideCharacter, showCharacter, hidden }: EditButtonsProps) {
  return (
    <ButtonGroup size="small">
      <Tooltip title="Edit" arrow>
        <Button variant="contained" color="primary" onClick={() => {editCharacter(character)}}>
          <EditIcon />
        </Button>
      </Tooltip>
      { hideCharacter && !hidden &&
      <Tooltip title="Hide" arrow>
        <Button className="hideCharacter" variant="contained" color="primary" onClick={() => {hideCharacter(character)}}>
          <VisibilityOffIcon />
        </Button>
      </Tooltip>
      }
      { showCharacter && hidden &&
      <Tooltip className="showCharacter" title="Show" arrow>
        <Button variant="contained" color="primary" onClick={() => {showCharacter(character)}}>
          <VisibilityIcon />
        </Button>
      </Tooltip>
      }
      { deleteCharacter &&
      <Tooltip title="Remove" arrow>
        <Button variant="contained" color="primary" onClick={() => deleteCharacter(character)}>
          <DeleteIcon />
        </Button>
      </Tooltip> }
    </ButtonGroup>
  )
}
