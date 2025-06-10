import { Stack, Box, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { IoSkull } from "react-icons/io5"
import CS from "@/services/CharacterService"

import GamemasterOnly from "@/components/GamemasterOnly"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import { useClient } from "@/contexts/ClientContext"

import type { Character, CharacterType } from "@/types/types"

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

  const woundLabel = CS.isMook(character) ? "Kill Mooks" : "Take Smackdown"

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        <PlayerTypeOnly character={character} except="Mook">
          { takeWounds &&
            <Tooltip title="Death Check" arrow>
              <Button onClick={() => {takeWounds(character)}}>
                <IoSkull />
              </Button>
            </Tooltip> }
          </PlayerTypeOnly>
        <PlayerTypeOnly character={character} except="Mook">
          { takeWounds &&
            <Tooltip title="Up Check" arrow>
              <Button onClick={() => {takeWounds(character)}}>
                <FileUploadIcon color="error" />
              </Button>
            </Tooltip> }
        </PlayerTypeOnly>
        { takeWounds &&
          <Tooltip title={woundLabel} arrow>
            <Button onClick={() => {takeWounds(character)}}>
              <HeartBrokenIcon color='error' />
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
