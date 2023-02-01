import { Tooltip, IconButton } from "@mui/material"
import Effects from "./Effects"

import { effectsForShot, effectsGroupedByType } from "../../utils/effectsGrouped"
import type { Severity, Effect, Fight } from "../../types/types"
import { useMemo } from "react"

interface GroupedEffectsParams {
  fight: Fight
  shot: number
}

export default function GroupedEffects({ fight, shot }: GroupedEffectsParams) {
  const finalEffects = useMemo(() => effectsGroupedByType(effectsForShot(fight, shot)), [fight, shot])
  const severities = ["error", "warning", "info", "success"]

  return (
    <>
      {
        severities.map((severity: string) => {
          if (finalEffects[severity]) {
            return <Effects key={severity} effects={finalEffects[severity]} severity={severity as Severity} />
          }
       })
      }
    </>
  )
}
