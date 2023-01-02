import { ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ActionButtons({ character, takeWounds, takeAction, editCharacter, deleteCharacter }) {
  return (
    <ButtonGroup variant="outlined" size="small">
      <Tooltip title="Take Wounds" arrow>
        <Button onClick={() => {takeWounds(character)}}>
          <HeartBrokenIcon color='error' />
        </Button>
      </Tooltip>
      <Tooltip title="Take Action" arrow>
        <Button onClick={() => {takeAction(character)}}>
          <BoltIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Edit Character" arrow>
        <Button onClick={() => {editCharacter(character)}}>
          <EditIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Delete Character" arrow>
        <Button onClick={() => deleteCharacter(character)}>
          <DeleteIcon />
        </Button>
      </Tooltip>
    </ButtonGroup>
  )
}
