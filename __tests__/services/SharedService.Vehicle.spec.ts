import VS from "@/services/VehicleService"
import type { Faction, Weapon, Character, Vehicle } from "@/types/types"
import { CharacterTypes, defaultFaction, defaultCharacter, defaultVehicle } from "@/types/types"

describe("SharedService", () => {
  describe("Vehicle", () => {
    describe("name", () => {
      it("returns a vehicle's name", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          name: "Brick Manly"
        }

        expect(VS.name(vehicle)).toBe("Brick Manly")
      })
    }),

    describe("hidden", () => {
      it("returns true if the vehicle is hidden", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          current_shot: undefined
        }

        expect(VS.hidden(vehicle)).toBe(true)
      }),

      it("returns false if the vehicle is on a shot", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          current_shot: 1
        }

        expect(VS.hidden(vehicle)).toBe(false)
      })
    }),

    describe("type", () => {
      it("returns the vehicle's type", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.type(vehicle)).toBe(CharacterTypes.PC)
      })
    }),

    describe("isVehicle", () => {
      it("returns false for a character", async () => {
        const character: Character = defaultCharacter

        expect(VS.isVehicle(character)).toBe(false)
      })
    }),

    describe("isVehicle", () => {
      it("returns true for a vehicle", async () => {
        const vehicle: Vehicle = defaultVehicle

        expect(VS.isVehicle(vehicle)).toBe(true)
      })
    }),

    describe("isFriendly", () => {
      it("returns true for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isFriendly(vehicle)).toBe(true)
      }),

      it("returns true for an Ally", async() => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isFriendly(vehicle)).toBe(true)
      }),

      it("returns false for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isFriendly(vehicle)).toBe(false)
      }),

      it("returns false for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isFriendly(vehicle)).toBe(false)
      }),

      it("returns false for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isFriendly(vehicle)).toBe(false)
      }),

      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isFriendly(vehicle)).toBe(false)
      })
    }),

    describe("isUnfriendly", () => {
      it("returns false for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isUnfriendly(vehicle)).toBe(false)
      }),

      it("returns false for an Ally", async() => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isUnfriendly(vehicle)).toBe(false)
      }),

      it("returns true for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isUnfriendly(vehicle)).toBe(true)
      }),

      it("returns true for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isUnfriendly(vehicle)).toBe(true)
      }),

      it("returns true for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isUnfriendly(vehicle)).toBe(true)
      }),

      it("returns true for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isUnfriendly(vehicle)).toBe(true)
      })
    }),

    describe("isMook", () => {
      it("returns true for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isMook(vehicle)).toBe(true)
      }),

      it("returns false for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isMook(vehicle)).toBe(false)
      }),

      it("returns false for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isMook(vehicle)).toBe(false)
      }),

      it("returns false for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isMook(vehicle)).toBe(false)
      }),

      it("returns false for an Ally", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isMook(vehicle)).toBe(false)
      }),

      it("returns false for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isMook(vehicle)).toBe(false)
      })
    }),

    describe("isPC", () => {
      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isPC(vehicle)).toBe(false)
      }),

      it("returns false for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isPC(vehicle)).toBe(false)
      }),

      it("returns false for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isPC(vehicle)).toBe(false)
      }),

      it("returns false for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isPC(vehicle)).toBe(false)
      }),

      it("returns false for an Ally", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isPC(vehicle)).toBe(false)
      }),

      it("returns true for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isPC(vehicle)).toBe(true)
      })
    }),

    describe("isAlly", () => {
      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isAlly(vehicle)).toBe(false)
      }),

      it("returns false for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isAlly(vehicle)).toBe(false)
      }),

      it("returns false for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isAlly(vehicle)).toBe(false)
      }),

      it("returns true for an Ally", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isAlly(vehicle)).toBe(true)
      }),

      it("returns false for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isAlly(vehicle)).toBe(false)
      })
    }),

    describe("isBoss", () => {
      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isBoss(vehicle)).toBe(false)
      }),

      it("returns false for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isBoss(vehicle)).toBe(false)
      }),

      it("returns true for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isBoss(vehicle)).toBe(true)
      }),

      it("returns false for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isBoss(vehicle)).toBe(false)
      }),

      it("returns false for an Ally", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isBoss(vehicle)).toBe(false)
      }),

      it("returns false for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isBoss(vehicle)).toBe(false)
      })
    }),

    describe("isTask", () => {
      it.only("returns true for a Task", () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          task: true
        }

        expect(VS.isTask(vehicle)).toBe(true)
      }),

      it("returns false for a non-Task", () => {
        expect(VS.isTask(defaultVehicle)).toBe(false)
      })
    }),

    describe("isFeaturedFoe", () => {
      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isFeaturedFoe(vehicle)).toBe(false)
      }),

      it("returns false for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isFeaturedFoe(vehicle)).toBe(false)
      }),

      it("returns false for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isFeaturedFoe(vehicle)).toBe(false)
      }),

      it("returns true for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isFeaturedFoe(vehicle)).toBe(true)
      }),

      it("returns false for an Ally", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isFeaturedFoe(vehicle)).toBe(false)
      }),

      it("returns false for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isFeaturedFoe(vehicle)).toBe(false)
      })
    }),

    describe("isUberBoss", () => {
      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isUberBoss(vehicle)).toBe(false)
      }),

      it("returns true for an Uber-Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.isUberBoss(vehicle)).toBe(true)
      }),

      it("returns false for a Boss", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.isUberBoss(vehicle)).toBe(false)
      }),

      it("returns false for a Featured Foe", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.isUberBoss(vehicle)).toBe(false)
      }),

      it("returns false for an Ally", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.isUberBoss(vehicle)).toBe(false)
      }),

      it("returns false for a PC", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.isUberBoss(vehicle)).toBe(false)
      })
    }),

    describe("isType", () => {
      it("compares the type", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.isType(vehicle, CharacterTypes.Mook)).toBe(true)
      })
    }),

    describe("actionValue", () => {
      it("returns a numeric action value", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "Guns": 13
          }
        }

        expect(VS.actionValue(vehicle, "Guns")).toBe(13)
      }),

      it("returns an action value, reduced by impairment", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "Guns": 13
          },
          impairments: 1
        }

        expect(VS.actionValue(vehicle, "Guns")).toBe(12)
      })
    }),

    describe("rawActionValue", () => {
      it("returns a numeric action value", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "Guns": 13
          }
        }

        expect(VS.rawActionValue(vehicle, "Guns")).toBe(13)
      }),

      it("returns an action value, unmodified by impairment", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "Guns": 13
          },
          impairments: 1
        }

        expect(VS.rawActionValue(vehicle, "Guns")).toBe(13)
      })
    }),

    describe("otherActionValue", () => {
      it("returns a string action value", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "MainAttack": "Guns"
          }
        }

        expect(VS.otherActionValue(vehicle, "MainAttack")).toBe("Guns")
      })
    }),

    describe("faction", () => {
      it("returns a vehicle's faction", async () => {
        const faction: Faction = {
          ...defaultFaction,
          name: "The Dragons"
        }
        const vehicle: Vehicle = {
          ...defaultVehicle,
          faction: faction
        }

        expect(VS.faction(vehicle)).toBe(faction)
      })
    }),

    describe("impairments", () => {
      it("returns the number of impairments", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          impairments: 2
        }

        expect(VS.impairments(vehicle)).toBe(2)
      })
    }),

    describe("isImpaired", () => {
      it("returns true if the vehicle has impairments", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          impairments: 2
        }

        expect(VS.isImpaired(vehicle)).toBe(true)
      }),

      it("returns false if the vehicle has no impairments", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          impairments: 0
        }

        expect(VS.isImpaired(vehicle)).toBe(false)
      })
    }),

    describe("addImpairments", () => {
      it("adds an impairment", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          impairments: 0
        }

        const updatedVehicle = VS.addImpairments(vehicle, 1)
        expect(VS.impairments(updatedVehicle)).toBe(1)
      })
    }),

    describe("calculateImpairments", () => {
      it("returns zero for a mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 35)).toBe(0)
      }),

      it("returns 1 for an Uber-Boss going from 39 to 40", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.calculateImpairments(vehicle, 39, 40)).toBe(1)
      }),

      it("returns 1 for an Uber-Boss going from 44 to 45", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.calculateImpairments(vehicle, 44, 45)).toBe(1)
      }),

      it("returns 2 for an Uber-Boss going from 39 to 45", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          }
        }

        expect(VS.calculateImpairments(vehicle, 39, 45)).toBe(2)
      }),

      it("returns 1 for a Boss going from 39 to 40", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.calculateImpairments(vehicle, 39, 40)).toBe(1)
      }),

      it("returns 1 for a Boss going from 44 to 45", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.calculateImpairments(vehicle, 44, 45)).toBe(1)
      }),

      it("returns 2 for a Boss going from 39 to 45", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          }
        }

        expect(VS.calculateImpairments(vehicle, 39, 45)).toBe(2)
      }),

      it("returns 1 for a PC going from 24 to 25", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 25)).toBe(1)
      }),

      it("returns 1 for a PC going from 29 to 30", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.calculateImpairments(vehicle, 29, 30)).toBe(1)
      }),

      it("returns 2 for a PC going from 24 to 30", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 30)).toBe(2)
      }),

      it("returns 1 for a Ally going from 24 to 25", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 25)).toBe(1)
      }),

      it("returns 1 for a Ally going from 29 to 30", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.calculateImpairments(vehicle, 29, 30)).toBe(1)
      }),

      it("returns 2 for a Ally going from 24 to 30", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 30)).toBe(2)
      })

      it("returns 1 for a Featured Foe going from 24 to 25", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 25)).toBe(1)
      }),

      it("returns 1 for a Featured Foe going from 29 to 30", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.calculateImpairments(vehicle, 29, 30)).toBe(1)
      }),

      it("returns 2 for a Featured Foe going from 24 to 30", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          }
        }

        expect(VS.calculateImpairments(vehicle, 24, 30)).toBe(2)
      })
    }),

    describe("updateActionValue", () => {
      it("updates an action value", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "Action Value": 24
          }
        }

        const updatedVehicle = VS.updateActionValue(vehicle, "Action Value", 25)

        expect(updatedVehicle.action_values["Action Value"]).toBe(25)
      })
    }),

    describe("updateValue", () => {
      it("updates a value", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          impairments: 0
        }

        const updatedVehicle = VS.updateValue(vehicle, "impairments", 2)

        expect(updatedVehicle.impairments).toBe(2)
      })
    }),

    describe("setInitiative", () => {
      it("sets the current shot, reducing it by the existing current shot", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          current_shot: -1
        }

        const updatedVehicle = VS.setInitiative(vehicle, 5)
        expect(updatedVehicle.current_shot).toBe(4)
      }),

      it("sets the current shot if no existing current shot exists", async () => {
        const updatedVehicle = VS.setInitiative(defaultVehicle, 5)
        expect(updatedVehicle.current_shot).toBe(5)
      })
    }),

    describe("rollInitiative", () => {
      it("takes a roll and adds it to their Speed to set the current_shot", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            "Speed": 5
          }
        }

        const updatedVehicle = VS.rollInitiative(vehicle, 4)
        expect(updatedVehicle.current_shot).toBe(9)
      })
    }),

    describe("seriousPoints", () => {
      it("returns false for a Mook", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          },
        }

        expect(VS.seriousPoints(vehicle, 50)).toBe(false)
      }),

      it("returns true for an Uber-Boss with 50 or more", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.UberBoss
          },
        }

        expect(VS.seriousPoints(vehicle, 50)).toBe(true)
      }),

      it("returns true for a Boss with 50 or more", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Boss
          },
        }

        expect(VS.seriousPoints(vehicle, 50)).toBe(true)
      }),

      it("returns true for a PC with 35 or more", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.PC
          },
        }

        expect(VS.seriousPoints(vehicle, 35)).toBe(true)
      }),

      it("returns true for an Ally with 35 or more", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Ally
          },
        }

        expect(VS.seriousPoints(vehicle, 35)).toBe(true)
      }),

      it("returns true for a Featured Foe with 35 or more", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.FeaturedFoe
          },
        }

        expect(VS.seriousPoints(vehicle, 35)).toBe(true)
      })
    }),

    describe("mooks", () => {
      it("returns the count of Mooks", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          count: 15,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          },
        }

        expect(VS.mooks(vehicle)).toBe(15)
      }),

      it("returns zero for a non Mook", async () => {
        expect(VS.mooks(defaultVehicle)).toBe(0)
      })
    }),

    describe("killMooks", () => {
      it("reduces the count of mooks", async () => {
        const vehicle: Vehicle = {
          ...defaultVehicle,
          count: 15,
          action_values: {
            ...defaultVehicle.action_values,
            Type: CharacterTypes.Mook
          },
        }

        const updatedVehicle = VS.killMooks(vehicle, 5)
        expect(updatedVehicle.count).toBe(10)
      })
    })
  })
})
