import type { ShotType, Vehicle, Fight, Character, CharacterEffect } from "../types/types"
import CS from "./CharacterService"
import SS from "./SharedService"

const FightService = {
  playerCharactersForInitiative: function(fight: Fight): Character[] {
    return this.playerCharacters(fight)
      .filter((character) => {
        return (character.current_shot || 0) <= 0
      })
  },

  playerCharacters: function(fight: Fight): Character[] {
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
    }, [])
  },

  startOfSequence: function(fight: Fight): boolean {
    return (fight?.shot_order?.[0]?.[0] || 0) === 0
  },

  characterEffects: function(fight: Fight, character: Character): CharacterEffect[] {
    return fight.character_effects[character.shot_id as string] || []
  }
}

export default FightService
