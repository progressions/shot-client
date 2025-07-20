import { Stack, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import CommuteIcon from '@mui/icons-material/Commute'
import KillMooksModal from "@/components/characters/KillMooksModal"
import ActionModal from "@/components/characters/ActionModal"

import GamemasterOnly from "@/components/GamemasterOnly"
import { useClient } from "@/contexts/ClientContext"
import type { Character, CharacterType } from "@/types/types"
import CS from "@/services/CharacterService"

interface ActionButtonsParams {
  character: Character,
  healWounds?: (character: Character) => void,
  takeConditionPoints?: (character: Character) => void,
  takeAction?: (character: Character) => void,
  editCharacter?: (character: Character) => void,
  deleteCharacter?: (character: Character) => void,
}

export default function MookActionButtons({ character, healWounds, takeConditionPoints, takeAction, editCharacter, deleteCharacter }: ActionButtonsParams) {
  const { user } = useClient()

  const woundLabel = "Kill Mooks"
  let woundIcon
  if (character.category === "character") {
    woundIcon = <HeartBrokenIcon color='error' />
  } else {
    woundIcon = <CommuteIcon color="error" />
  }

  const mainAttack = CS.mainAttackValue(character)

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        <KillMooksModal character={character} />
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
        <ActionModal character={character} />
      </ButtonGroup>
    </Stack>
  )
}
