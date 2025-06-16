import { Tooltip, IconButton, Stack } from "@mui/material"
import { useMemo } from "react"

import EffectsModal from "@/components/state_effects/EffectsModal"
import Effects from "@/components/state_effects/Effects"
import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"

import type { Severity, Character } from "@/types/types"

import { effectsGroupedByType } from "@/utils/effectsGrouped"

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
              return <Effects key={severity} character={character} effects={effects[severity]} severity={severity as Severity} />
            }
          })
        }
        <EffectsModal character={character} />
      </Stack>
    </>
  )
}
