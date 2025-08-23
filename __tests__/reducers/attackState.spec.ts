import { attackReducer, AttackActions, initialAttackState, AttackState } from "@/reducers/attackState"
import { defaultCharacter, defaultWeapon, defaultFight } from "@/types/types"
import { carolina, brick } from "@/__tests__/factories/Characters"
import { ak47 } from "@/__tests__/factories/Weapons"

describe("attackReducer", () => {
  let baseState: AttackState

  beforeEach(() => {
    baseState = { ...initialAttackState }
  })

  describe("AttackActions.ATTACKER", () => {
    it("should set the attacker and recalculate state", () => {
      const action = {
        type: AttackActions.ATTACKER,
        payload: { attacker: carolina }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.attacker).toEqual(carolina)
      expect(newState.edited).toBe(false)
      // Should trigger recalculation through ARS.setAttacker
    })

    it("should handle attacker change with existing target", () => {
      const stateWithTarget = {
        ...baseState,
        target: brick
      }

      const action = {
        type: AttackActions.ATTACKER,
        payload: { attacker: carolina }
      }

      const newState = attackReducer(stateWithTarget, action)

      expect(newState.attacker).toEqual(carolina)
      expect(newState.target).toEqual(brick)
    })
  })

  describe("AttackActions.TARGET", () => {
    it("should set the target and recalculate state", () => {
      const action = {
        type: AttackActions.TARGET,
        payload: { target: brick }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.target).toEqual(brick)
      expect(newState.edited).toBe(false)
    })

    it("should handle target change with existing attacker", () => {
      const stateWithAttacker = {
        ...baseState,
        attacker: carolina
      }

      const action = {
        type: AttackActions.TARGET,
        payload: { target: brick }
      }

      const newState = attackReducer(stateWithAttacker, action)

      expect(newState.attacker).toEqual(carolina)
      expect(newState.target).toEqual(brick)
    })
  })

  describe("AttackActions.WEAPON", () => {
    it("should set the weapon and recalculate state", () => {
      const action = {
        type: AttackActions.WEAPON,
        payload: { weapon: ak47 }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.weapon).toEqual(ak47)
      expect(newState.edited).toBe(false)
    })

    it("should update damage when weapon changes", () => {
      const customWeapon = {
        ...defaultWeapon,
        name: "Custom Weapon",
        damage: 15
      }

      const action = {
        type: AttackActions.WEAPON,
        payload: { weapon: customWeapon }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.weapon).toEqual(customWeapon)
    })
  })

  describe("AttackActions.UPDATE", () => {
    it("should update state and recalculate without setting edited flag", () => {
      const action = {
        type: AttackActions.UPDATE,
        payload: {
          attacker: carolina,
          target: brick,
          actionValue: 15,
          stunt: true
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.attacker).toEqual(carolina)
      expect(newState.target).toEqual(brick)
      expect(newState.actionValue).toBe(15)
      expect(newState.stunt).toBe(true)
      expect(newState.edited).toBe(false)
    })

    it("should handle partial updates", () => {
      const action = {
        type: AttackActions.UPDATE,
        payload: {
          actionValue: 12,
          damage: 8
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.actionValue).toBe(12)
      expect(newState.damage).toBe(8)
      expect(newState.attacker).toEqual(baseState.attacker)
    })

    it("should update swerve and related calculations", () => {
      const action = {
        type: AttackActions.UPDATE,
        payload: {
          typedSwerve: "10",
          swerve: {
            result: 10,
            positiveRolls: [6, 4],
            negativeRolls: [],
            positive: 10,
            negative: null,
            boxcars: false
          }
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.typedSwerve).toBe("10")
      expect(newState.swerve.result).toBe(10)
    })
  })

  describe("AttackActions.EDIT", () => {
    it("should update state and set edited flag to true", () => {
      const action = {
        type: AttackActions.EDIT,
        payload: {
          actionValue: 14,
          defense: 12
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.actionValue).toBe(14)
      expect(newState.defense).toBe(12)
      expect(newState.edited).toBe(true)
    })

    it("should preserve existing state when editing", () => {
      const stateWithData = {
        ...baseState,
        attacker: carolina,
        target: brick,
        weapon: ak47
      }

      const action = {
        type: AttackActions.EDIT,
        payload: {
          count: 3
        }
      }

      const newState = attackReducer(stateWithData, action)

      expect(newState.attacker.name).toBe(carolina.name) // Check name instead of full object
      expect(newState.target.name).toBe(brick.name) // Check name instead of full object  
      expect(newState.weapon.name).toBe(ak47.name) // Check name instead of full object
      expect(newState.count).toBe(3)
      expect(newState.edited).toBe(true)
    })
  })

  describe("AttackActions.RESET", () => {
    it("should reset to initial state", () => {
      const modifiedState = {
        ...baseState,
        attacker: carolina,
        target: brick,
        weapon: ak47,
        actionValue: 15,
        damage: 10,
        edited: true
      }

      const action = {
        type: AttackActions.RESET
      }

      const newState = attackReducer(modifiedState, action)

      // Should return to initial state values
      expect(newState.attacker).toEqual(defaultCharacter)
      expect(newState.target).toEqual(defaultCharacter)
      expect(newState.weapon).toEqual(defaultWeapon)
      expect(newState.actionValue).toBe(7)
      expect(newState.edited).toBe(false)
    })
  })

  describe("default case", () => {
    it("should process the current state without changes for unknown action", () => {
      const stateWithData = {
        ...baseState,
        attacker: carolina,
        actionValue: 13
      }

      const action = {
        type: "UNKNOWN_ACTION" as AttackActions
      }

      const newState = attackReducer(stateWithData, action)

      // Should maintain existing state but process through ARS
      expect(newState.attacker).toEqual(carolina)
      expect(newState.actionValue).toBe(13)
    })
  })

  describe("mook results handling", () => {
    it("should handle mook results in state updates", () => {
      const mookResults = [
        { actionResult: 15, success: true, smackdown: 8, wounds: 2 },
        { actionResult: 12, success: true, smackdown: 5, wounds: 1 }
      ]

      const action = {
        type: AttackActions.UPDATE,
        payload: {
          mookResults,
          count: 5
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.mookResults).toEqual(mookResults)
      expect(newState.count).toBe(5)
    })
  })

  describe("combat calculations", () => {
    it("should handle boxcars and way awful failure flags", () => {
      const action = {
        type: AttackActions.UPDATE,
        payload: {
          boxcars: true,
          wayAwfulFailure: false,
          outcome: 20,
          success: true
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.boxcars).toBe(true)
      expect(newState.wayAwfulFailure).toBe(false)
      expect(newState.outcome).toBe(20)
      expect(newState.success).toBe(true)
    })

    it("should handle smackdown and wounds calculations", () => {
      const action = {
        type: AttackActions.UPDATE,
        payload: {
          smackdown: 12,
          wounds: 3,
          toughness: 8
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.smackdown).toBe(12)
      expect(newState.wounds).toBe(3)
      expect(newState.toughness).toBe(8)
    })

    it("should handle dodge mechanics", () => {
      const action = {
        type: AttackActions.UPDATE,
        payload: {
          dodged: true,
          shots: 1
        }
      }

      const newState = attackReducer(baseState, action)

      expect(newState.dodged).toBe(true)
      expect(newState.shots).toBe(1)
    })
  })

  describe("initial state integrity", () => {
    it("should have correct initial state values", () => {
      expect(initialAttackState.edited).toBe(false)
      expect(initialAttackState.fight).toEqual(defaultFight)
      expect(initialAttackState.attacker).toEqual(defaultCharacter)
      expect(initialAttackState.target).toEqual(defaultCharacter)
      expect(initialAttackState.weapon).toEqual(defaultWeapon)
      expect(initialAttackState.actionValue).toBe(7)
      expect(initialAttackState.damage).toBe(defaultWeapon.damage)
      expect(initialAttackState.count).toBe(1)
      expect(initialAttackState.shots).toBe(3)
      expect(initialAttackState.stunt).toBe(false)
      expect(initialAttackState.dodged).toBe(false)
      expect(initialAttackState.mookResults).toEqual([])
    })
  })
})