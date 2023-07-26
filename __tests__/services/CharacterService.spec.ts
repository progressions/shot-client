import CS from "../../services/CharacterService"
import type { Faction, Weapon, Character } from "../../types/types"
import { defaultFaction, defaultWeapon, defaultCharacter } from "../../types/types"

describe("CharacterService", () => {
  describe("skill", () => {
    it("should return a character's skill", async () => {
      const character: Character = defaultCharacter

      expect(CS.skill(character, "Driving")).toBe(7)
    }),

    it("should return a character's skill with a modifier", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1
      }
      expect(CS.skill(character, "Driving")).toBe(6)
    })
  }),

  describe("mainAttack", () => {
    it("should return a default character's main attack", async () => {
      const character: Character = defaultCharacter

      expect(CS.mainAttack(character)).toBe("Guns")
    }),

    it("returns a martial artist's main attack", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "MainAttack": "Martial Arts"
        }
      }

      expect(CS.mainAttack(character)).toBe("Martial Arts")
    })
  }),

  describe("secondaryAttack", () => {
    it("should return '' if they have no secondary attack", async () => {
      const character: Character = defaultCharacter

      expect(CS.secondaryAttack(character)).toBe("")
    }),

    it("should return a character's secondary attack", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "SecondaryAttack": "Guns"
        }
      }

      expect(CS.secondaryAttack(character)).toBe("Guns")
    })
  }),

  describe("mainAttackValue", () => {
    it("should return a character's main attack value", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "MainAttack": "Guns",
          "Guns": 14
        }
      }

      expect(CS.mainAttackValue(character)).toBe(14)
    }),

    it("should return a character's main attack value with a modifier", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          "MainAttack": "Guns",
          "Guns": 14
        }
      }

      expect(CS.mainAttackValue(character)).toBe(13)
    }),

    it("should return a Martial Artist's main attack value", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "MainAttack": "Martial Arts",
          "Martial Arts": 14
        }
      }

      expect(CS.mainAttackValue(character)).toBe(14)
    })
  }),

  describe("secondaryAttackValue", () => {
    it("should return a character's secondary attack value", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "SecondaryAttack": "Guns",
          "Guns": 14
        }
      }

      expect(CS.secondaryAttackValue(character)).toBe(14)
    }),

    it("should return a character's secondary attack value with a modifier", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          "SecondaryAttack": "Guns",
          "Guns": 14
        }
      }

      expect(CS.secondaryAttackValue(character)).toBe(13)
    }),

    it("should return a Martial Artist's secondary attack value", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "SecondaryAttack": "Martial Arts",
          "Martial Arts": 14
        }
      }

      expect(CS.secondaryAttackValue(character)).toBe(14)
    })
  }),

  describe("damage", () => {
    it("should return a character's damage", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Damage": 9
        }
      }

      expect(CS.damage(character)).toBe(9)
    }),

    it("should return a character's damage with no impairment modifier", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          "Damage": 9
        }
      }

      expect(CS.damage(character)).toBe(9)
    })
  }),

  describe("fortuneType", () => {
    it("should return a character's fortune type", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "FortuneType": "Chi"
        }
      }

      expect(CS.fortuneType(character)).toBe("Chi")
    })
  }),

  describe("maxFortuneLabel", () => {
    it("should return a character's max fortune label", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "FortuneType": "Chi"
        }
      }

      expect(CS.maxFortuneLabel(character)).toBe("Max Chi")
    })
  }),

  describe("archetype", () => {
    it("should return a character's archetype", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Archetype: "Bruiser"
        }
      }

      expect(CS.archetype(character)).toBe("Bruiser")
    })
  }),

  describe("speed", () => {
    it("should return a character's speed", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Speed: 4
        }
      }

      expect(CS.speed(character)).toBe(4)
    })

    it("should returns speed without impairment", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          Speed: 4
        }
      }

      expect(CS.speed(character)).toBe(4)
    })
  }),

  describe("toughness", () => {
    it("should return a character's toughness", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      expect(CS.toughness(character)).toBe(4)
    }),

    it("should return a character's toughness without impairment", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      expect(CS.toughness(character)).toBe(4)
    })
  }),

  describe("defense", () => {
    it("should return a character's defense", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Defense: 14
        }
      }

      expect(CS.defense(character)).toBe(14)
    }),

    it("should return a character's defense with impairment", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          Defense: 14
        }
      }

      expect(CS.defense(character)).toBe(13)
    })
  }),

  describe("marksOfDeath", () => {
    it("should return zero if a character has no marks of death", async() => {
      expect(CS.marksOfDeath(defaultCharacter)).toBe(0)
    }),

    it("should return a character's marks of death", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Marks of Death": 1
        }
      }

      expect(CS.marksOfDeath(character)).toBe(1)
    })
  }),

  describe("calculateWounds", () => {
    it("should reduce smackdown taken by toughness", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      expect(CS.calculateWounds(character, 4)).toBe(0)
    }),

    it("should not go below zero", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      expect(CS.calculateWounds(character, 3)).toBe(0)
    }),

    it("should not be affected by impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 1,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      expect(CS.calculateWounds(character, 14)).toBe(10)
    })
  }),

  describe("takeSmackdown", () => {
    describe("mooks", () => {
      it("should kill mooks ignoring toughness", async () => {
        const mook: Character = {
          ...defaultCharacter,
          count: 15,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Mook",
            Toughness: 4
          }
        }

        const updatedMook = CS.takeSmackdown(mook, 14)
        expect(CS.mooks(updatedMook)).toBe(1)
      })
    }),

    it("should return a character with wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 14)
      expect(CS.wounds(updatedCharacter)).toBe(10)
    }),

    it("should return a character with wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 3)
      expect(CS.wounds(updatedCharacter)).toBe(0)
    }),

    it("should return a character with wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 4
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 4)
      expect(CS.wounds(updatedCharacter)).toBe(0)
    }),

    describe("Uber-Boss impairments", () => {
      it("should add 1 impairment when an Uber-Boss goes from 39 to 40 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Uber-Boss",
            Toughness: 8,
            Wounds: 39
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(40)
        expect(CS.impairments(updatedCharacter)).toBe(1)
      }),

      it("should add 1 impairment when an Uber-Boss goes from 44 to 45 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 1,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Uber-Boss",
            Toughness: 8,
            Wounds: 44
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(45)
        expect(CS.impairments(updatedCharacter)).toBe(2)
      })
    }),

    it("should add 2 impairments when an Uber-Boss goes from 39 to 45 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Uber-Boss",
          Toughness: 8,
          Wounds: 39
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 14)
      expect(CS.wounds(updatedCharacter)).toBe(45)
      expect(CS.impairments(updatedCharacter)).toBe(2)
    }),

    describe("Boss impairments", () => {
      it("should add 1 impairment when a Boss goes from 39 to 40 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Boss",
            Toughness: 8,
            Wounds: 39
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(40)
        expect(CS.impairments(updatedCharacter)).toBe(1)
      }),

      it("should add 1 impairment when a Boss goes from 44 to 45 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 1,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Boss",
            Toughness: 8,
            Wounds: 44
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(45)
        expect(CS.impairments(updatedCharacter)).toBe(2)
      })
    }),

    it("should add 2 impairments when a Boss goes from 39 to 45 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Boss",
          Toughness: 8,
          Wounds: 39
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 14)
      expect(CS.wounds(updatedCharacter)).toBe(45)
      expect(CS.impairments(updatedCharacter)).toBe(2)
    }),

    describe("Featured Foe impairments", () => {
      it("should add 1 impairment when a Featured Foe goes from 24 to 25 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Featured Foe",
            Toughness: 8,
            Wounds: 24
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(25)
        expect(CS.impairments(updatedCharacter)).toBe(1)
      }),

      it("should add 1 impairment when a Featured Foe goes from 29 to 30 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 1,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Featured Foe",
            Toughness: 8,
            Wounds: 29
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(30)
        expect(CS.impairments(updatedCharacter)).toBe(2)
      })
    }),

    it("should add 2 impairments when a Featured Foe goes from 24 to 30 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Featured Foe",
          Toughness: 8,
          Wounds: 24
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 14)
      expect(CS.wounds(updatedCharacter)).toBe(30)
      expect(CS.impairments(updatedCharacter)).toBe(2)
    }),

    describe("Ally impairments", () => {
      it("should add 1 impairment when a Ally goes from 24 to 25 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Ally",
            Toughness: 8,
            Wounds: 24
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(25)
        expect(CS.impairments(updatedCharacter)).toBe(1)
      }),

      it("should add 1 impairment when a Ally goes from 29 to 30 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 1,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "Ally",
            Toughness: 8,
            Wounds: 29
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(30)
        expect(CS.impairments(updatedCharacter)).toBe(2)
      })
    }),

    it("should add 2 impairments when a Ally goes from 24 to 30 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Ally",
          Toughness: 8,
          Wounds: 24
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 14)
      expect(CS.wounds(updatedCharacter)).toBe(30)
      expect(CS.impairments(updatedCharacter)).toBe(2)
    }),

    describe("PC impairments", () => {
      it("should add 1 impairment when a PC goes from 24 to 25 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "PC",
            Toughness: 8,
            Wounds: 24
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(25)
        expect(CS.impairments(updatedCharacter)).toBe(1)
      }),

      it("should add 1 impairment when a PC goes from 29 to 30 wounds", async () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 1,
          action_values: {
            ...defaultCharacter.action_values,
            Type: "PC",
            Toughness: 8,
            Wounds: 29
          }
        }

        const updatedCharacter = CS.takeSmackdown(character, 9)
        expect(CS.wounds(updatedCharacter)).toBe(30)
        expect(CS.impairments(updatedCharacter)).toBe(2)
      })
    }),

    it("should add 2 impairments when a PC goes from 24 to 30 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "PC",
          Toughness: 8,
          Wounds: 24
        }
      }

      const updatedCharacter = CS.takeSmackdown(character, 14)
      expect(CS.wounds(updatedCharacter)).toBe(30)
      expect(CS.impairments(updatedCharacter)).toBe(2)
    })
  }),

  describe("takeRawWounds", () => {
    it("adds wounds to the character without subtracting toughness", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 8,
          Wounds: 10
        }
      }

      const updatedCharacter = CS.takeRawWounds(character, 10)
      expect(CS.wounds(updatedCharacter)).toBe(20)
    })

    it("doesn't add impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 8,
          Wounds: 40
        }
      }

      const updatedCharacter = CS.takeRawWounds(character, 40)
      expect(CS.impairments(updatedCharacter)).toBe(0)
    })
  }),

  describe("healWounds", () => {
    it("should heal wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 8,
          Wounds: 20
        }
      }

      const updatedCharacter = CS.healWounds(character, 10)
      expect(CS.wounds(updatedCharacter)).toBe(10)
    })

    it("should not heal more wounds than the character has", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 8,
          Wounds: 5
        }
      }

      const updatedCharacter = CS.healWounds(character, 10)
      expect(CS.wounds(updatedCharacter)).toBe(0)
    }),

    it("should reduce impairments by 1 when a PC goes from 30 to 29 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 2,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "PC",
          Toughness: 8,
          Wounds: 30
        }
      }

      const updatedCharacter = CS.healWounds(character, 1)
      expect(CS.wounds(updatedCharacter)).toBe(29)
      expect(CS.impairments(updatedCharacter)).toBe(1)
    }),

    it("should reduce impairments by 2 when a PC goes from 30 to 24 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        impairments: 2,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "PC",
          Toughness: 8,
          Wounds: 30
        }
      }

      const updatedCharacter = CS.healWounds(character, 6)
      expect(CS.wounds(updatedCharacter)).toBe(24)
      expect(CS.impairments(updatedCharacter)).toBe(0)
    })
  }),

  describe("addDeathMarks", () => {
    it("should add death marks", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Marks of Death": 0
        }
      }

      const updatedCharacter = CS.addDeathMarks(character, 1)
      expect(CS.marksOfDeath(updatedCharacter)).toBe(1)
    })
  }),

  describe("knownSkills", () => {
    it("returns all skills with a value greater than 0", async () => {
      const character: Character = {
        ...defaultCharacter,
        skills: {
          ...defaultCharacter.skills,
          "Driving": 13,
          "Sabotage": 12
        }
      }

      expect(CS.knownSkills(character)).toEqual([["Driving", 13], ["Sabotage", 12]])
    })
  }),

  describe("updateSkill", () => {
    it("should update a skill", async () => {
      const character: Character = {
        ...defaultCharacter,
        skills: {
          ...defaultCharacter.skills,
          "Driving": 13
        }
      }

      const updatedCharacter = CS.updateSkill(character, "Driving", 14)
      expect(CS.skill(updatedCharacter, "Driving")).toBe(14)
    })
  }),

  describe("fullHeal", () => {
    it("restores wounds to 0, fortune to max, and removes all impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Marks of Death": 1,
          Toughness: 8,
          Wounds: 20,
          "Max Fortune": 8,
          "FortuneType": "Fortune",
          Fortune: 2
        },
        impairments: 2
      }

      const updatedCharacter = CS.fullHeal(character)
      expect(CS.wounds(updatedCharacter)).toBe(0)
      expect(CS.fortune(updatedCharacter)).toBe(8)
      expect(CS.impairments(updatedCharacter)).toBe(0)
      expect(CS.marksOfDeath(updatedCharacter)).toBe(0)
    })
  }),

  describe("wounds", () => {
    it("returns the number of wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Toughness: 8,
          Wounds: 20
        }
      }

      expect(CS.wounds(character)).toBe(20)
    })
  }),

  describe("seriousWounds", () => {
    it("returns true if an Uber-Boss has more than 50 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Uber-Boss",
          Toughness: 8,
          Wounds: 51
        }
      }

      expect(CS.seriousWounds(character)).toBe(true)
    }),

    it("returns true if a Boss has more than 50 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Boss",
          Toughness: 8,
          Wounds: 51
        }
      }

      expect(CS.seriousWounds(character)).toBe(true)
    }),

    it("returns true if a Featured Foe has more than 35 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Featured Foe",
          Toughness: 8,
          Wounds: 36
        }
      }

      expect(CS.seriousWounds(character)).toBe(true)
    })

    it("returns true if an Ally has more than 35 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Ally",
          Toughness: 8,
          Wounds: 36
        }
      }

      expect(CS.seriousWounds(character)).toBe(true)
    }),

    it("returns true if a PC has more than 35 wounds", async () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "PC",
          Toughness: 8,
          Wounds: 36
        }
      }

      expect(CS.seriousWounds(character)).toBe(true)
    }),

    it("returns false for a mook", async () => {
      const character: Character = {
        ...defaultCharacter,
        count: 5,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "Mook",
        }
      }

      expect(CS.seriousWounds(character)).toBe(false)
    })
  }),

  describe("weapons", () => {
    it("returns an array of weapons", async () => {
      const character: Character = {
        ...defaultCharacter,
        weapons: [defaultWeapon, defaultWeapon]
      }

      expect(CS.weapons(character)).toEqual([defaultWeapon, defaultWeapon])
    })
  })
})
