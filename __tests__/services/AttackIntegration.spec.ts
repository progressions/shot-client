import type { Swerve, Character, Vehicle } from "../../types/types"
import { defaultSwerve, defaultCharacter, defaultVehicle } from "../../types/types"
import { initialAttackState, AttackState } from "../../reducers/attackState"
import ARS from "../../services/AttackReducerService"
import CS from "../../services/CharacterService"
import { hitman, huanKen, brick, carolina, shing, zombies } from "../factories/Characters"
import { roll } from "../helpers/Helpers"
import { expectNoChanges, expectAttackerUnharmed, expectTargetUnharmed, expectAttackResults } from "../helpers/AttackHelpers"

describe("AttackReducerService", () => {
  beforeEach(() => {
    // Reset the mocked function before each test
    jest.restoreAllMocks();
  }),

  describe("PC vs Uber-Boss", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, brick)
      state = ARS.setTarget(state, huanKen)

      state.edited = true
    }),

    it("fails to hit", () => {
      // Swerve -1 + Action Value 14 - Defense 17 = Outcome -4
      // attack is a miss
      state.swerve = roll(-1)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("fails a stunt", () => {
      state.stunt = true

      // Swerve 1 + Action Value 14 - Defense 17 + Stunt 2 = Outcome -4
      // attack is a miss
      state.swerve = roll(1)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("hits", () => {
      // Swerve 5 + Action Value 14 - Defense 17 = Outcome 2
      // Outcome 2 + Damage 7 - Toughness 8 = Wounds 1
      state.swerve = roll(5)

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 5,
        outcome: 2,
        smackdown: 9,
        wounds: 1
      })
    }),

    it("hits a stunt", () => {
      state.stunt = true

      // Swerve 7 + Action Value 14 = Action Result 21
      // ActionResult 21 - Defense 17 - Stunt 2 = Outcome 2
      // Outcome 2 + Damage 7 = Smackdown 9
      // Smackdown 9 - Toughness 8 = Wounds 1
      state.swerve = roll(7)

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 7,
        outcome: 2,
        smackdown: 9,
        wounds: 1
      })
    })
  }),

  describe("PC vs Boss", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, brick)
      state = ARS.setTarget(state, shing)

      state.edited = true
    }),

    it("fails to hit", () => {
      // Swerve -1 + Action Value 14 - Defense 14 = Outcome -1
      // attack is a miss
      state.swerve = roll(-1)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("fails a stunt", () => {
      // Swerve 1 + Action Value 14 - Defense 14 - Stunt 2 = Outcome -1
      // attack is a miss
      state.swerve = roll(1)
      state.stunt = true

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("hits", () => {
      // Swerve 5 + Action Value 14 - Defense 14 = Outcome 5
      // Outcome 5 + Damage 7 - Toughness 7 = Wounds 5
      state.swerve = roll(5)

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 5,
        outcome: 5,
        smackdown: 12,
        wounds: 5
      })
    }),

    it("hits a stunt", () => {
      state.stunt = true

      // Swerve 7 + Action Value 14 = Action Result 21
      // ActionResult 21 - Defense 14 - Stunt 2 = Outcome 5
      // Outcome 5 + Damage 7 = Smackdown 12
      // Smackdown 12 - Toughness 7 = Wounds 5
      state.swerve = roll(7)

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 7,
        outcome: 5,
        smackdown: 12,
        wounds: 5
      })
    })
  }),

  describe("PC vs Featured Foe", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, brick)
      state = ARS.setTarget(state, hitman)

      state.edited = true
    }),

    it("fails to hit", () => {
      // Swerve -2 + Action Value 14 - Defense 13 = Outcome -1
      // attack is a miss
      state.swerve = roll(-2)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("fails a stunt", () => {
      state.stunt = true

      // Swerve -4 + Action Value 14 - Defense 13 + Stunt 2 = Outcome -1
      // attack is a miss
      state.swerve = roll(-4)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("hits", () => {
      // Swerve 5 + Action Value 14 - Defense 13 = Outcome 6
      // Outcome 6 + Damage 7 - Toughness 7 = Wounds 6
      state.swerve = roll(5)

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 5,
        outcome: 6,
        smackdown: 13,
        wounds: 6
      })
    }),

    it("hits a stunt", () => {
      state.stunt = true

      // Swerve 7 + Action Value 14 = Action Result 21
      // ActionResult 21 - Defense 13 - Stunt 2 = Outcome 6
      // Outcome 6 + Damage 7 = Smackdown 13
      // Smackdown 13 - Toughness 7 = Wounds 6
      state.swerve = roll(7)

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 7,
        outcome: 6,
        smackdown: 13,
        wounds: 6
      })
    })
  }),

  describe("PC vs Mooks", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, brick)
      state = ARS.setTarget(state, zombies)

      state.edited = true
    }),

    it("fails to hit", () => {
      // Swerve -2 + Action Value 14 - Defense 13 = Outcome -1
      // attack is a miss
      state.swerve = roll(-2)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("fails a stunt", () => {
      state.stunt = true

      // Swerve -4 + Action Value 14 - Defense 13 + Stunt 2 = Outcome -1
      // attack is a miss
      state.swerve = roll(-4)

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)

      expectNoChanges(state, result)
    }),

    it("hits 1 mook", () => {
      // Swerve 5 + Action Value 14 - Defense 13 = Outcome 6
      state.swerve = roll(5)
      state.count = 1

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 5,
        outcome: 6,
        mooks: 1
      })
    }),

    it("hits 1 mook as a stunt", () => {
      state.stunt = true

      // Swerve 5 + Action Value 14 - Defense 13 - Stunt 2 = Outcome 4
      state.swerve = roll(5)
      state.count = 1

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 5,
        outcome: 4,
        mooks: 1
      })
    }),

    it("hits 5 mooks", () => {
      // Swerve 5 + Action Value 14 - Defense 18 = Outcome 4
      state.swerve = roll(5)
      state.count = 5

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 5,
        outcome: 4,
        mooks: 5
      })
    }),

    it("hits 5 mooks as a stunt", () => {
      state.stunt = true

      // Swerve 7 + Action Value 14 = Action Result 21
      // Action Result 21 - Defense 18 - Stunt 2 = Outcome 1
      state.swerve = roll(7)
      state.count = 5

      const result = ARS.process(state)

      // attack is a success
      expect(result.success).toEqual(true)

      expectAttackResults(state, result, {
        swerve: 7,
        outcome: 1,
        mooks: 5
      })
    })
  }),

  describe("Mooks vs PC", () => {
    let state: AttackState

    beforeEach(() => {
      state = {
        ...initialAttackState,
      }
      state = ARS.setAttacker(state, zombies)
      state = ARS.setTarget(state, brick)

      state.count = 2
      state.edited = true
    }),

    it("fails to hit", () => {
      const swerveSpy = jest.spyOn(ARS.AS, "swerve")
      swerveSpy
        .mockReturnValueOnce(roll(-2))
        .mockReturnValueOnce(roll(-2))

      const result = ARS.process(state)

      // attack is a miss
      expect(result.success).toEqual(false)
    })
  })
})
