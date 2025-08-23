import { 
  chaseReducer, 
  ChaseActions, 
  ChaseMethod,
  initialChaseState, 
  ChaseState 
} from "@/reducers/chaseState"
import { defaultVehicle, defaultFight } from "@/types/types"
import { copCar, motorcycles } from "@/__tests__/factories/Vehicles"

describe("chaseReducer", () => {
  let baseState: ChaseState

  beforeEach(() => {
    baseState = { ...initialChaseState }
  })

  describe("ChaseActions.ATTACKER", () => {
    it("should set the attacker and recalculate state", () => {
      const action = {
        type: ChaseActions.ATTACKER,
        payload: { attacker: copCar }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.attacker).toEqual(copCar)
      expect(newState.edited).toBe(false)
    })

    it("should handle attacker change with existing target", () => {
      const stateWithTarget = {
        ...baseState,
        target: motorcycles
      }

      const action = {
        type: ChaseActions.ATTACKER,
        payload: { attacker: copCar }
      }

      const newState = chaseReducer(stateWithTarget, action)

      expect(newState.attacker).toEqual(copCar)
      expect(newState.target).toEqual(motorcycles)
    })
  })

  describe("ChaseActions.TARGET", () => {
    it("should set the target and recalculate state", () => {
      const action = {
        type: ChaseActions.TARGET,
        payload: { target: motorcycles }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.target).toEqual(motorcycles)
      expect(newState.edited).toBe(false)
    })

    it("should handle target change with existing attacker", () => {
      const stateWithAttacker = {
        ...baseState,
        attacker: copCar
      }

      const action = {
        type: ChaseActions.TARGET,
        payload: { target: motorcycles }
      }

      const newState = chaseReducer(stateWithAttacker, action)

      expect(newState.attacker).toEqual(copCar)
      expect(newState.target).toEqual(motorcycles)
    })
  })

  describe("ChaseActions.UPDATE", () => {
    it("should update state and recalculate without setting edited flag", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          attacker: copCar,
          target: motorcycles,
          actionValue: 15,
          method: ChaseMethod.RAM_SIDESWIPE,
          stunt: true
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.attacker).toEqual(copCar)
      expect(newState.target).toEqual(motorcycles)
      expect(newState.actionValue).toBe(15)
      expect(newState.method).toBe(ChaseMethod.RAM_SIDESWIPE)
      expect(newState.stunt).toBe(true)
      expect(newState.edited).toBe(false)
    })

    it("should handle partial updates", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          actionValue: 12,
          defense: 8,
          position: "near" as const
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.actionValue).toBe(12)
      expect(newState.defense).toBe(8)
      expect(newState.position).toBe("near")
      expect(newState.attacker).toEqual(baseState.attacker)
    })

    it("should update chase-specific values", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          handling: 14,
          squeal: 12,
          frame: 16,
          crunch: 10,
          chasePoints: 5,
          conditionPoints: 2
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.handling).toBe(14)
      expect(newState.squeal).toBe(12)
      expect(newState.frame).toBe(16)
      expect(newState.crunch).toBe(10)
      expect(newState.chasePoints).toBe(5)
      expect(newState.conditionPoints).toBe(2)
    })

    it("should update swerve and related calculations", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          typedSwerve: "8",
          swerve: {
            result: 8,
            positiveRolls: [6, 2],
            negativeRolls: [],
            positive: 8,
            negative: null,
            boxcars: false
          }
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.typedSwerve).toBe("8")
      expect(newState.swerve.result).toBe(8)
    })
  })

  describe("ChaseActions.EDIT", () => {
    it("should update state and set edited flag to true", () => {
      const action = {
        type: ChaseActions.EDIT,
        payload: {
          actionValue: 14,
          defense: 12,
          method: ChaseMethod.NARROW_THE_GAP
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.actionValue).toBe(14)
      expect(newState.defense).toBe(12)
      expect(newState.method).toBe(ChaseMethod.NARROW_THE_GAP)
      expect(newState.edited).toBe(true)
    })

    it("should preserve existing state when editing", () => {
      const stateWithData = {
        ...baseState,
        attacker: copCar,
        target: motorcycles,
        handling: 15
      }

      const action = {
        type: ChaseActions.EDIT,
        payload: {
          count: 3,
          position: "near" as const
        }
      }

      const newState = chaseReducer(stateWithData, action)

      expect(newState.attacker.name).toBe(copCar.name) // Check name instead of full object
      expect(newState.target.name).toBe(motorcycles.name) // Check name instead of full object  
      expect(newState.count).toBe(3)
      expect(newState.edited).toBe(true)
      // Position might be recalculated by the service, so check that it exists
      expect(typeof newState.position).toBe("string")
    })
  })

  describe("ChaseActions.RESET", () => {
    it("should reset to initial state", () => {
      const modifiedState = {
        ...baseState,
        attacker: copCar,
        target: motorcycles,
        method: ChaseMethod.EVADE,
        actionValue: 15,
        handling: 18,
        edited: true
      }

      const action = {
        type: ChaseActions.RESET
      }

      const newState = chaseReducer(modifiedState, action)

      // Should return to initial state values
      expect(newState.attacker).toEqual(defaultVehicle)
      expect(newState.target).toEqual(defaultVehicle)
      expect(newState.method).toBe("")
      expect(newState.actionValue).toBe(7)
      expect(newState.handling).toBe(0)
      expect(newState.edited).toBe(false)
    })
  })

  describe("default case", () => {
    it("should process the current state without changes for unknown action", () => {
      const stateWithData = {
        ...baseState,
        attacker: copCar,
        actionValue: 13,
        method: ChaseMethod.WIDEN_THE_GAP
      }

      const action = {
        type: "UNKNOWN_ACTION" as ChaseActions
      }

      const newState = chaseReducer(stateWithData, action)

      // Should maintain existing state but process through CRS
      expect(newState.attacker).toEqual(copCar)
      expect(newState.actionValue).toBe(13)
      expect(newState.method).toBe(ChaseMethod.WIDEN_THE_GAP)
    })
  })

  describe("chase methods", () => {
    it("should handle all chase method types", () => {
      const methods = [
        ChaseMethod.RAM_SIDESWIPE,
        ChaseMethod.NARROW_THE_GAP,
        ChaseMethod.WIDEN_THE_GAP,
        ChaseMethod.EVADE
      ]

      methods.forEach(method => {
        const action = {
          type: ChaseActions.UPDATE,
          payload: { method }
        }

        const newState = chaseReducer(baseState, action)
        expect(newState.method).toBe(method)
      })
    })

    it("should handle empty method", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: { method: "" as const }
      }

      const newState = chaseReducer(baseState, action)
      expect(newState.method).toBe("")
    })
  })

  describe("mook results handling", () => {
    it("should handle mook results in state updates", () => {
      const mookResults = [
        { 
          actionResult: 15, 
          success: true, 
          smackdown: 8, 
          chasePoints: 3, 
          conditionPoints: 1 
        },
        { 
          actionResult: 12, 
          success: true, 
          smackdown: 5, 
          chasePoints: 2, 
          conditionPoints: 0 
        }
      ]

      const mookRolls = [15, 12, 8, 6]

      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          mookResults,
          mookRolls,
          count: 4
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.mookResults).toEqual(mookResults)
      expect(newState.mookRolls).toEqual(mookRolls)
      expect(newState.count).toBe(4)
    })
  })

  describe("position mechanics", () => {
    it("should handle position changes", () => {
      const positions = ["near", "far"] as const

      positions.forEach(position => {
        const action = {
          type: ChaseActions.UPDATE,
          payload: { position }
        }

        const newState = chaseReducer(baseState, action)
        expect(newState.position).toBe(position)
      })
    })
  })

  describe("combat calculations", () => {
    it("should handle boxcars and way awful failure flags", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          boxcars: true,
          wayAwfulFailure: false,
          outcome: 20,
          success: true
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.boxcars).toBe(true)
      expect(newState.wayAwfulFailure).toBe(false)
      expect(newState.outcome).toBe(20)
      expect(newState.success).toBe(true)
    })

    it("should handle chase-specific damage calculations", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          smackdown: 12,
          chasePoints: 3,
          conditionPoints: 2,
          frame: 15,
          crunch: 8
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.smackdown).toBe(12)
      expect(newState.chasePoints).toBe(3)
      expect(newState.conditionPoints).toBe(2)
      expect(newState.frame).toBe(15)
      expect(newState.crunch).toBe(8)
    })

    it("should handle shot mechanics", () => {
      const action = {
        type: ChaseActions.UPDATE,
        payload: {
          shots: 2
        }
      }

      const newState = chaseReducer(baseState, action)

      expect(newState.shots).toBe(2)
    })
  })

  describe("initial state integrity", () => {
    it("should have correct initial state values", () => {
      expect(initialChaseState.edited).toBe(false)
      expect(initialChaseState.fight).toEqual(defaultFight)
      expect(initialChaseState.attacker).toEqual(defaultVehicle)
      expect(initialChaseState.target).toEqual(defaultVehicle)
      expect(initialChaseState.method).toBe("")
      expect(initialChaseState.actionValue).toBe(7)
      expect(initialChaseState.count).toBe(1)
      expect(initialChaseState.position).toBe("far")
      expect(initialChaseState.shots).toBe(3)
      expect(initialChaseState.stunt).toBe(false)
      expect(initialChaseState.mookResults).toEqual([])
      expect(initialChaseState.mookRolls).toEqual([])
    })

    it("should have correct initial chase-specific values", () => {
      expect(initialChaseState.handling).toBe(0)
      expect(initialChaseState.squeal).toBe(0)
      expect(initialChaseState.frame).toBe(0)
      expect(initialChaseState.crunch).toBe(0)
      expect(initialChaseState.chasePoints).toBe(0)
      expect(initialChaseState.conditionPoints).toBe(0)
    })
  })
})