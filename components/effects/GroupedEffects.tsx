import { Tooltip, IconButton } from "@mui/material"
import Effects from "./Effects"

import type { Fight } from "../../types/types"
import { useMemo } from "react"

const effectsForShot = (fight: Fight, shot: number) => {
  return fight.effects.filter((effect) => {
    return shot > 0 && (
      (fight.sequence == effect.start_sequence && shot <= effect.start_shot) ||
        (fight.sequence == effect.end_sequence && shot > effect.end_shot)
    )
  })
}

export const effectsGroupedByType = (eff: any) => {
  return eff.reduce((acc: any, effect: any) => {
    acc[effect.severity] ||= []
    acc[effect.severity].push(effect)
    return acc
  }, {})
}

export default function GroupedEffects({ fight, shot }: any) {
  const finalEffects = useMemo(() => effectsGroupedByType(effectsForShot(fight, shot)), [fight, shot])
  const severities = ["error", "warning", "info", "success"]

  return (
    <>
      {
        severities.map((severity) => {
          if (finalEffects[severity]) {
            return <Effects key={severity} effects={finalEffects[severity]} severity={severity} />
          }
       })
      }
    </>
  )
}
