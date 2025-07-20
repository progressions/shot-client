import { Stack, Box, ButtonGroup, Button, Tooltip } from "@mui/material"
import BoltIcon from "@mui/icons-material/Bolt"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import FavoriteIcon from "@mui/icons-material/Favorite"
import CommuteIcon from "@mui/icons-material/Commute"
import CarCrashIcon from "@mui/icons-material/CarCrash"
import KillMooksModal from "@/components/characters/KillMooksModal"
import ActionModal from "@/components/characters/ActionModal"

import GamemasterOnly from "@/components/GamemasterOnly"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import { useClient } from "@/contexts/ClientContext"

import type { Character, CharacterType } from "@/types/types"

interface MookActionButtonsParams {
  character: Character,
}

export default function MookActionButtons({ character }: MookActionButtonsParams) {
  const { user } = useClient()

  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        <KillMooksModal character={character} />
      </ButtonGroup>
      <ButtonGroup variant="outlined" size="small" className="actionButtons">
        <ActionModal character={character} />
      </ButtonGroup>
    </Stack>
  )
}
