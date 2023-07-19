import type { Fight, Character, CharacterEffect } from "../types/types"
import CS from "./CharacterService"

const FightService = {
  characterEffects: function(fight: Fight, character: Character): CharacterEffect[] {
    return fight.character_effects[character.shot_id as string] || []
  }
}

export default FightService
