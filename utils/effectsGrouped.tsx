import type { Severity, Fight, CharacterEffect, Effect } from "@/types/types"

interface GroupedEffects<T> {
  [key: string]: T[]
}

export function effectsForShot(fight: Fight, shot: number):Effect[] {
  return fight.effects.filter((effect: Effect) => {
    return shot > 0 && (
      (fight.sequence == effect.start_sequence && shot <= effect.start_shot) ||
        (fight.sequence == effect.end_sequence && shot > effect.end_shot)
    )
  })
}

export function effectsGroupedByType<T extends Effect | CharacterEffect>(effects: T[]):GroupedEffects<T> {
  return effects.reduce((acc: GroupedEffects<T>, effect: T) => {
    if (!effect.severity) return acc

    acc[effect.severity] ||= []
    acc[effect.severity].push(effect)
    return acc
  }, {})
}
