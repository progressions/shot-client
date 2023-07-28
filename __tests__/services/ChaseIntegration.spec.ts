import type { Swerve, Character, Vehicle } from "../../types/types"
import { defaultSwerve, defaultCharacter, defaultVehicle } from "../../types/types"
import { ChaseMethod, initialChaseState, ChaseState } from "../../reducers/chaseState"
import CRS from "../../services/ChaseReducerService"
import VS from "../../services/VehicleService"
import { pursuer, evader, hondas, brickMobile, copCar, battleTruck, motorcycles } from "../factories/Vehicles"
import { roll } from "../helpers/Helpers"
import { expectChaseResults, expectTargetUnharmed, expectNoChanges, expectAttackerUnharmed, expectPositionsUnchanged } from "../helpers/ChaseHelpers"

describe("ChaseReducerService", () => {
  let state: ChaseState

  beforeEach(() => {
    // Reset the mocked function before each test
    jest.restoreAllMocks();
  }),

  describe("full integration tests", () => {
    describe("PC vs Boss evades", () => {
      beforeEach(() => {
        let attacker = evader(brickMobile, "far")
        let target = pursuer(battleTruck, "far")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.EVADE
        state.edited = true
      }),

      it("fails to evade", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        expect(state.actionValue).toEqual(7)
        expect(state.defense).toEqual(15)
        state.swerve = roll(0)

        const result = CRS.process(state)

        // attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("fails to evade as a stunt", () => {
        state.stunt = true

        // Swerve 2 + Action Value 7 - Defense 15 - Stunt 2
        expect(state.actionValue).toEqual(7)
        expect(state.defense).toEqual(15)
        state.swerve = roll(0)

        const result = CRS.process(state)

        // attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("evades", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Squeal 10 = Smackdown 14
        // Smackdown 14 - Handling 6 = 8 Chase Points
        state.swerve = roll(12)
        const result = CRS.process(state)

        // attack was a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 4,
          smackdown: 14,
          chasePoints: 8,
          conditionPoints: 0
        })

        // no bump when evading
        expectAttackerUnharmed(state, result)
      }),

      it("evades as a stunt", () => {
        state.stunt = true

        // Swerve 12 + Action Value 7 - Defense 15 - Stunt 2 = Outcome 2
        // Outcome 2 + Squeal 10 = Smackdown 12
        // Smackdown 12 - Handling 6 = 6 Chase Points
        state.swerve = roll(12)
        const result = CRS.process(state)

        // attack was a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 2,
          smackdown: 12,
          chasePoints: 6,
          conditionPoints: 0
        })

        // no bump when evading
        expectAttackerUnharmed(state, result)
      })
    }),

    describe("PC vs Boss widens the gap", () => {
      beforeEach(() => {
        let attacker = evader(brickMobile, "near")
        let target = pursuer(battleTruck, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.WIDEN_THE_GAP
        state.edited = true
      }),

      it("fails to widen the gap", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        state.swerve = roll(0)

        const result = CRS.process(state)

        // the attack was a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("fails to widen the gap as a stunt", () => {
        // Swerve 2 + Action Value 7 - Defense 15 - Stunt 2
        // Outcome 2 + Squeal 10 = Smackdown 12
        state.stunt = true
        state.swerve = roll(0)

        const result = CRS.process(state)

        // the attack was a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("widens the gap", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Squeal 10 = Smackdown 14
        // Smackdown 14 - Handling 6 = 8 Chase Points
        state.method = ChaseMethod.WIDEN_THE_GAP
        state.swerve = roll(12)

        const result = CRS.process(state)

        // the attack was a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 4,
          smackdown: 14,
          chasePoints: 8,
          conditionPoints: 0,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("widens the gap as a stunt", () => {
        // Swerve 12 + Action Value 7 - Defense 15 - Stunt 2 = Outcome 2
        // Outcome 2 + Squeal 10 = Smackdown 12
        // Smackdown 12 - Handling 6 = 6 Chase Points
        state.stunt = true
        state.swerve = roll(12)

        const result = CRS.process(state)

        // the attack was a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 2,
          smackdown: 12,
          chasePoints: 6,
          conditionPoints: 0,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      })
    }),

    describe("PC vs Boss narrows the gap", () => {
      beforeEach(() => {
        let attacker = pursuer(brickMobile, "far")
        let target = evader(battleTruck, "far")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.NARROW_THE_GAP
        state.edited = true
      })

      it("fails to narrow the gap", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        state.swerve = roll(0)

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("fails to narrow the gap as a stunt", () => {
        // Swerve 2 + Action Value 7 - Defense 15
        state.stunt = true
        state.swerve = roll(0)

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("narrows the gap", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Squeal 10 = Smackdown 14
        // Smackdown 14 - Handling 6 = 8 Chase Points
        state.swerve = roll(12)

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 4,
          smackdown: 14,
          chasePoints: 8,
          conditionPoints: 0,
          position: "near"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("narrows the gap as a stunt", () => {
        // Swerve 12 + Action Value 7 - Defense 15 - Stunt 2 = Outcome 2
        // Outcome 2 + Squeal 10 = Smackdown 12
        // Smackdown 12 - Handling 6 = 6 Chase Points
        state.stunt = true
        state.swerve = roll(12)

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 2,
          smackdown: 12,
          chasePoints: 6,
          conditionPoints: 0,
          position: "near"
        })

        expectAttackerUnharmed(state, result)
      })
    }),

    describe("PC vs Boss sideswipes", () => {
      beforeEach(() => {
        let attacker = pursuer(brickMobile, "near")
        let target = evader(battleTruck, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.RAM_SIDESWIPE
        state.edited = true
      }),

      it("fails to ram/sideswipe the boss", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        state.swerve = roll(0)

        const result = CRS.process(state)

        // the attack was a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("fails to ram/sideswipe the boss as a stunt", () => {
        // Swerve 9 + Action Value 7 - Defense 15 - Stunt 2 = Outcome -1
        state.stunt = true
        state.swerve = roll(9)

        const result = CRS.process(state)

        // the attack was a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("rams/sideswipes the boss", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Crunch 8 = Smackdown 12
        // Smackdown 12 - Frame 10 = 2 Chase Points
        state.swerve = roll(12)

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 4,
          smackdown: 12,
          chasePoints: 2,
          conditionPoints: 2,
          bump: 4
        })
      }),

      it("rams/sideswipes the boss as a stunt", () => {
        // Swerve 14 + Action Value 7 - Defense 15 - Stunt 2 = Outcome 4
        // Outcome 4 + Crunch 8 = Smackdown 12
        // Smackdown 12 - Frame 10 = 2 Chase Points
        state.stunt = true
        state.swerve = roll(14)

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 14,
          outcome: 2,
          smackdown: 12,
          chasePoints: 2,
          conditionPoints: 2,
          bump: 4
        })

        // attacker takes a bump of 4 condition points
        expect(VS.chasePoints(result.attacker)).toEqual(4)
        expect(VS.conditionPoints(result.attacker)).toEqual(4)
      })
    }),

    describe("PC vs Mooks evades", () => {
      beforeEach(() => {
        let attacker = evader(brickMobile, "far")
        let target = pursuer(hondas, "far")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.EVADE
        state.count = 2
        state.edited = true
      }),

      it("fails to evade", () => {
        // Swerve 0 + Action Value 7 - Defense 7
        // Attack fails, no mooks killed
        state.count = 1
        state.swerve = roll(-1)
        state.edited = true

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("evades 1 mook", () => {
        // Swerve 0 + Action Value 7 - Defense 7 = Outcome 0
        // Attack success, 1 mook killed
        state.swerve = roll(0)
        state.count = 1

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 0,
          outcome: 0,
          mooks: 1,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("evades 1 mook as a stunt", () => {
        // Swerve 2 + Action Value 7 - Defense 7 = Outcome 0
        // Attack success, 1 mook killed
        state.stunt = true
        state.swerve = roll(2)
        state.count = 1

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 2,
          outcome: 0,
          mooks: 1,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("evades 5 mooks", () => {
        // Swerve 12 + Action Value 7 - Defense 7 = Outcome 12
        // Attack success, 5 mooks killed
        state.swerve = roll(12)
        state.count = 5

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 12,
          mooks: 5,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("evades 5 mooks as a sunt", () => {
        state.stunt = true

        // Swerve 14 + Action Value 7 - Defense 7 = Outcome 12
        // Attack success, 5 mooks killed
        state.swerve = roll(14)
        state.count = 5

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 14,
          outcome: 12,
          mooks: 5,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      })
    }),

    describe("PC vs Mooks widens the gap", () => {
      beforeEach(() => {
        let attacker = pursuer(brickMobile, "near")
        let target = evader(hondas, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.WIDEN_THE_GAP
        state.count = 2
        state.edited = true
      }),

      it("fails to widen the gap", () => {
        // Swerve -1 + Action Value 7 - Defense 15
        // Attack fails, no mooks killed
        state.count = 1
        state.swerve = roll(-2)
        state.edited = true

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("widens the gap taking out 1 mook", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        // Attack success, 1 mook killed
        state.swerve = roll(0)
        state.count = 1

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectAttackerUnharmed(state, result)

        // the target has lost 1 mook
        expect(VS.mooks(result.target)).toEqual(VS.mooks(state.target) - 1)

        // they've widened the gap, they're now "far"
        expect(VS.position(result.attacker)).toEqual("far")
        expect(VS.position(result.target)).toEqual("far")
      }),

      it("widens the gap taking out 5 mooks", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Attack success, 5 mooks killed
        state.swerve = roll(12)
        state.count = 5

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 4,
          mooks: 5,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("widens the gap taking out 5 mooks as a stunt", () => {
        state.stunt = true

        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Attack success, 5 mooks killed
        state.swerve = roll(12)
        state.count = 5

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 2,
          mooks: 5,
          position: "far"
        })

        expectAttackerUnharmed(state, result)
      })
    }),

    describe("PC vs Mooks narrows the gap", () => {
      beforeEach(() => {
        let attacker = pursuer(brickMobile, "far")
        let target = evader(hondas, "far")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.NARROW_THE_GAP
        state.count = 2
        state.edited = true
      }),

      it("fails to narrow the gap", () => {
        // Swerve -1 + Action Value 7 - Defense 7
        // Attack fails, no mooks killed
        state.count = 1
        state.swerve = roll(-2)
        state.edited = true

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("narrows the gap taking out 1 mook", () => {
        // Swerve 0 + Action Value 7 - Defense 7
        // Attack success, 1 mook killed
        state.swerve = roll(0)
        state.count = 1

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 0,
          outcome: 0,
          mooks: 1,
          position: "near"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("narrows the gap taking out 1 mook as a stunt", () => {
        // Swerve 0 + Action Value 7 - Defense 7
        // Attack success, 1 mook killed
        state.swerve = roll(2)
        state.count = 1

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 2,
          outcome: 0,
          mooks: 1,
          position: "near"
        })

        expectAttackerUnharmed(state, result)
      }),

      it("narrows the gap taking out 5 mooks", () => {
        // Swerve 12 + Action Value 7 - Defense 7
        // Attack success, 5 mooks killed
        state.swerve = roll(12)
        state.count = 5

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectAttackerUnharmed(state, result)

        expectChaseResults(state, result, {
          swerve: 12,
          outcome: 12,
          mooks: 5,
          position: "near"
        })
      }),

      it("narrows the gap taking out 5 mooks as a stunt", () => {
        state.stunt = true

        // Swerve 12 + Action Value 7 - Defense 7
        // Attack success, 5 mooks killed
        state.swerve = roll(14)
        state.count = 5

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectAttackerUnharmed(state, result)

        expectChaseResults(state, result, {
          swerve: 14,
          outcome: 12,
          mooks: 5,
          position: "near"
        })
      })
    }),

    describe("PC vs Mooks sideswipes", () => {
      beforeEach(() => {
        let attacker = pursuer(brickMobile, "near")
        let target = evader(hondas, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.RAM_SIDESWIPE
        state.count = 2
        state.edited = true
      }),

      it("fails to kill any mooks", () => {
        // Swerve -1 + Action Value 7 - Defense 15
        // Attack fails, no mooks killed
        state.count = 1
        state.swerve = roll(-2)
        state.edited = true

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("sideswipes 1 mook", () => {
        // Swerve 25 + Action Value 7 - Defense 15 = Outcome 17
        // Attack succeeds, kills 1 Mook
        state.count = 1
        state.swerve = roll(25)
        state.edited = true
        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 25,
          outcome: 17,
          mooks: 1,
        })

        expectAttackerUnharmed(state, result)
      }),

      it("sideswipes 1 mook as a stunt", () => {
        state.stunt = true

        // Swerve 27 + Action Value 7 - Defense 15 = Outcome 17
        // Attack succeeds, kills 1 Mook
        state.count = 1
        state.swerve = roll(27)
        state.edited = true
        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 27,
          outcome: 17,
          mooks: 1,
        })

        expectAttackerUnharmed(state, result)
      }),

      it("sideswipes 5 mooks", () => {
        // Swerve 25 + Action Value 7 - Defense 20 = Outcome 12
        // Attack succeeds, kills 5 Mooks
        state.count = 5
        state.swerve = roll(25)
        state.edited = true

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 25,
          outcome: 12,
          mooks: 5,
        })

        expectAttackerUnharmed(state, result)
      }),

      it("sideswipes 5 mooks as a stunt", () => {
        state.stunt = true

        // Swerve 25 + Action Value 7 - Defense 20 = Outcome 12
        // Attack succeeds, kills 5 Mooks
        state.count = 5
        state.swerve = roll(27)
        state.edited = true

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          swerve: 27,
          outcome: 12,
          mooks: 5,
        })

        expectAttackerUnharmed(state, result)
      })
    }),

    describe("Mooks vs PC evades", () => {
      beforeEach(() => {
        let attacker = evader(hondas, "far")
        let target = pursuer(brickMobile, "far")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.EVADE
        state.count = 2
        state.edited = true
      }),

      it("fails to evade", () => {
        // Swerve -2 + Action Value 7 - Defense 7
        // Attack fails, no damage
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(-2))
          .mockReturnValueOnce(roll(-2))

        const result = CRS.process(state)

        // the attack was a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("evades", () => {
        // First attack:
        // Swerve 12 + Action Value 7 - Defense 7 = Outcome 12
        // Outcome 12 + Squeal 11 = Smackdown 23
        // Smackdown 23 - Handling 8 = 15 Chase Points
        //
        // Second attack:
        // Swerve 5 + Action Value 7 - Defense 7 = Outcome 5
        // Outcome 5 + Squeal 11 = Smackdown 16
        // Smackdown 16 - Handling 8 = 8 Chase Points
        //
        // Total Chase Points = 23
        //
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(12))
          .mockReturnValueOnce(roll(5))

        const result = CRS.process(state)

        // the attack was a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          // these values are 0 because the results are not used
          swerve: 0,
          outcome: 0,
          smackdown: 0,

          chasePoints: 23,
          conditionPoints: 0
        })
      })
    }),

    describe("Mooks vs PC widens the gap", () => {
      beforeEach(() => {
        let attacker = evader(hondas, "near")
        let target = pursuer(brickMobile, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.WIDEN_THE_GAP
        state.count = 2
        state.edited = true
      }),

      it("fails to widen the gap", () => {
        // Swerve -2 + Action Value 7 - Defense 7
        // Attack fails, no damage
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(-2))
          .mockReturnValueOnce(roll(-2))

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("widens the gap", () => {
        // First attack:
        // Swerve 12 + Action Value 7 - Defense 7 = Outcome 12
        // Outcome 12 + Squeal 11 = Smackdown 23
        // Smackdown 23 - Handling 8 = 15 Chase Points
        //
        // Second attack:
        // Swerve 5 + Action Value 7 - Defense 7 = Outcome 5
        // Outcome 5 + Squeal 11 = Smackdown 16
        // Smackdown 16 - Handling 8 = 8 Chase Points
        //
        // Total Chase Points = 23
        //
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(12))
          .mockReturnValueOnce(roll(5))

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          // these values are 0 because the results are not used
          swerve: 0,
          outcome: 0,
          smackdown: 0,

          chasePoints: 23,
          conditionPoints: 0,
          position: "far"
        })
        expectAttackerUnharmed(state, result)
      })
    }),

    describe("Mooks vs PC narrows the gap", () => {
      beforeEach(() => {
        let attacker = pursuer(hondas, "far")
        let target = evader(brickMobile, "far")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.NARROW_THE_GAP
        state.count = 2
        state.edited = true
      }),

      it("fails to narrow the gap", () => {
        // Swerve -2 + Action Value 7 - Defense 7
        // Attack fails, no damage
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(-2))
          .mockReturnValueOnce(roll(-2))

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("narrows the gap", () => {
        // First attack:
        // Swerve 12 + Action Value 7 - Defense 7 = Outcome 12
        // Outcome 12 + Squeal 11 = Smackdown 23
        // Smackdown 23 - Handling 8 = 15 Chase Points
        //
        // Second attack:
        // Swerve 5 + Action Value 7 - Defense 7 = Outcome 5
        // Outcome 5 + Squeal 11 = Smackdown 16
        // Smackdown 16 - Handling 8 = 8 Chase Points
        //
        // Total Chase Points = 23
        //
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(12))
          .mockReturnValueOnce(roll(5))

        const result = CRS.process(state)

        // the attack was a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          // these values are 0 because the results are not used
          swerve: 0,
          outcome: 0,
          smackdown: 0,

          chasePoints: 23,
          conditionPoints: 0,
          position: "near"
        })
        expectAttackerUnharmed(state, result)
      })
    }),

    describe("Mooks vs PC rams/sideswipes", () => {
      beforeEach(() => {
        let attacker = pursuer(hondas, "near")
        let target = evader(brickMobile, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.method = ChaseMethod.RAM_SIDESWIPE
        state.count = 2
        state.edited = true
      }),

      it("fails to ram/sideswipe the PC", () => {
        // Swerve -2 + Action Value 7 - Defense 7
        // Attack fails, no damage
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(-2))
          .mockReturnValueOnce(roll(-2))

        const result = CRS.process(state)

        // the attack is a miss
        expect(result.success).toEqual(false)

        expectNoChanges(state, result)
      }),

      it("rams/sideswipes the PC", () => {
        // First attack:
        // Swerve 12 + Action Value 7 - Defense 7 = Outcome 12
        // Outcome 12 + Crunch 7 = Smackdown 19
        // Smackdown 19 - Frame 6 = 13 Chase Points
        //
        // Second attack:
        // Swerve 5 + Action Value 7 - Defense 7 = Outcome 5
        // Outcome 5 + Crunch 7 = Smackdown 12
        // Smackdown 12 - Frame 6 = 6 Chase Points
        //
        // Total Chase Points = 19
        //
        const swerveSpy = jest.spyOn(CRS.AS, "swerve")
        swerveSpy
          .mockReturnValueOnce(roll(12))
          .mockReturnValueOnce(roll(5))

        const result = CRS.process(state)

        // the attack is a success
        expect(result.success).toEqual(true)

        expectChaseResults(state, result, {
          // these values are 0 because the results are not used
          swerve: 0,
          outcome: 0,
          smackdown: 0,

          chasePoints: 19,
          conditionPoints: 19,

          bump: 1
        })
      })
    })
  })
})
