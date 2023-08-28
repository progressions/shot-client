import type { Swerve, Character, Vehicle } from "@/types/types"
import { defaultSwerve, defaultCharacter, defaultVehicle } from "@/types/types"
import { initialAttackState, AttackState } from "@/reducers/attackState"
import ARS from "@/services/AttackReducerService"
import CS from "@/services/CharacterService"
import { brick, carolina, shing, zombies } from "@/__tests__/factories/Characters"
import { derringer } from "@/__tests__/factories/Weapons"

describe("AttackReducerService", () => {
  beforeEach(() => {
    // Reset the mocked function before each test
    jest.restoreAllMocks();
  }),

  describe("process", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, brick)
      state = ARS.setTarget(state, shing)
    })

    it.only("kills 1 out of 15 mooks", () => {
      state = ARS.setTarget(state, zombies)

      const swerve = {
          ...defaultSwerve,
          result: 25
        }
      state.count = 1
      state.swerve = swerve
      state.edited = true

      const result = ARS.process(state)

      expect(result.success).toEqual(true)
      expect(CS.mooks(result.target)).toEqual(CS.mooks(zombies) - 1)
    }),

    it.only("kills 5 out of 15 mooks", () => {
      const calculateAttackValuesMock = jest.spyOn(ARS, "calculateAttackValues")
      state = ARS.setTarget(state, zombies)

      const swerve = {
          ...defaultSwerve,
          result: 25
        }
      state.count = 5
      state.swerve = swerve
      state.edited = true

      const result = ARS.process(state)

      expect(calculateAttackValuesMock).toHaveBeenCalled()
      expect(result.success).toEqual(true)
      expect(CS.mooks(result.target)).toEqual(CS.mooks(zombies) - 5)
    }),

    it("calls resolveAttack if it's edited", () => {
      const resolveAttackSpy = jest.spyOn(ARS, "resolveAttack")
      state.edited = true
      ARS.process(state)
      expect(resolveAttackSpy).toHaveBeenCalled()
    }),

    it("doesn't call resolveAttack if edited is false", () => {
      const resolveAttackSpy = jest.spyOn(ARS, "resolveAttack")
      state.edited = false
      ARS.process(state)
      expect(resolveAttackSpy).not.toHaveBeenCalled()
    })
  }),

  describe("resolveAttack", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, brick)
    })

    it("calls takeSmackdown with the count for Mooks", () => {
      state = ARS.setTarget(state, zombies)
      const takeSmackdownSpy = jest.spyOn(ARS.CS, "takeSmackdown")
      takeSmackdownSpy.mockReturnValue({
        ...zombies,
        count: 10
      })
      const calculateAttackValuesSpy = jest.spyOn(ARS, "calculateAttackValues")
      calculateAttackValuesSpy.mockReturnValue({
        ...state,
        success: true,
        count: 5
      })

      const result = ARS.resolveAttack(state)

      expect(takeSmackdownSpy).toHaveBeenCalledWith(zombies, 5)
      expect(CS.mooks(result.target)).toEqual(10)
    }),

    it("calls takeSmackdown with the smackdown for non-Mooks", () => {
      state = ARS.setTarget(state, shing)
      const takeSmackdownSpy = jest.spyOn(ARS.CS, "takeSmackdown")
      takeSmackdownSpy.mockReturnValue({
        ...shing,
        action_values: {
          ...shing.action_values,
          "Wounds": 7
        }
      })

      state.smackdown = 12
      const result = ARS.resolveAttack(state)

      expect(takeSmackdownSpy).toHaveBeenCalledWith(shing, 7)
      expect(CS.wounds(result.target)).toEqual(7)
    })
  }),

  describe("resolveMookAttacks", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, zombies)
      state = ARS.setTarget(state, brick)
    }),

    it("rolls Mook attacks", () => {
      const swerveSpy = jest.spyOn(ARS.AS, "swerve")
      swerveSpy
        .mockReturnValueOnce({
          ...defaultSwerve,
          result: 19
        } as Swerve)
        .mockReturnValueOnce({
          result: -5
        } as Swerve)
        .mockReturnValueOnce({
          result: 15
        } as Swerve)

      state.count = 3
      const result = ARS.resolveMookAttacks(state)
      expect(swerveSpy).toHaveBeenCalledTimes(3)
      expect(result.mookResults).toEqual([
        { actionResult: 19, success: true, smackdown: 13, wounds: 6 },
        { actionResult: -5, success: false, smackdown: null, wounds: null },
        { actionResult: 15, success: true, smackdown: 9, wounds: 2 }
      ])
      expect(result.success).toEqual(true)
      expect(result.wounds).toEqual(8)
    }),

    it("rolls Mook attacks and fails", () => {
      const swerveSpy = jest.spyOn(ARS.AS, "swerve")
      swerveSpy
        .mockReturnValueOnce({
          ...defaultSwerve,
          result: 9
        } as Swerve)
        .mockReturnValueOnce({
          result: -5
        } as Swerve)
        .mockReturnValueOnce({
          result: 1
        } as Swerve)

      state.count = 3
      const result = ARS.resolveMookAttacks(state)
      expect(swerveSpy).toHaveBeenCalledTimes(3)
      expect(result.mookResults).toEqual([
        { actionResult: 9, success: false, smackdown: null, wounds: null },
        { actionResult: -5, success: false, smackdown: null, wounds: null },
        { actionResult: 1, success: false, smackdown: null, wounds: null }
      ])
      expect(result.success).toEqual(false)
      expect(result.wounds).toEqual(0)
    })
  }),

  describe("calculateAttackValues", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, shing)
      state = ARS.setTarget(state, brick)
    }),

    it("calls AS.wounds", () => {
      const woundsSpy = jest.spyOn(ARS.AS, "wounds")
      const result = ARS.calculateAttackValues(state)
      expect(woundsSpy).toHaveBeenCalledWith({
        swerve: state.swerve,
        actionValue: state.actionValue,
        defense: state.mookDefense,
        stunt: state.stunt,
        toughness: state.toughness,
        damage: state.damage,
      })
    })
  }),

  describe("setAttacker", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
    }),

    it.only("sets the attacker", () => {
      const result = ARS.setAttacker(state, carolina)
      expect(result.attacker).toEqual(carolina)
      expect(result.actionValue).toEqual(14)
      expect(result.actionValueName).toEqual("Guns")
      expect(result.damage).toEqual(derringer.damage)
      expect(result.weapon).toEqual(derringer)
    })
  })
})
