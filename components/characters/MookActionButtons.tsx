import { Stack, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import CommuteIcon from '@mui/icons-material/Commute'

import GamemasterOnly from "../GamemasterOnly"
import MookRolls from '../MookRolls'
import { useClient } from "../../contexts/ClientContext"

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
  const { user } = useClient()

  const woundLabel = "Kill Mooks"
  let woundIcon
  if (character.category === "character") {
    woundIcon = <HeartBrokenIcon color='error' />
  } else {
    woundIcon = <CommuteIcon color="error" />
  }

  const mainAttack = character?.action_values?.[character?.action_values?.["MainAttack"] as string]

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        { character.category === "character" && takeWounds &&
            <MookRolls count={character.action_values["Wounds"] as number} attack={mainAttack as number} damage={character.action_values["Damage"] as number} icon={<NewReleasesIcon />} /> }
        { takeWounds &&
          <Tooltip title={woundLabel} arrow>
            <Button onClick={() => {takeWounds(character)}}>
              {woundIcon}
            </Button>
          </Tooltip> }
        <GamemasterOnly user={user} character={character}>
          { editCharacter &&
          <Tooltip title="Edit Character" arrow>
            <Button color="secondary" onClick={() => {editCharacter(character)}}>
              <EditIcon />
            </Button>
          </Tooltip> }
          { deleteCharacter &&
          <Tooltip title="Delete Character" arrow>
            <Button color="secondary" onClick={() => deleteCharacter(character)}>
              <DeleteIcon />
            </Button>
          </Tooltip> }
        </GamemasterOnly>
      </ButtonGroup>
      <ButtonGroup variant="outlined" size="small">
        { takeDodgeAction && <Tooltip title="Dodge" arrow>
          <Button variant="contained" color="highlight" onClick={() => takeDodgeAction(character)}>
            <DirectionsRunIcon />
          </Button>
        </Tooltip> }
        { takeAction && <Tooltip title="Take Action" arrow>
          <Button sx={{width: 60}} variant="contained" color="highlight" onClick={() => {takeAction(character)}}>
            <BoltIcon sx={{width: 50, height: 50}} />
          </Button>
        </Tooltip> }
      </ButtonGroup>
    </Stack>
  )
}
