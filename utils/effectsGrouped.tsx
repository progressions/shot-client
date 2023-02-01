import type { Fight, CharacterEffect, Effect } from "../types/types"

type GeneralEffect = CharacterEffect | Effect

export const effectsForShot = (fight: Fight, shot: number) => {
  return fight.effects.filter((effect: Effect) => {
    return shot > 0 && (
      (fight.sequence == effect.start_sequence && shot <= effect.start_shot) ||
        (fight.sequence == effect.end_sequence && shot > effect.end_shot)
    )
  })
}

export const effectsGroupedByType = (effects: GeneralEffect[]) => {
  return effects.reduce((acc: any, effect: GeneralEffect) => {
    if (!effect.severity) return acc

    acc[effect.severity] ||= []
    acc[effect.severity].push(effect)
    return acc
  }, {})
}
