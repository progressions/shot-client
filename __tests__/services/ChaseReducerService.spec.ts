import type { Swerve, Character, Vehicle } from "../../types/types"
import { defaultSwerve, defaultCharacter, defaultVehicle } from "../../types/types"
import { initialChaseState, ChaseState } from "../../reducers/chaseState"
import CRS from "../../services/ChaseReducerService"

describe("ChaseReducerService", () => {
  describe("calculateDefense", () => {
    it("returns the state's defense value", () => {
      const driver: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Driving": 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: driver
      }
      const state = {
        ...initialChaseState,
        defense: 13,
        target: vehicle
      }
      const defense = CRS.calculateDefense(state)
      expect(defense).toEqual("13")
    }),

    it("returns a defense value with a +2 bonus if the state's stunt is true", () => {
      const driver: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Driving": 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        driver: driver
      }
      const state = {
        ...initialChaseState,
        defense: 13,
        target: vehicle,
        stunt: true
      }
      const defense = CRS.calculateDefense(state)
      expect(defense).toEqual("15*")
    }),

    it("returns a defense value with a * if the target is impaired", () => {
      const driver: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          "Driving": 13
        }
      }
      const vehicle: Vehicle = {
        ...defaultVehicle,
        impairments: 1,
        driver: driver
      }
      const state = {
        ...initialChaseState,
        defense: 13,
        target: vehicle
      }
      const defense = CRS.calculateDefense(state)
      expect(defense).toEqual("13*")
    })
  }),

  describe("calculateMainAttack", () => {
    it("returns the state's action value", () => {
      const state = {
        ...initialChaseState,
        actionValue: 13
      }
      const actionValue = CRS.calculateMainAttack(state)
      expect(actionValue).toEqual("13")
    })
  }),

  describe("targetMookDefense", () => {
    it("returns the given defense for a non-Mook", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const state = {
        ...initialChaseState,
        target: vehicle,
        count: 1,
        defense: 13
      }
      const defense = CRS.targetMookDefense(state)
      expect(defense).toEqual(13)
    }),

    it("returns the given defense for a count of 1", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Mook"
        }
      }
      const state = {
        ...initialChaseState,
        target: vehicle,
        count: 1,
        defense: 13
      }
      const defense = CRS.targetMookDefense(state)
      expect(defense).toEqual(13)
    }),

    it("adds 5 to the given defense for a count of 5", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Mook"
        }
      }
      const state = {
        ...initialChaseState,
        target: vehicle,
        count: 5,
        defense: 13
      }
      const defense = CRS.targetMookDefense(state)
      expect(defense).toEqual(18)
    }),

    it("adds 2 to the defense for a stunt", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Mook"
        }
      }
      const state = {
        ...initialChaseState,
        target: vehicle,
        count: 5,
        defense: 13,
        stunt: true
      }
      const defense = CRS.targetMookDefense(state)
      expect(defense).toEqual(20)
    })
  }),

  describe("makeAttack", () => {
    it("calls calculateMookAttackValues for a Mook", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        count: 5,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Mook"
        }
      }
      const state = {
        ...initialChaseState,
        attacker: vehicle,
        count: 5,
        defense: 13,
      }
      CRS.calculateMookAttackValues = jest.fn().mockReturnValue("called it")
      const result = CRS.makeAttack(state)
      expect(result).toEqual("called it")
    }),

    it("calls calculateAttackValues for a non-Mook", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
        count: 5,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const state = {
        ...initialChaseState,
        attacker: vehicle,
        count: 5,
        defense: 13,
      }
      CRS.calculateAttackValues = jest.fn().mockReturnValue("called it")
      const result = CRS.makeAttack(state)
      expect(result).toEqual("called it")
    })
  }),

  describe("calculateMookAttackValues", () => {
    const attacker: Vehicle = {
      ...defaultVehicle,
      count: 5,
      action_values: {
        ...defaultVehicle.action_values,
        Type: "Mook",
        "Squeal": 8
      }
    }
    const target: Vehicle = {
      ...defaultVehicle,
      action_values: {
        ...defaultVehicle.action_values,
        "Handling": 6,
      }
    }
    const state = {
      ...initialChaseState,
      attacker: attacker,
      target: target,
      count: 2,
      defense: 13,
      actionValue: 15,
      handling: 6
    }

    it.only("compiles an Array of attack results", () => {
      CRS.AS.swerve = jest.fn()
        .mockReturnValueOnce({
          ...defaultSwerve,
          result: 6
        })
        .mockReturnValueOnce({
          ...defaultSwerve,
          result: 9
        })
      const result = CRS.calculateMookAttackValues(state)
      expect(result.mookResults.length).toEqual(2)

      expect(result.mookResults[0].actionResult).toEqual(21)
      expect(result.mookResults[0].actionValue).toEqual(15)
      expect(result.mookResults[0].defense).toEqual(13)
      expect(result.mookResults[0].outcome).toEqual(8)

      // A swerve of 6 plus actionValue of 15 is 21, which is 8 over the
      // target's defense of 13, so the result is a hit, with an outcome
      // of 8. The target's handling is 6, so the result is chasePoints of 2.
      expect(result.mookResults[0].success).toEqual(true)
      expect(result.mookResults[0].chasePoints).toEqual(2)

      expect(result.mookResults[1].actionResult).toEqual(24)
      expect(result.mookResults[1].actionValue).toEqual(15)
      expect(result.mookResults[1].defense).toEqual(13)
      expect(result.mookResults[1].outcome).toEqual(11)

      // A swerve of 9 plus actionValue of 15 is 24, which is 11 over the
      // target's defense of 13, so the result is a hit, with an outcome
      // of 11. The target's handling is 6, so the result is chasePoints of 5.
      expect(result.mookResults[1].success).toEqual(true)
      expect(result.mookResults[1].chasePoints).toEqual(5)
    }),

    it.only("compiles an Array of missed attack results", () => {
      CRS.AS.swerve = jest.fn()
        .mockReturnValueOnce({
          ...defaultSwerve,
          result: -3
        })
        .mockReturnValueOnce({
          ...defaultSwerve,
          result: -7
        })
      const result = CRS.calculateMookAttackValues(state)
      expect(result.mookResults.length).toEqual(2)

      expect(result.mookResults[0].actionResult).toEqual(12)
      expect(result.mookResults[0].outcome).toEqual(-1)

      // A swerve of -3 plus actionValue of 15 is 12, which is under
      // target's defense of 13, so the result is a miss, with an outcome
      // of -1.
      expect(result.mookResults[0].success).toEqual(false)
      expect(result.mookResults[0].chasePoints).toEqual(null)

      expect(result.mookResults[1].actionResult).toEqual(8)
      expect(result.mookResults[1].outcome).toEqual(-5)

      // A swerve of 9 plus actionValue of 15 is 24, which is 11 over the
      // target's defense of 13, so the result is a hit, with an outcome
      // of 11. The target's handling is 6, so the result is chasePoints of 5.
      expect(result.mookResults[1].success).toEqual(false)
      expect(result.mookResults[1].chasePoints).toEqual(null)
    })
  })
})
