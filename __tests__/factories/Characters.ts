import type { Character } from "../../types/types"
import { defaultCharacter } from "../../types/types"

export const brick: Character = {
  ...defaultCharacter,
  name: "Brick Manly",
  action_values: {
    ...defaultCharacter.action_values,
    "Type": "PC",
    "Archetype": "Everyday Hero",
    "MainAttack": "Martial Arts",
    "SecondaryAttack": null,
    "Martial Arts": 14,
    "Defense": 13,
    "Toughness": 7,
    "FortuneType": "Fortune",
    "MaxFortune": 5,
    "Fortune": 5,
    "Speed": 5
  }
}

export const carolina: Character = {
  ...defaultCharacter,
  name: "Carolina Kominsky",
  action_values: {
    ...defaultCharacter.action_values,
    "Type": "PC",
    "Archetype": "Maverick Cop",
    "MainAttack": "Guns",
    "SecondaryAttack": "Martial Arts",
    "Guns": 14,
    "Martial Arts": 12,
    "Defense": 13,
    "Speed": 7,
    "Fortune": 7
  },
  skills: {
    ...defaultCharacter.skills,
    "Driving": 13
  }
}

export const shing: Character = {
  ...defaultCharacter,
  name: "Ugly Shing",
  action_values: {
    ...defaultCharacter.action_values,
    "Type": "Boss",
    "MainAttack": "Guns",
    "SecondaryAttack": null,
    "Guns": 17,
    "Defense": 14,
    "Damage": 9
  },
  skills: {
    "Driving": 15
  }
}

export const zombies: Character = {
  ...defaultCharacter,
  name: "Zombies",
  count: 15,
  action_values: {
    ...defaultCharacter.action_values,
    "Type": "Mook",
    "MainAttack": "Create",
    "SecondaryAttack": null,
    "Creature": 8,
    "Defense": 13,
    "Damage": 7
  }
}
