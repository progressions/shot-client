import { Stack, Box, ButtonGroup, Button, Tooltip } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import ConditionPointsModal from "@/components/vehicles/ConditionPointsModal"
import ChasePointsModal from "@/components/vehicles/ChasePointsModal"
import ActionModal from "@/components/characters/ActionModal"

import type { Character, CharacterType } from "@/types/types"

interface ActionButtonsParams {
  character: Character,
}

export default function ActionButtons({ character }: ActionButtonsParams) {
  return (
    <Stack direction="row" spacing={1} sx={{height: 30}}>
      <ButtonGroup variant="contained" size="small">
        <ChasePointsModal character={character} />
        <ConditionPointsModal character={character} />
      </ButtonGroup>
    </Stack>
  )
}
