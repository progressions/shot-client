import { Box, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import NewReleasesIcon from '@mui/icons-material/NewReleases'

import MookRolls from '../MookRolls'

import type { Character, CharacterType, Toast } from "../../types/types"

interface ActionButtonsProps {
  character: Character
  takeWounds?: (character: Character) => void
  takeAction?: (character: Character) => void
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

export default function ActionButtons({ character, takeWounds, takeAction, editCharacter, deleteCharacter }: ActionButtonsProps) {
  if (!character) return <></>

  let woundLabel:string
  if (character.category === "character") {
    woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Wounds"
  } else {
    woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Chase Points"
  }

  return (
    <Box>
      <ButtonGroup variant="outlined" size="small">
        { takeAction && <Tooltip title="Take Action" arrow>
          <Button variant="contained" color="secondary" onClick={() => {takeAction(character)}}>
            <BoltIcon />
          </Button>
        </Tooltip> }
      </ButtonGroup>
      &nbsp;
      <ButtonGroup variant="outlined" size="small">
        { character.category === "character" && takeWounds && character.action_values["Type"] == "Mook" &&
            <MookRolls count={character.action_values["Wounds"] as number} attack={character.action_values["Guns"] as number} damage={character.action_values["Damage"] as number} icon={<NewReleasesIcon />} /> }
        { takeWounds &&
        <Tooltip title={woundLabel} arrow>
          <Button onClick={() => {takeWounds(character)}}>
            <HeartBrokenIcon color='error' />
          </Button>
        </Tooltip> }
      </ButtonGroup>
    </Box>
  )
}
