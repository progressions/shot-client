import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

import { Tooltip, IconButton, Stack } from "@mui/material"
import { useMemo } from "react"

import EffectsModal from "./EffectsModal"
import Effects from "./Effects"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"

import type { Severity, Character } from "../../types/types"

import { effectsGroupedByType } from "../../utils/effectsGrouped"

interface GroupedEffectsProps {
  character: Character
}

export default function GroupedEffects({ character }: GroupedEffectsProps) {
  const { fight } = useFight()
  const effects = (character.category === "character") ? effectsGroupedByType(fight.character_effects[character.shot_id as string] || []) :
    effectsGroupedByType(fight.vehicle_effects[character.shot_id as string] || [])

  const severities = ["error", "warning", "info", "success"]

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {
          severities.map((severity) => {
            if (effects[severity]) {
              return <Effects key={severity} effects={effects[severity]} severity={severity as Severity} />
            }
          })
        }
        <EffectsModal character={character} />
      </Stack>
    </>
  )
}
