import type { ShotType, User, Vehicle, Fight, Character, CharacterEffect } from "@/types/types"
import CS from "@/services/CharacterService"
import SS from "@/services/SharedService"

const FightService = {
  currentShot: function(fight: Fight): number {
    if (!fight?.shot_order || fight.shot_order.length === 0) return 0

    return fight.shot_order[0][0] || 0
  },

  users: function(fight: Fight): User[] {
    if (!fight?.id || !fight?.shot_order || !fight?.gamemaster?.id) { return [] }

    return fight.shot_order.reduce((acc, [shot, chars]: ShotType) => {
      chars.forEach((char: Character) => {
        if (CS.isPC(char) && char?.user && !acc.some(u => u?.id === char?.user?.id)) {
          acc.push(char.user)
        }
      })
      return acc
    }, [fight.gamemaster] as User[])
  },

  firstUp: function(fight: Fight): Character | Vehicle | undefined {
    return fight.shot_order?.[0]?.[1]?.[0]
  },

  playerCharactersForInitiative: function(fight: Fight): Character[] {
    return this.playerCharacters(fight)
      .filter((character) => {
        if (SS.hidden(character)) return false

        const shot = character.current_shot as number
        return shot <= 0
      })
  },

  playerCharacters: function(fight: Fight): Character[] {
    if (!fight?.shot_order) return []

    return fight
      .shot_order
      .reduce((acc: any[], shot: ShotType) => {
        shot[1].forEach((combatant) => {
          if (SS.isPC(combatant)) {
            combatant.current_shot = shot[0]
            acc.push(combatant as Character)
          }
        })
        return acc
      }, []) || []
  },

  startOfSequence: function(fight: Fight): boolean {
    return (fight?.shot_order?.[0]?.[0] || 0) === 0
  },

  characterEffects: function(fight: Fight, character: Character): CharacterEffect[] {
    return fight?.character_effects[character.shot_id as string] || []
  }
}

export default FightService
