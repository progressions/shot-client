import type { Swerve, Character, Vehicle } from "../../types/types"
import { defaultSwerve, defaultCharacter, defaultVehicle } from "../../types/types"
import { ChaseMethod, initialChaseState, ChaseState } from "../../reducers/chaseState"
import CRS from "../../services/ChaseReducerService"
import VS from "../../services/VehicleService"
import { pursuer, evader, hondas, brickMobile, copCar, battleTruck, motorcycles } from "../factories/Vehicles"

function roll(result: number) {
  return {
    ...defaultSwerve,
    result: result
  }
}

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

      it("tries to evade", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        expect(state.actionValue).toEqual(7)
        expect(state.defense).toEqual(15)
        state.swerve = roll(0)
        const result = CRS.process(state)
        expect(result.success).toEqual(false)
      }),

      it("evades", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Squeal 10 = Smackdown 14
        // Smackdown 14 - Handling 6 = 8 Chase Points
        state.swerve = roll(12)
        const result = CRS.process(state)
        expect(result.success).toEqual(true)
        expect(VS.chasePoints(result.target)).toEqual(8)
        expect(VS.conditionPoints(result.target)).toEqual(0)

        // no bump when evading
        expect(VS.chasePoints(result.attacker)).toEqual(0)
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

      it("tries to widen the gap", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        expect(state.actionValue).toEqual(7)
        expect(state.defense).toEqual(15)
        state.swerve = roll(0)
        const result = CRS.process(state)
        expect(result.success).toEqual(false)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
      }),

      it("widens the gap", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Squeal 10 = Smackdown 14
        // Smackdown 14 - Handling 6 = 8 Chase Points
        state.method = ChaseMethod.WIDEN_THE_GAP
        state.swerve = roll(12)
        const result = CRS.process(state)
        expect(result.success).toEqual(true)
        expect(VS.chasePoints(result.target)).toEqual(8)
        expect(VS.conditionPoints(result.target)).toEqual(0)

        // no bump when widening the gap
        expect(VS.chasePoints(result.attacker)).toEqual(0)
        expect(VS.position(result.attacker)).toEqual("far")
        expect(VS.position(result.target)).toEqual("far")
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

      it("tries to narrow the gap", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        expect(state.actionValue).toEqual(7)
        expect(state.defense).toEqual(15)
        state.swerve = roll(0)
        const result = CRS.process(state)
        expect(result.success).toEqual(false)
        expect(VS.position(result.attacker)).toEqual("far")
        expect(VS.position(result.target)).toEqual("far")
      }),

      it("narrows the gap", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Squeal 10 = Smackdown 14
        // Smackdown 14 - Handling 6 = 8 Chase Points
        state.method = ChaseMethod.NARROW_THE_GAP
        state.swerve = roll(12)
        const result = CRS.process(state)
        expect(result.success).toEqual(true)
        expect(VS.chasePoints(result.target)).toEqual(8)
        expect(VS.conditionPoints(result.target)).toEqual(0)

        // no bump when narrowing the gap
        expect(VS.chasePoints(result.attacker)).toEqual(0)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
      })
    }),

    describe("PC vs Boss sideswipes", () => {
      beforeEach(() => {
        let attacker = pursuer(brickMobile, "near")
        let target = evader(battleTruck, "near")

        state = CRS.setAttacker(initialChaseState, attacker)
        state = CRS.setTarget(state, target)
        state.edited = true
      }),

      it("tries to ram/sideswipe the boss", () => {
        // Swerve 0 + Action Value 7 - Defense 15
        expect(state.actionValue).toEqual(7)
        expect(state.defense).toEqual(15)
        state.swerve = roll(0)
        const result = CRS.process(state)
        expect(result.success).toEqual(false)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
      }),

      it("rams/sideswipes the boss", () => {
        // Swerve 12 + Action Value 7 - Defense 15 = Outcome 4
        // Outcome 4 + Crunch 8 = Smackdown 12
        // Smackdown 12 - Frame 10 = 2 Chase Points
        state.swerve = roll(12)
        const result = CRS.process(state)
        expect(result.success).toEqual(true)
        expect(VS.chasePoints(result.target)).toEqual(2)
        expect(VS.conditionPoints(result.target)).toEqual(2)

        // attacker takes a bump of 4 chase points
        expect(VS.chasePoints(result.attacker)).toEqual(4)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
      })
    }),

    describe("PCs vs Mooks sideswipes", () => {
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

        expect(result.success).toEqual(false)
        expect(VS.mooks(result.target)).toEqual(VS.mooks(motorcycles))
      }),

      it("kills 1 out of 15 mooks", () => {
        // Swerve 25 + Action Value 7 - Defense 15 = Outcome 17
        // Attack succeeds, kills 1 Mook
        state.count = 1
        state.swerve = roll(25)
        state.edited = true
        const result = CRS.process(state)

        expect(result.success).toEqual(true)
        expect(VS.mooks(result.target)).toEqual(VS.mooks(motorcycles) - 1)
      }),

      it("kills 5 out of 15 mooks", () => {
        // Swerve 25 + Action Value 7 - Defense 20 = Outcome 12
        // Attack succeeds, kills 5 Mooks
        state.count = 5
        state.swerve = roll(25)
        state.edited = true
        state = CRS.process(state)

        expect(state.success).toEqual(true)
        expect(VS.mooks(state.target)).toEqual(VS.mooks(motorcycles) - 5)
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
        expect(result.success).toEqual(false)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
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
        expect(result.success).toEqual(true)

        // console.log(result.mookResults)

        expect(result.chasePoints).toEqual(19)
        expect(result.conditionPoints).toEqual(19)
        expect(VS.chasePoints(result.target)).toEqual(19)
        expect(VS.conditionPoints(result.target)).toEqual(19)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
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
        expect(result.success).toEqual(false)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
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

        expect(state.method).toEqual(ChaseMethod.WIDEN_THE_GAP)
        expect(VS.position(state.attacker)).toEqual("near")
        expect(VS.position(state.target)).toEqual("near")
        expect(VS.chasePoints(state.target)).toEqual(0)

        const result = CRS.process(state)

        expect(result.success).toEqual(true)
        expect(result.chasePoints).toEqual(23)
        expect(result.conditionPoints).toEqual(0)
        expect(VS.chasePoints(result.target)).toEqual(23)
        expect(VS.conditionPoints(result.target)).toEqual(0)
        expect(VS.position(result.attacker)).toEqual("far")
        expect(VS.position(result.target)).toEqual("far")
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
        expect(result.success).toEqual(false)
        expect(VS.chasePoints(result.attacker)).toEqual(0)
        expect(VS.conditionPoints(result.attacker)).toEqual(0)
        expect(VS.chasePoints(result.target)).toEqual(0)
        expect(VS.conditionPoints(result.target)).toEqual(0)
        expect(VS.position(result.attacker)).toEqual("far")
        expect(VS.position(result.target)).toEqual("far")
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
        expect(result.success).toEqual(true)

        expect(result.chasePoints).toEqual(23)
        expect(result.conditionPoints).toEqual(0)
        expect(VS.chasePoints(result.target)).toEqual(23)
        expect(VS.conditionPoints(result.target)).toEqual(0)
        expect(VS.position(result.attacker)).toEqual("near")
        expect(VS.position(result.target)).toEqual("near")
      })
    })
  })
})
