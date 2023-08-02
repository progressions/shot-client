import CS from "../../services/CharacterService"
import type { Faction, Weapon, Character } from "../../types/types"
import { CharacterTypes, defaultFaction, defaultWeapon, defaultCharacter } from "../../types/types"

describe("SharedService", () => {
  describe("Character", () => {
    describe("name", () => {
      it("returns a character's name", () => {
        const character: Character = {
          ...defaultCharacter,
          name: "Brick Manly"
        }

        expect(CS.name(character)).toBe("Brick Manly")
      })
    }),

    describe("hidden", () => {
      it("returns true if the character is hidden", () => {
        const character: Character = {
          ...defaultCharacter,
          current_shot: undefined
        }

        expect(CS.hidden(character)).toBe(true)
      }),

      it("returns false if the character is on a shot", () => {
        const character: Character = {
          ...defaultCharacter,
          current_shot: 1
        }

        expect(CS.hidden(character)).toBe(false)
      })
    }),

    describe("type", () => {
      it("returns the character's type", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.type(character)).toBe(CharacterTypes.PC)
      })
    }),

    describe("isCharacter", () => {
      it("returns true for a character", () => {
        const character: Character = defaultCharacter

        expect(CS.isCharacter(character)).toBe(true)
      })
    }),

    describe("isVehicle", () => {
      it("returns false for a character", () => {
        const character: Character = defaultCharacter

        expect(CS.isVehicle(character)).toBe(false)
      })
    }),

    describe("isFriendly", () => {
      it("returns true for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isFriendly(character)).toBe(true)
      }),

      it("returns true for an Ally", async() => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isFriendly(character)).toBe(true)
      }),

      it("returns false for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isFriendly(character)).toBe(false)
      }),

      it("returns false for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isFriendly(character)).toBe(false)
      }),

      it("returns false for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isFriendly(character)).toBe(false)
      }),

      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isFriendly(character)).toBe(false)
      })
    }),

    describe("isUnfriendly", () => {
      it("returns false for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isUnfriendly(character)).toBe(false)
      }),

      it("returns false for an Ally", async() => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isUnfriendly(character)).toBe(false)
      }),

      it("returns true for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isUnfriendly(character)).toBe(true)
      }),

      it("returns true for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isUnfriendly(character)).toBe(true)
      }),

      it("returns true for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isUnfriendly(character)).toBe(true)
      }),

      it("returns true for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isUnfriendly(character)).toBe(true)
      })
    }),

    describe("isMook", () => {
      it("returns true for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isMook(character)).toBe(true)
      }),

      it("returns false for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isMook(character)).toBe(false)
      }),

      it("returns false for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isMook(character)).toBe(false)
      }),

      it("returns false for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isMook(character)).toBe(false)
      }),

      it("returns false for an Ally", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isMook(character)).toBe(false)
      }),

      it("returns false for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isMook(character)).toBe(false)
      })
    }),

    describe("isPC", () => {
      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isPC(character)).toBe(false)
      }),

      it("returns false for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isPC(character)).toBe(false)
      }),

      it("returns false for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isPC(character)).toBe(false)
      }),

      it("returns false for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isPC(character)).toBe(false)
      }),

      it("returns false for an Ally", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isPC(character)).toBe(false)
      }),

      it("returns true for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isPC(character)).toBe(true)
      })
    }),

    describe("isAlly", () => {
      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isAlly(character)).toBe(false)
      }),

      it("returns false for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isAlly(character)).toBe(false)
      }),

      it("returns false for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isAlly(character)).toBe(false)
      }),

      it("returns true for an Ally", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isAlly(character)).toBe(true)
      }),

      it("returns false for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isAlly(character)).toBe(false)
      })
    }),

    describe("isBoss", () => {
      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isBoss(character)).toBe(false)
      }),

      it("returns false for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isBoss(character)).toBe(false)
      }),

      it("returns true for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isBoss(character)).toBe(true)
      }),

      it("returns false for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isBoss(character)).toBe(false)
      }),

      it("returns false for an Ally", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isBoss(character)).toBe(false)
      }),

      it("returns false for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isBoss(character)).toBe(false)
      })
    }),

    describe("isTask", () => {
      it.only("returns true for a Task", () => {
        const character: Character = {
          ...defaultCharacter,
          task: true
        }

        expect(CS.isTask(character)).toBe(true)
      }),

      it("returns false for a non-Task", () => {
        expect(CS.isTask(defaultCharacter)).toBe(false)
      })
    }),

    describe("isFeaturedFoe", () => {
      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isFeaturedFoe(character)).toBe(false)
      }),

      it("returns false for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isFeaturedFoe(character)).toBe(false)
      }),

      it("returns false for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isFeaturedFoe(character)).toBe(false)
      }),

      it("returns true for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isFeaturedFoe(character)).toBe(true)
      }),

      it("returns false for an Ally", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isFeaturedFoe(character)).toBe(false)
      }),

      it("returns false for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isFeaturedFoe(character)).toBe(false)
      })
    }),

    describe("isUberBoss", () => {
      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isUberBoss(character)).toBe(false)
      }),

      it("returns true for an Uber-Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.isUberBoss(character)).toBe(true)
      }),

      it("returns false for a Boss", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.isUberBoss(character)).toBe(false)
      }),

      it("returns false for a Featured Foe", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.isUberBoss(character)).toBe(false)
      }),

      it("returns false for an Ally", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.isUberBoss(character)).toBe(false)
      }),

      it("returns false for a PC", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.isUberBoss(character)).toBe(false)
      })
    }),

    describe("isType", () => {
      it("compares the type", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.isType(character, CharacterTypes.Mook)).toBe(true)
      })
    }),

    describe("actionValue", () => {
      it("returns a numeric action value", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "Guns": 13
          }
        }

        expect(CS.actionValue(character, "Guns")).toBe(13)
      }),

      it("returns an action value, reduced by impairment", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "Guns": 13
          },
          impairments: 1
        }

        expect(CS.actionValue(character, "Guns")).toBe(12)
      })
    }),

    describe("rawActionValue", () => {
      it("returns a numeric action value", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "Guns": 13
          }
        }

        expect(CS.rawActionValue(character, "Guns")).toBe(13)
      }),

      it("returns an action value, unmodified by impairment", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "Guns": 13
          },
          impairments: 1
        }

        expect(CS.rawActionValue(character, "Guns")).toBe(13)
      })
    }),

    describe("otherActionValue", () => {
      it("returns a string action value", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "MainAttack": "Guns"
          }
        }

        expect(CS.otherActionValue(character, "MainAttack")).toBe("Guns")
      })
    }),

    describe("faction", () => {
      it("returns a character's faction", () => {
        const faction: Faction = {
          ...defaultFaction,
          name: "The Dragons"
        }
        const character: Character = {
          ...defaultCharacter,
          faction: faction
        }

        expect(CS.faction(character)).toBe(faction)
      })
    }),

    describe("impairments", () => {
      it("returns the number of impairments", () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 2
        }

        expect(CS.impairments(character)).toBe(2)
      })
    }),

    describe("isImpaired", () => {
      it("returns true if the character has impairments", () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 2
        }

        expect(CS.isImpaired(character)).toBe(true)
      }),

      it("returns false if the character has no impairments", () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 0
        }

        expect(CS.isImpaired(character)).toBe(false)
      })
    }),

    describe("addImpairments", () => {
      it("adds an impairment", () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 0
        }

        const updatedCharacter = CS.addImpairments(character, 1)
        expect(CS.impairments(updatedCharacter)).toBe(1)
      })
    }),

    describe("calculateImpairments", () => {
      it("returns zero for a mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(CS.calculateImpairments(character, 24, 35)).toBe(0)
      }),

      it("returns 1 for an Uber-Boss going from 39 to 40", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.calculateImpairments(character, 39, 40)).toBe(1)
      }),

      it("returns 1 for an Uber-Boss going from 44 to 45", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.calculateImpairments(character, 44, 45)).toBe(1)
      }),

      it("returns 2 for an Uber-Boss going from 39 to 45", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(CS.calculateImpairments(character, 39, 45)).toBe(2)
      }),

      it("returns 1 for a Boss going from 39 to 40", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.calculateImpairments(character, 39, 40)).toBe(1)
      }),

      it("returns 1 for a Boss going from 44 to 45", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.calculateImpairments(character, 44, 45)).toBe(1)
      }),

      it("returns 2 for a Boss going from 39 to 45", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(CS.calculateImpairments(character, 39, 45)).toBe(2)
      }),

      it("returns 1 for a PC going from 24 to 25", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.calculateImpairments(character, 24, 25)).toBe(1)
      }),

      it("returns 1 for a PC going from 29 to 30", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.calculateImpairments(character, 29, 30)).toBe(1)
      }),

      it("returns 2 for a PC going from 24 to 30", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(CS.calculateImpairments(character, 24, 30)).toBe(2)
      }),

      it("returns 1 for an Ally going from 24 to 25", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.calculateImpairments(character, 24, 25)).toBe(1)
      }),

      it("returns 1 for an Ally going from 29 to 30", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.calculateImpairments(character, 29, 30)).toBe(1)
      }),

      it("returns 2 for an Ally going from 24 to 30", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(CS.calculateImpairments(character, 24, 30)).toBe(2)
      }),

      it("returns 1 for a Featured Foe going from 24 to 25", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.calculateImpairments(character, 24, 25)).toBe(1)
      }),

      it("returns 1 for a Featured Foe going from 29 to 30", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.calculateImpairments(character, 29, 30)).toBe(1)
      }),

      it("returns 2 for a Featured Foe going from 24 to 30", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(CS.calculateImpairments(character, 24, 30)).toBe(2)
      })
    }),

    describe("updateActionValue", () => {
      it("updates an action value", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "Action Value": 24
          }
        }

        const updatedCharacter = CS.updateActionValue(character, "Action Value", 25)

        expect(updatedCharacter.action_values["Action Value"]).toBe(25)
      })
    }),

    describe("updateValue", () => {
      it("updates a value", () => {
        const character: Character = {
          ...defaultCharacter,
          impairments: 0
        }

        const updatedCharacter = CS.updateValue(character, "impairments", 2)

        expect(updatedCharacter.impairments).toBe(2)
      })
    }),

    describe("setInitiative", () => {
      it("sets the current shot, reducing it by the existing current shot", () => {
        const character: Character = {
          ...defaultCharacter,
          current_shot: -1
        }

        const updatedCharacter = CS.setInitiative(character, 5)
        expect(updatedCharacter.current_shot).toBe(4)
      }),

      it("sets the current shot if no existing current shot exists", () => {
        const updatedCharacter = CS.setInitiative(defaultCharacter, 5)
        expect(updatedCharacter.current_shot).toBe(5)
      })
    }),

    describe("rollInitiative", () => {
      it("takes a roll and adds it to their Speed to set the current_shot", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            "Speed": 5
          }
        }

        const updatedCharacter = CS.rollInitiative(character, 4)
        expect(updatedCharacter.current_shot).toBe(9)
      })
    }),

    describe("seriousPoints", () => {
      it("returns false for a Mook", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          },
        }

        expect(CS.seriousPoints(character, 50)).toBe(false)
      }),

      it("returns true for an Uber-Boss with 50 or more", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.UberBoss
          },
        }

        expect(CS.seriousPoints(character, 50)).toBe(true)
      }),

      it("returns true for a Boss with 50 or more", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Boss
          },
        }

        expect(CS.seriousPoints(character, 50)).toBe(true)
      }),

      it("returns true for a PC with 35 or more", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.PC
          },
        }

        expect(CS.seriousPoints(character, 35)).toBe(true)
      }),

      it("returns true for an Ally with 35 or more", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Ally
          },
        }

        expect(CS.seriousPoints(character, 35)).toBe(true)
      }),

      it("returns true for a Featured Foe with 35 or more", () => {
        const character: Character = {
          ...defaultCharacter,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.FeaturedFoe
          },
        }

        expect(CS.seriousPoints(character, 35)).toBe(true)
      })
    }),

    describe("mooks", () => {
      it("returns the count of Mooks", () => {
        const character: Character = {
          ...defaultCharacter,
          count: 15,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          },
        }

        expect(CS.mooks(character)).toBe(15)
      }),

      it("returns zero for a non Mook", () => {
        expect(CS.mooks(defaultCharacter)).toBe(0)
      })
    }),

    describe("killMooks", () => {
      it("reduces the count of mooks", () => {
        const character: Character = {
          ...defaultCharacter,
          count: 15,
          action_values: {
            ...defaultCharacter.action_values,
            Type: CharacterTypes.Mook
          },
        }

        const updatedCharacter = CS.killMooks(character, 5)
        expect(updatedCharacter.count).toBe(10)
      })
    })
  })
})
