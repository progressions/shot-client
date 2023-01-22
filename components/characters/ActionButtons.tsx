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

import GamemasterOnly from "../GamemasterOnly"
import PlayerTypeOnly from "../PlayerTypeOnly"
import MookRolls from '../MookRolls'
import { useSession } from 'next-auth/react'

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
  const session: any = useSession({ required: true })

  let woundLabel:string
  let woundIcon
  if (character.category === "character") {
    woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Smackdown"
    woundIcon = <HeartBrokenIcon color='error' />
  } else {
    woundLabel = character.action_values["Type"] === "Mook" as CharacterType ? "Kill Mooks" : "Take Chase Points"
    woundIcon = <CommuteIcon color="error" />
  }

  const mainAttack = character?.action_values?.[character?.action_values?.["MainAttack"]]

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        { character.category === "character" && takeWounds && character.action_values["Type"] == "Mook" &&
            <MookRolls count={character.action_values["Wounds"] as number} attack={mainAttack as number} damage={character.action_values["Damage"] as number} icon={<NewReleasesIcon />} /> }
        { takeWounds &&
          <Tooltip title={woundLabel} arrow>
            <Button onClick={() => {takeWounds(character)}}>
              {woundIcon}
            </Button>
          </Tooltip> }
        { healWounds &&
        <PlayerTypeOnly character={character} except="Mook">
          <Tooltip title="Heal Wounds" arrow>
            <Button variant="contained" onClick={() => {healWounds(character)}}>
              <FavoriteIcon color="error" />
            </Button>
          </Tooltip>
        </PlayerTypeOnly> }
        { takeConditionPoints && character.category === "vehicle" &&
        <Tooltip title="Take Condition Points">
          <Button variant="contained" onClick={() => {takeConditionPoints(character)}}>
            <CarCrashIcon color="error" />
          </Button>
        </Tooltip> }
        <GamemasterOnly user={session?.data?.user} character={character}>
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
