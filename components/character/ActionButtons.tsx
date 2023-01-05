import { ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewReleasesIcon from '@mui/icons-material/NewReleases'

import MookRolls from '../MookRolls'

export default function ActionButtons({ character, takeWounds, takeAction, editCharacter, deleteCharacter }: any) {
  const woundLabel = character.action_values["Type"] === "Mook" ? "Kill Mooks" : "Take Wounds"
  return (
    <ButtonGroup variant="outlined" size="small">
      { character.action_values["Type"] == "Mook" &&
          <MookRolls count={character.action_values["Wounds"]} attack={character.action_values["Guns"]} damage={character.action_values["Damage"]} icon={<NewReleasesIcon />} /> }
      <Tooltip title={woundLabel} arrow>
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
