import type { Swerve, Character, Vehicle } from "../../types/types"
import { defaultSwerve, defaultCharacter, defaultVehicle } from "../../types/types"
import { ChaseMethod, initialChaseState, ChaseState } from "../../reducers/chaseState"
import CRS from "../../services/ChaseReducerService"
import VS from "../../services/VehicleService"

describe("ChaseReducerService", () => {
  beforeEach(() => {
    // Reset the mocked function before each test
    jest.restoreAllMocks();
  }),

  describe("process", () => {
    it("rolls attack and resolves it", () => {
      const rollAttackMock = jest.spyOn(CRS, "rollAttack")
      const resolveAttackMock = jest.spyOn(CRS, "resolveAttack")
      const state = {
        ...initialChaseState,
        edited: true
      }
      CRS.process(state)
      expect(rollAttackMock).toHaveBeenCalled()
      expect(resolveAttackMock).toHaveBeenCalled()
    }),

    it("doesn't roll attacks if edited is false", () => {
      const rollAttackMock = jest.spyOn(CRS, "rollAttack")
      const resolveAttackMock = jest.spyOn(CRS, "resolveAttack")
      const state = {
        ...initialChaseState,
        edited: false
      }
      CRS.process(state)
      expect(rollAttackMock).not.toHaveBeenCalled()
      expect(resolveAttackMock).not.toHaveBeenCalled()
    })
  }),

  describe("rollAttack", () => {
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
      const calculateAttackValuesMock = jest.spyOn(CRS, 'calculateAttackValues')
      const calculateMookAttackValuesMock = jest.spyOn(CRS, 'calculateMookAttackValues')
      CRS.rollAttack(state)
      expect(calculateAttackValuesMock).toHaveBeenCalledTimes(5)
      expect(calculateMookAttackValuesMock).toHaveBeenCalled()
    }),

    it("calls calculateAttackValues for a non-Mook", () => {
      const vehicle: Vehicle = {
        ...defaultVehicle,
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
      const calculateAttackValuesMock = jest.spyOn(CRS, 'calculateAttackValues')
      const calculateMookAttackValuesMock = jest.spyOn(CRS, 'calculateMookAttackValues')
      CRS.rollAttack(state)
      expect(calculateAttackValuesMock).toHaveBeenCalled()
      expect(calculateMookAttackValuesMock).not.toHaveBeenCalled()
    })
  }),

  describe("resolveAttack", () => {
    it("calls resolveMookAttack for a Mook attacker", () => {
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
      const resolveMookAttackMock = jest.spyOn(CRS, 'resolveMookAttack')
      CRS.resolveAttack(state)
      expect(resolveMookAttackMock).toHaveBeenCalled()
    }),

    it("calls killMooks for a Mook target", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        count: 5,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Mook"
        }
      }
      const state = {
        ...initialChaseState,
        attacker: attacker,
        target: target,
        count: 5,
        defense: 13,
      }
      const killMooksMock = jest.spyOn(CRS, 'killMooks')
      CRS.resolveAttack(state)
      expect(killMooksMock).toHaveBeenCalled()
    }),

    it("calls processMethod for a non-Mook attacker and target", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          "Chase Points": 0,
          "Condition Points": 0,
          Type: "PC"
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe",
          "Chase Points": 0,
          "Condition Points": 0,
        }
      }
      const state = {
        ...initialChaseState,
        attacker: attacker,
        target: target,
        defense: 13,
        smackdown: 15
      }
      const updatedTarget = {
        ...target,
        action_values: {
          ...target.action_values,
          "Chase Points": 10,
          "Condition Points": 10,
        }
      }
      const processMethodMock = jest.spyOn(CRS, 'processMethod')
      processMethodMock.mockReturnValue([attacker, updatedTarget])

      const result = CRS.resolveAttack(state)

      expect(processMethodMock).toHaveBeenCalledWith(state, 15)
      expect(result.chasePoints).toEqual(10)
      expect(result.conditionPoints).toEqual(10)
      expect(VS.chasePoints(result.target)).toEqual(10)
      expect(VS.conditionPoints(result.target)).toEqual(10)
    })
  }),

  describe("calculateMookAttackValues", () => {
    it("compiles an Array of attack results", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
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

      const swerve6 = {
        ...defaultSwerve,
        result: 6
      }
      const swerve9 = {
        ...defaultSwerve,
        result: 9
      }

      const swerveMock = jest.spyOn(CRS.AS, "swerve")
      swerveMock
        .mockReturnValueOnce(swerve6)
        .mockReturnValueOnce(swerve9)
      const calculateAttackValuesMock = jest.spyOn(CRS, "calculateAttackValues")
      calculateAttackValuesMock
        .mockReturnValueOnce({
          ...state,
          swerve: swerve6,
          modifiedActionValue: "15",
          modifiedDefense: "13",
          mookDefense: 13
        })
        .mockReturnValueOnce({
          ...state,
          swerve: swerve9,
          modifiedActionValue: "66",
          modifiedDefense: "13",
          mookDefense: 13
        })

      const result = CRS.calculateMookAttackValues(state)
      expect(calculateAttackValuesMock).toHaveBeenCalledTimes(2)

      const calls = calculateAttackValuesMock.mock.calls
      expect(calls[0][0]).toEqual({ ...state, swerve: swerve6 })
      expect(calls[1][0]).toEqual({ ...state, swerve: swerve9 })

      expect(result.mookResults.length).toEqual(2)
      expect(result.mookResults[0].swerve).toEqual(swerve6)
      expect(result.mookResults[1].swerve).toEqual(swerve9)
    })
  }),

  describe("resolveMookAttack", () => {
    it("collects the results of mook attacks", () => {
      const resolveAttackMock = jest.spyOn(CRS, "resolveAttack")

      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
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
      const state: ChaseState = {
        ...initialChaseState,
        attacker: attacker,
        target: target,
        count: 2,
        defense: 13,
        actionValue: 15,
        handling: 6,
      }
      state.mookResults = [
        state,
        state
      ]

      resolveAttackMock
        .mockReturnValueOnce({
          ...state,
          success: true,
          chasePoints: 5
        })
        .mockReturnValueOnce({
          ...state,
          success: true,
          chasePoints: 10
        })

      const result = CRS.resolveMookAttack(state)
      expect(result.chasePoints).toEqual(15)
      expect(result.conditionPoints).toEqual(0)
      expect(result.success).toEqual(true)
    }),

    it("collects the results of failed mook attacks", () => {
      const resolveAttackMock = jest.spyOn(CRS, "resolveAttack")

      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
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
      const state: ChaseState = {
        ...initialChaseState,
        attacker: attacker,
        target: target,
        count: 2,
        defense: 13,
        actionValue: 15,
        handling: 6,
      }
      state.mookResults = [
        state,
        state
      ]

      resolveAttackMock
        .mockReturnValueOnce({
          ...state,
          success: false,
          chasePoints: null
        })
        .mockReturnValueOnce({
          ...state,
          success: false,
          chasePoints: null
        })

      const result = CRS.resolveMookAttack(state)
      expect(result.chasePoints).toEqual(0)
      expect(result.conditionPoints).toEqual(0)
      expect(result.success).toEqual(false)
    }),

    it("collects the results of mixed mook attacks", () => {
      const resolveAttackMock = jest.spyOn(CRS, "resolveAttack")

      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
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
      const state: ChaseState = {
        ...initialChaseState,
        attacker: attacker,
        target: target,
        count: 2,
        defense: 13,
        actionValue: 15,
        handling: 6,
      }
      state.mookResults = [
        state,
        state
      ]

      resolveAttackMock
        .mockReturnValueOnce({
          ...state,
          success: false,
          chasePoints: null
        })
        .mockReturnValueOnce({
          ...state,
          success: true,
          chasePoints: 5
        })

      const result = CRS.resolveMookAttack(state)
      expect(result.chasePoints).toEqual(5)
      expect(result.conditionPoints).toEqual(0)
      expect(result.success).toEqual(true)
    })
  }),

  describe("killMooks", () => {
    it("reduces the mook count by the number of mooks killed", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC",
          "Squeal": 8
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        count: 20,
        action_values: {
          ...defaultVehicle.action_values,
          "Type": "Mook",
          "Handling": 6,
        }
      }
      const state = {
        ...initialChaseState,
        success: true,
        attacker: attacker,
        target: target
      }
      const updatedAttacker = VS.updatePosition(attacker, "near")
      const updatedTarget = { ...target, count: 10 }
      const processMethod = jest.spyOn(CRS, "processMethod")
      processMethod.mockReturnValueOnce([updatedAttacker, updatedTarget])

      const result = CRS.killMooks(state)
      expect(VS.isNear(result.attacker)).toEqual(true)
      expect(VS.mooks(result.target)).toEqual(10)
    }),

    it("does nothing if the attack was not a success", () => {
      const processMethod = jest.spyOn(CRS, "processMethod")
      const state = {
        ...initialChaseState,
        success: false,
      }

      const result = CRS.killMooks(state)
      expect(processMethod).not.toHaveBeenCalled()
    })
  }),

  describe("calculateAttackValues", () => {
    it("calculates modified display values for a Mook", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC",
          "Squeal": 8
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Mook",
          "Handling": 6,
        }
      }
      const swerve6 = {
        ...defaultSwerve,
        result: 6
      }
      const state = {
        ...initialChaseState,
        swerve: swerve6,
        attacker: attacker,
        target: target,
        count: 2,
        defense: 13,
        actionValue: 15,
      }
      const result = CRS.calculateAttackValues(state)
      expect(result.modifiedDefense).toEqual("13")
      expect(result.modifiedActionValue).toEqual("15")
      expect(result.mookDefense).toEqual(15)
    }),

    it("calculates modified display values for a non-Mook", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC",
          "Squeal": 8
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe",
          "Handling": 6,
        }
      }
      const swerve6 = {
        ...defaultSwerve,
        result: 6
      }
      const state = {
        ...initialChaseState,
        swerve: swerve6,
        attacker: attacker,
        target: target,
        defense: 13,
        actionValue: 15,
      }
      const result = CRS.calculateAttackValues(state)
      expect(result.modifiedDefense).toEqual("13")
      expect(result.modifiedActionValue).toEqual("15")
      expect(result.mookDefense).toEqual(13)
    }),

    it("calls this.pursue for a Pursuer", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC",
          "Pursuer": "true",
          "Squeal": 8
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe",
          "Handling": 6,
        }
      }
      const swerve6 = {
        ...defaultSwerve,
        result: 6
      }
      const state = {
        ...initialChaseState,
        swerve: swerve6,
        attacker: attacker,
        target: target,
        defense: 13,
        actionValue: 15,
      }
      const resultState = {
        ...state,
        modifiedDefense: "13",
        modifiedActionValue: "15",
        mookDefense: 13
      }

      const pursueMock = jest.spyOn(CRS, "pursue")
      const evadeMock = jest.spyOn(CRS, "evade")
      const result = CRS.calculateAttackValues(state)

      expect(evadeMock).not.toHaveBeenCalled()
      const calls = pursueMock.mock.calls
      expect(calls[0][0].modifiedDefense).toEqual("13")
      expect(calls[0][0].modifiedActionValue).toEqual("15")
      expect(calls[0][0].mookDefense).toEqual(13)
    }),

    it("calls this.evade for an Evader", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        count: 2,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC",
          "Pursuer": "false",
          "Squeal": 8
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe",
          "Handling": 6,
        }
      }
      const swerve6 = {
        ...defaultSwerve,
        result: 6
      }
      const state = {
        ...initialChaseState,
        swerve: swerve6,
        attacker: attacker,
        target: target,
        defense: 13,
        actionValue: 15,
      }
      const resultState = {
        ...state,
        modifiedDefense: "13",
        modifiedActionValue: "15",
        mookDefense: 13
      }

      const pursueMock = jest.spyOn(CRS, "pursue")
      const evadeMock = jest.spyOn(CRS, "evade")

      const result = CRS.calculateAttackValues(state)

      expect(pursueMock).not.toHaveBeenCalled()
      const calls = evadeMock.mock.calls
      expect(calls[0][0].modifiedDefense).toEqual("13")
      expect(calls[0][0].modifiedActionValue).toEqual("15")
      expect(calls[0][0].mookDefense).toEqual(13)
    })
  }),

  describe("pursue", () => {
    it("returns a successful result", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe"
        }
      }
      const state = {
        ...initialChaseState,
        swerve: {
          ...defaultSwerve,
          result: 6
        },
        attacker: attacker,
        target: target,
        squeal: 8,
        handling: 6,
        actionValue: 15,
        mookDefense: 13,
      }
      const result = CRS.pursue(state)
      expect(result.actionResult).toEqual(21)
      expect(result.outcome).toEqual(8)
      expect(result.success).toEqual(true)
      expect(result.smackdown).toEqual(16)
      expect(result.position).toEqual("near")

      // Swerve of 6 plus actionValue of 15 is 21, which is 8 over the
      // target's defense of 13, so the result is a hit, with an outcome
      // of 8. The attacker's squeal is 8, so the smackdown is 16.
      // The target's Handling is 6, so the chasePoints are 10.
      expect(result.chasePoints).toEqual(10)
      expect(result.conditionPoints).toEqual(null)
    }),

    it("returns a successful sideswipe", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe"
        }
      }
      const state = {
        ...initialChaseState,
        swerve: {
          ...defaultSwerve,
          result: 6
        },
        attacker: attacker,
        target: target,
        squeal: 8,
        handling: 6,
        frame: 9,
        crunch: 11,
        actionValue: 15,
        mookDefense: 13,
        method: ChaseMethod.RAM_SIDESWIPE
      }
      const result = CRS.pursue(state)
      expect(result.actionResult).toEqual(21)
      expect(result.outcome).toEqual(8)
      expect(result.success).toEqual(true)
      expect(result.smackdown).toEqual(19)
      expect(result.position).toEqual("near")

      // Swerve of 6 plus actionValue of 15 is 21, which is 8 over the
      // target's defense of 13, so the result is a hit, with an outcome
      // of 8. The attacker's Crunch is 11, so the smackdown is 19.
      // The target's Frame is 9, so the chasePoints are 10.
      expect(result.chasePoints).toEqual(10)
      expect(result.conditionPoints).toEqual(10)
    }),

    it("returns an unsuccessful result", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe"
        }
      }
      const state = {
        ...initialChaseState,
        swerve: {
          ...defaultSwerve,
          result: -6
        },
        attacker: attacker,
        target: target,
        squeal: 8,
        handling: 6,
        actionValue: 15,
        mookDefense: 13,
      }
      const result = CRS.pursue(state)
      expect(result.actionResult).toEqual(9)
      expect(result.outcome).toEqual(-4)
      expect(result.success).toEqual(false)
      expect(result.smackdown).toEqual(null)
      expect(result.position).toEqual("far")

      // Swerve of -6 plus actionValue of 15 is 9, which is 4 under the
      // target's defense of 13, so the result is a miss, with an outcome
      // of -4.
      expect(result.chasePoints).toEqual(null)
      expect(result.conditionPoints).toEqual(null)
    })
  }),

  describe("evade", () => {
    it("returns a successful result", () => {
      const attacker: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "PC"
        }
      }
      const target: Vehicle = {
        ...defaultVehicle,
        action_values: {
          ...defaultVehicle.action_values,
          Type: "Featured Foe"
        }
      }
      const state = {
        ...initialChaseState,
        swerve: {
          ...defaultSwerve,
          result: 6
        },
        attacker: attacker,
        target: target,
        squeal: 8,
        handling: 6,
        actionValue: 15,
        mookDefense: 13,
      }
      const result = CRS.evade(state)

      expect(result.actionResult).toEqual(21)
      expect(result.outcome).toEqual(8)
      expect(result.success).toEqual(true)
      expect(result.smackdown).toEqual(16)
      expect(result.position).toEqual("far")

      // Swerve of 6 plus actionValue of 15 is 21, which is 8 over the
      // target's defense of 13, so the result is a hit, with an outcome
      // of 8. The attacker's squeal is 8, so the smackdown is 16.
      // The target's Handling is 6, so the chasePoints are 10.
      expect(result.chasePoints).toEqual(10)
      expect(result.conditionPoints).toEqual(null)
    })
  }),

  describe("R", () => {
    describe("mainAttackString", () => {
      it("returns the state's action value", () => {
        const state = {
          ...initialChaseState,
          actionValue: 13
        }
        const actionValue = CRS.R.mainAttackString(state)
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
        const defense = CRS.R.targetMookDefense(state)
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
        const defense = CRS.R.targetMookDefense(state)
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
        const defense = CRS.R.targetMookDefense(state)
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
        const defense = CRS.R.targetMookDefense(state)
        expect(defense).toEqual(20)
      })
    }),

    describe("defenseString", () => {
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
        const defense = CRS.R.defenseString(state)
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
        const defense = CRS.R.defenseString(state)
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
        const defense = CRS.R.defenseString(state)
        expect(defense).toEqual("13*")
      })
    }),

    describe("calculateToughness", () => {
      it("returns frame if the method is RAM_SIDESWIPE", () => {
        const state = {
          ...initialChaseState,
          frame: 7,
          handling: 5,
          method: ChaseMethod.RAM_SIDESWIPE
        }
        expect(CRS.R.calculateToughness(state)).toEqual(state.frame)
      }),

      it("returns handling if the method is EVADE", () => {
        const state = {
          ...initialChaseState,
          frame: 7,
          handling: 5,
          method: ChaseMethod.EVADE
        }
        expect(CRS.R.calculateToughness(state)).toEqual(state.handling)
      }),

      it("returns handling if the method is NARROW_THE_GAP", () => {
        const state = {
          ...initialChaseState,
          frame: 7,
          handling: 5,
          method: ChaseMethod.NARROW_THE_GAP
        }
        expect(CRS.R.calculateToughness(state)).toEqual(state.handling)
      }),

      it("returns handling if the method is WIDEN_THE_GAP", () => {
        const state = {
          ...initialChaseState,
          frame: 7,
          handling: 5,
          method: ChaseMethod.WIDEN_THE_GAP
        }
        expect(CRS.R.calculateToughness(state)).toEqual(state.handling)
      })
    }),

    describe("calculateDamage", () => {
      it("returns crunch if the method is RAM_SIDEWIPE", () => {
        const state = {
          ...initialChaseState,
          crunch: 9,
          squeal: 7,
          method: ChaseMethod.RAM_SIDESWIPE
        }
        expect(CRS.R.calculateDamage(state)).toEqual(state.crunch)
      }),

      it("returns squeal if the method is EVADE", () => {
        const state = {
          ...initialChaseState,
          crunch: 9,
          squeal: 7,
          method: ChaseMethod.EVADE
        }
        expect(CRS.R.calculateDamage(state)).toEqual(state.squeal)
      }),

      it("returns squeal if the method is NARROW_THE_GAP", () => {
        const state = {
          ...initialChaseState,
          crunch: 9,
          squeal: 7,
          method: ChaseMethod.NARROW_THE_GAP
        }
        expect(CRS.R.calculateDamage(state)).toEqual(state.squeal)
      }),

      it("returns squeal if the method is WIDEN_THE_GAP", () => {
        const state = {
          ...initialChaseState,
          crunch: 9,
          squeal: 7,
          method: ChaseMethod.WIDEN_THE_GAP
        }
        expect(CRS.R.calculateDamage(state)).toEqual(state.squeal)
      })
    })
  })
})
