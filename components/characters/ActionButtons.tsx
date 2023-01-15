import { Stack, Box, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommuteIcon from '@mui/icons-material/Commute'
import CarCrashIcon from '@mui/icons-material/CarCrash'

import PlayerTypeOnly from "../PlayerTypeOnly"
import MookRolls from '../MookRolls'

import type { Character, CharacterType } from "../../types/types"

interface ActionButtonsParams {
  character: Character,
  healWounds?: (character: Character) => void,
  takeWounds?: (character: Character) => void,
  takeConditionPoints?: (character: Character) => void,
  takeAction?: (character: Character) => void,
  editCharacter?: (character: Character) => void,
  deleteCharacter?: (character: Character) => void,
  takeDodgeAction?: (character: Character) => void,
}

export default function ActionButtons({ character, healWounds, takeWounds, takeConditionPoints, takeAction, editCharacter, deleteCharacter, takeDodgeAction }: ActionButtonsParams) {
  if (!character) return (<></>)

  let woundLabel:string
  let woundIcon
  if (character.category === "character") {
    woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Smackdown"
    woundIcon = <HeartBrokenIcon color='error' />
  } else {
    woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Chase Points"
    woundIcon = <CommuteIcon color="error" />
  }

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="outlined" size="small">
        { character.category === "character" && takeWounds && character.action_values["Type"] == "Mook" &&
            <MookRolls count={character.action_values["Wounds"] as number} attack={character.action_values["Guns"] as number} damage={character.action_values["Damage"] as number} icon={<NewReleasesIcon />} /> }
        { takeWounds &&
          <Tooltip title={woundLabel} arrow>
            <Button onClick={() => {takeWounds(character)}}>
              {woundIcon}
            </Button>
          </Tooltip> }
        { healWounds &&
        <PlayerTypeOnly character={character} except="Mook">
          <Tooltip title="Heal Wounds" arrow>
            <Button onClick={() => {healWounds(character)}}>
              <FavoriteIcon color="error" />
            </Button>
          </Tooltip>
        </PlayerTypeOnly> }
        { takeConditionPoints && character.category === "vehicle" &&
        <Tooltip title="Take Condition Points">
          <Button onClick={() => {takeConditionPoints(character)}}>
            <CarCrashIcon color="error" />
          </Button>
        </Tooltip> }
        { editCharacter &&
        <Tooltip title="Edit Character" arrow>
          <Button onClick={() => {editCharacter(character)}}>
            <EditIcon />
          </Button>
        </Tooltip> }
        { deleteCharacter &&
        <Tooltip title="Delete Character" arrow>
          <Button onClick={() => deleteCharacter(character)}>
            <DeleteIcon />
          </Button>
        </Tooltip> }
      </ButtonGroup>
      <ButtonGroup variant="outlined" size="small">
        { takeDodgeAction &&
        <Button color="secondary" onClick={() => takeDodgeAction(character)}>
          <DirectionsRunIcon />
        </Button> }
        { takeAction && <Tooltip title="Take Action" arrow>
          <Button variant="contained" color="secondary" onClick={() => {takeAction(character)}}>
            <BoltIcon />
          </Button>
        </Tooltip> }
      </ButtonGroup>
    </Stack>
  )
}
