import { Stack, Box, ButtonGroup, Button, Tooltip } from "@mui/material"
import BoltIcon from "@mui/icons-material/Bolt"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import FavoriteIcon from "@mui/icons-material/Favorite"
import CommuteIcon from "@mui/icons-material/Commute"
import CarCrashIcon from "@mui/icons-material/CarCrash"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import MookRolls from "./mooks/MookRolls"

import GamemasterOnly from "../GamemasterOnly"
import PlayerTypeOnly from "../PlayerTypeOnly"
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
}

export default function ActionButtons({ character, healWounds, takeWounds, takeConditionPoints, takeAction, editCharacter, deleteCharacter }: ActionButtonsParams) {
  const { user } = useClient()

  const woundLabel = "Kill Mooks"
  const woundIcon = <CommuteIcon color="error" />

  const mainAttack = character?.skills?.["Driving"] || 13

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        <MookRolls count={character.count} attack={mainAttack as number} damage={character.action_values["Squeal"] as number} icon={<NewReleasesIcon />} />
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
        { takeConditionPoints &&
        <PlayerTypeOnly character={character} except="Mook">
          <Tooltip title="Take Condition Points">
            <Button variant="contained" onClick={() => {takeConditionPoints(character)}}>
              <CarCrashIcon color="error" />
            </Button>
          </Tooltip>
        </PlayerTypeOnly> }
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
      <ButtonGroup variant="outlined" size="small" className="actionButtons">
        { takeAction && <Tooltip title="Take Action" arrow>
          <Button sx={{width: 60}} variant="contained" color="highlight" onClick={() => {takeAction(character)}}>
            <BoltIcon sx={{width: 50, height: 50}} />
          </Button>
        </Tooltip> }
      </ButtonGroup>
    </Stack>
  )
}
