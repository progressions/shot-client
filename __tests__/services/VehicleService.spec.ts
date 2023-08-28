import VS from "@/services/VehicleService"
import CS from "@/services/CharacterService"
import type { Faction, Character, Vehicle } from "@/types/types"
import { CharacterTypes, defaultCharacter, defaultVehicle } from "@/types/types"

describe("VehicleService", () => {
  describe("mainAttackValue", () => {
    it("returns the driver's Driving skill", async () => {
      const character: Character = {
        ...defaultCharacter,
        id: "123",
        skills: {
          ...defaultCharacter.skills,
          Driving: 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: character
      }
      expect(VS.mainAttackValue(vehicle)).toEqual(13)
    }),

    it("returns 7 if there's no driver", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: undefined
      }
      expect(VS.mainAttackValue(vehicle)).toEqual(7)
    }),

    it("returns the driver's Driving skill, modified by the vehicle's impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        id: "123",
        skills: {
          ...defaultCharacter.skills,
          Driving: 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: character
      }
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.mainAttackValue(updatedVehicle)).toEqual(12)
    }),

    it("returns the driver's Driving skill, modified by the driver's impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        id: "123",
        skills: {
          ...defaultCharacter.skills,
          Driving: 13
        }
      }
      const updatedCharacter = CS.addImpairments(character, 1)
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: updatedCharacter
      }
      expect(VS.mainAttackValue(vehicle)).toEqual(12)
    })
  }),

  describe("speed", () => {
    it("returns the Acceleration value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Acceleration", 7)
      expect(VS.speed(vehicle)).toEqual(7)
    }),

    it("returns Acceleration without impairment", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Acceleration", 7)
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.speed(updatedVehicle)).toEqual(7)
    })
  }),

  describe("defense", () => {
    it("returns the driver's Driving skill", async () => {
      const character: Character = {
        ...defaultCharacter,
        id: "123",
        skills: {
          ...defaultCharacter.skills,
          Driving: 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: character
      }
      expect(VS.defense(vehicle)).toEqual(13)
    }),

    it("returns the driver's Driving skill, modified by the vehicle's impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        id: "123",
        skills: {
          ...defaultCharacter.skills,
          Driving: 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: character
      }
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.defense(updatedVehicle)).toEqual(12)
    }),

    it("returns the driver's Driving skill, modified by the driver's impairments", async () => {
      const character: Character = {
        ...defaultCharacter,
        id: "123",
        skills: {
          ...defaultCharacter.skills,
          Driving: 13
        }
      }
      const updatedCharacter = VS.addImpairments(character, 1)
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: updatedCharacter
      }
      expect(VS.defense(vehicle)).toEqual(12)
    })
  }),

  describe("squeal", () => {
    it("returns the vehicle's Squeal value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Squeal", 7)
      expect(VS.squeal(vehicle)).toEqual(7)
    }),

    it("returns the Squeal without modification by impairments", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Squeal", 7)
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.squeal(updatedVehicle)).toEqual(7)
    })
  }),

  describe("frame", () => {
    it("returns the vehicle's Frame value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Frame", 7)
      expect(VS.frame(vehicle)).toEqual(7)
    }),

    it("returns the Frame without modification by impairments", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Frame", 7)
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.frame(updatedVehicle)).toEqual(7)
    })
  }),

  describe("crunch", () => {
    it("returns the vehicle's Crunch value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Crunch", 7)
      expect(VS.crunch(vehicle)).toEqual(7)
    }),

    it("returns the Crunch without modification by impairments", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Crunch", 7)
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.crunch(updatedVehicle)).toEqual(7)
    })
  }),

  describe("handling", () => {
    it("returns the vehicle's Handling value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Handling", 7)
      expect(VS.handling(vehicle)).toEqual(7)
    }),

    it("returns the Handling without modification by impairments", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Handling", 7)
      const updatedVehicle = VS.addImpairments(vehicle, 1)
      expect(VS.handling(updatedVehicle)).toEqual(7)
    })
  }),

  describe("isPursuer", () => {
    it("returns true if the vehicle is a Pursuer", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Pursuer", "true")
      expect(VS.isPursuer(vehicle)).toEqual(true)
    }),

    it("returns false if the vehicle is an Evader", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Pursuer", "false")
      expect(VS.isPursuer(vehicle)).toEqual(false)
    })
  }),

  describe("isEvader", () => {
    it("returns false if the vehicle is a Pursuer", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Pursuer", "true")
      expect(VS.isEvader(vehicle)).toEqual(false)
    }),

    it("returns true if the vehicle is an Evader", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Pursuer", "false")
      expect(VS.isEvader(vehicle)).toEqual(true)
    })
  }),

  describe("isNear", () => {
    it("returns true if the vehicle's Position is 'near'", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Position", "near")
      expect(VS.isNear(vehicle)).toEqual(true)
    }),

    it("returns false if the vehicle's Position is 'far'", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Position", "far")
      expect(VS.isNear(vehicle)).toEqual(false)
    })
  }),

  describe("isFar", () => {
    it("returns false if the vehicle's Position is 'near'", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Position", "near")
      expect(VS.isFar(vehicle)).toEqual(false)
    }),

    it("returns true if the vehicle's Position is 'far'", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Position", "far")
      expect(VS.isFar(vehicle)).toEqual(true)
    })
  }),

  describe("position", () => {
    it("returns the vehicle's Position value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Position", "near")
      expect(VS.position(vehicle)).toEqual("near")
    })
  }),

  describe("chasePoints", () => {
    it("returns the vehicle Chase Points value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Chase Points", 7)
      expect(VS.chasePoints(vehicle)).toEqual(7)
    })
  }),

  describe("conditionPoints", () => {
    it("returns the vehicle Condition Points value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Condition Points", 7)
      expect(VS.conditionPoints(vehicle)).toEqual(7)
    })
  }),

  describe("seriousChasePoints", () => {
    it("returns true if an Uber-Boss has more than 50 Chase Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.UberBoss,
          Toughness: 8,
          "Chase Points": 51
        }
      }

      expect(VS.seriousChasePoints(vehicle)).toBe(true)
    }),

    it("returns true if a Boss has more than 50 Chase Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.Boss,
          Toughness: 8,
          "Chase Points": 51
        }
      }

      expect(VS.seriousChasePoints(vehicle)).toBe(true)
    }),

    it("returns true if a Featured Foe has more than 35 Chase Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.FeaturedFoe,
          Toughness: 8,
          "Chase Points": 36
        }
      }

      expect(VS.seriousChasePoints(vehicle)).toBe(true)
    })

    it("returns true if an Ally has more than 35 Chase Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.Ally,
          Toughness: 8,
          "Chase Points": 36
        }
      }

      expect(VS.seriousChasePoints(vehicle)).toBe(true)
    }),

    it("returns true if a PC has more than 35 Chase Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.PC,
          Toughness: 8,
          "Chase Points": 36
        }
      }

      expect(VS.seriousChasePoints(vehicle)).toBe(true)
    }),

    it("returns false for a mook", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        count: 5,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.Mook,
        }
      }

      expect(VS.seriousChasePoints(vehicle)).toBe(false)
    })
  }),

  describe("seriousConditionPoints", () => {
    it("returns true if an Uber-Boss has more than 50 Condition Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.UberBoss,
          Toughness: 8,
          "Condition Points": 51
        }
      }

      expect(VS.seriousConditionPoints(vehicle)).toBe(true)
    }),

    it("returns true if a Boss has more than 50 Condition Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.Boss,
          Toughness: 8,
          "Condition Points": 51
        }
      }

      expect(VS.seriousConditionPoints(vehicle)).toBe(true)
    }),

    it("returns true if a Featured Foe has more than 35 Condition Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.FeaturedFoe,
          Toughness: 8,
          "Condition Points": 36
        }
      }

      expect(VS.seriousConditionPoints(vehicle)).toBe(true)
    })

    it("returns true if an Ally has more than 35 Condition Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.Ally,
          Toughness: 8,
          "Condition Points": 36
        }
      }

      expect(VS.seriousConditionPoints(vehicle)).toBe(true)
    }),

    it("returns true if a PC has more than 35 Condition Points", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.PC,
          Toughness: 8,
          "Condition Points": 36
        }
      }

      expect(VS.seriousConditionPoints(vehicle)).toBe(true)
    }),

    it("returns false for a mook", async () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        count: 5,
        action_values: {
          ...defaultVehicle.action_values,
          Type: CharacterTypes.Mook,
        }
      }

      expect(VS.seriousConditionPoints(vehicle)).toBe(false)
    })
  }),

  describe("damageReduction", () => {
    it("returns the vehicle's Handling value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Handling", 7)
      expect(VS.damageReduction(vehicle)).toEqual(7)
    }),

    it("returns the vehicle's Frame value", async () => {
      const vehicle: Vehicle = VS.updateActionValue(defaultVehicle, "Frame", 7)
      expect(VS.damageReduction(vehicle, "frame")).toEqual(7)
    })
  }),

  describe("evade", () => {
    it("applies Chase Points to the target, reduced by the target's Handling value", async () => {
      const attacker = { ...defaultVehicle }
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7 } }
      const [updatedAttacker, updatedTarget] = VS.evade(attacker, 17, target)
      expect(updatedAttacker).toEqual(attacker)
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
    })
  }),

  describe("narrowTheGap", () => {
    it("applies Chase Points to the target and changes position to 'near'", async () => {
      const attacker = { ...defaultVehicle }
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 3 } }
      const [updatedAttacker, updatedTarget] = VS.narrowTheGap(attacker, 17, target)
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.isNear(updatedAttacker)).toBe(true)
      expect(VS.isNear(updatedTarget)).toBe(true)
    })
  }),

  describe("widenTheGap", () => {
    it("applies Chase Points to the target and changes position to 'far'", async () => {
      const attacker = { ...defaultVehicle }
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 3 } }
      const [updatedAttacker, updatedTarget] = VS.widenTheGap(attacker, 17, target)
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.isFar(updatedAttacker)).toBe(true)
      expect(VS.isFar(updatedTarget)).toBe(true)
    })
  }),

  describe("ramSideswipe", () => {
    it("applies Chase and Condition Points to the target", async () => {
      const attacker = { ...defaultVehicle }
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Frame: 7, Handling: 3 } }
      const [updatedAttacker, updatedTarget] = VS.ramSideswipe(attacker, 17, target)
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(10)
    }),

    it("applies a Chase Points bump to the attacker if the target's frame is higher", async () => {
      const attacker = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Frame: 3, Handling: 7 } }
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Frame: 7, Handling: 3 } }
      const [updatedAttacker, updatedTarget] = VS.ramSideswipe(attacker, 17, target)
      expect(VS.chasePoints(updatedAttacker)).toEqual(4)
      expect(VS.conditionPoints(updatedAttacker)).toEqual(4)
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(10)
    })
  }),

  describe("takeChasePoints", () => {
    it("applies Chase Points to the target, reduced by the target's Handling", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7 } }
      const updatedTarget = VS.takeChasePoints(target, 17)
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
    }),

    it("applies Chase Points to the target, reduced by the target's Frame", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Frame: 7 } }
      const updatedTarget = VS.takeChasePoints(target, 17, "frame")
      expect(VS.chasePoints(updatedTarget)).toEqual(10)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
    }),

    it("adds an Impairment when a PC goes from 24 to 25 Chase Points", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Type: CharacterTypes.PC } }
      const updatedTarget = VS.takeChasePoints(target, 25)
      expect(VS.chasePoints(updatedTarget)).toEqual(25)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.impairments(updatedTarget)).toEqual(1)
    }),

    it("adds a second Impairment when a PC goes from 29 to 30 Chase Points", async () => {
      const target = { ...defaultVehicle, impairments: 1, action_values: { ...defaultVehicle.action_values, Type: CharacterTypes.PC, "Chase Points": 29 } }
      const updatedTarget = VS.takeChasePoints(target, 1)
      expect(VS.chasePoints(updatedTarget)).toEqual(30)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.impairments(updatedTarget)).toEqual(2)
    }),

    it("adds 2 impairments when a PC goes from 24 to 30 Chase Points", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Type: CharacterTypes.PC, "Chase Points": 24 } }
      const updatedTarget = VS.takeChasePoints(target, 6)
      expect(VS.chasePoints(updatedTarget)).toEqual(30)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.impairments(updatedTarget)).toEqual(2)
    })
  }),

  describe("takeRawChasePoints", () => {
    it("applies Chase Points to the target, ignoring the target's Handling and Frame", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 4 } }
      const updatedTarget = VS.takeRawChasePoints(target, 17)
      expect(VS.chasePoints(updatedTarget)).toEqual(17)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.impairments(updatedTarget)).toEqual(0)
    })
  }),

  describe("takeRawConditionPoints", () => {
    it("applies Condition Points to the target, ignoring the target's Handling and Frame", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 4 } }
      const updatedTarget = VS.takeRawConditionPoints(target, 17)
      expect(VS.chasePoints(updatedTarget)).toEqual(0)
      expect(VS.conditionPoints(updatedTarget)).toEqual(17)
      expect(VS.impairments(updatedTarget)).toEqual(0)
    })
  }),

  describe("calculateChasePoints", () => {
    it("calculates the Chase Points reduced by the target's Handling", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 3 } }
      expect(VS.calculateChasePoints(target, 17)).toEqual(10)
    }),

    it("calculates the Chase Points reduced by the target's Handling", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 3 } }
      expect(VS.calculateChasePoints(target, 17, "frame")).toEqual(14)
    })
  }),

  describe("calculateConditionPoints", () => {
    it("calculates the Condition Points reduced by the target's Frame", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 3 } }
      expect(VS.calculateConditionPoints(target, 17)).toEqual(14)
    }),

    it("calculates the Condition Points reduced by the target's Handling", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Handling: 7, Frame: 3 } }
      expect(VS.calculateConditionPoints(target, 17, "handling")).toEqual(10)
    })
  }),

  describe("healChasePoints", () => {
    it("heals the target's Chase Points", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, "Chase Points": 17 } }
      const updatedTarget = VS.healChasePoints(target, 10)
      expect(VS.chasePoints(updatedTarget)).toEqual(7)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
    }),

    it("removes an Impairment when the target's Chase Points go from 30 to 29", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, "Chase Points": 30 }, impairments: 2 }
      const updatedTarget = VS.healChasePoints(target, 1)
      expect(VS.chasePoints(updatedTarget)).toEqual(29)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.impairments(updatedTarget)).toEqual(1)
    }),

    it("removes an Impairment when the target's Chase Points go from 25 to 24", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, "Chase Points": 25 }, impairments: 1 }
      const updatedTarget = VS.healChasePoints(target, 1)
      expect(VS.chasePoints(updatedTarget)).toEqual(24)
      expect(VS.conditionPoints(updatedTarget)).toEqual(0)
      expect(VS.impairments(updatedTarget)).toEqual(0)
    })
  }),

  describe("changePosition", () => {
    it("changes the Position value from 'far' to 'near'", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Position: "far" } }
      const updatedTarget = VS.changePosition(target)
      expect(VS.position(updatedTarget)).toEqual("near")
    }),

    it("changes the Position value from 'near' to 'far'", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Position: "near" } }
      const updatedTarget = VS.changePosition(target)
      expect(VS.position(updatedTarget)).toEqual("far")
    })
  }),

  describe("updatePosition", () => {
    it("sets the Position value to 'far'", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Position: "near" } }
      const updatedTarget = VS.updatePosition(target, "far")
      expect(VS.position(updatedTarget)).toEqual("far")
    }),

    it("sets the Position value to 'near'", async () => {
      const target = { ...defaultVehicle, action_values: { ...defaultVehicle.action_values, Position: "far" } }
      const updatedTarget = VS.updatePosition(target, "near")
      expect(VS.position(updatedTarget)).toEqual("near")
    })
  }),

  describe("updateDriver", () => {
    it("sets the Driver to a Character", async () => {
      const driver = { ...defaultCharacter, id: "123", name: "Max" }
      const vehicle = { ...defaultVehicle }
      const updatedVehicle = VS.updateDriver(vehicle, driver)
      expect(updatedVehicle.driver).toEqual(driver)
    }),

    it("sets the Driver to null", async () => {
      const driver = { ...defaultCharacter, id: "123", name: "Max" }
      const vehicle = { ...defaultVehicle, driver: driver }
      const updatedVehicle = VS.updateDriver(vehicle, null)
      expect(updatedVehicle.driver?.id).toEqual("")
    })
  })
})
