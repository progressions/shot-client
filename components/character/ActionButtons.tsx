import { Box, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewReleasesIcon from '@mui/icons-material/NewReleases'

import MookRolls from '../MookRolls'

import type { Character, CharacterType, Toast } from "../../types/types"

interface ActionButtonsParams {
  character: Character,
  takeWounds?: (character: Character) => void,
  takeAction?: (character: Character) => void,
  editCharacter: (character: Character) => void,
  deleteCharacter: (character: Character) => void,
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function ActionButtons({ character, takeWounds, takeAction, editCharacter, deleteCharacter }: ActionButtonsParams) {
  if (!character) return <></>

  const woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Wounds"
  return (
    <Box sx={{width: 220, border: 0, justifyContent: "flex-end", alignItems: "flex-end", display: "flex"}}>
      <ButtonGroup variant="outlined" size="small">
        { character.category === "character" && takeWounds && character.action_values["Type"] == "Mook" &&
            <MookRolls count={character.action_values["Wounds"] as number} attack={character.action_values["Guns"] as number} damage={character.action_values["Damage"] as number} icon={<NewReleasesIcon />} /> }
        { takeWounds &&
        <Tooltip title={woundLabel} arrow>
          <Button onClick={() => {takeWounds(character)}}>
            <HeartBrokenIcon color='error' />
          </Button>
        </Tooltip> }
        { takeAction && <Tooltip title="Take Action" arrow>
          <Button onClick={() => {takeAction(character)}}>
            <BoltIcon />
          </Button>
        </Tooltip> }
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
    </Box>
  )
}
