import type { AttackRoll, Swerve, Character, Fight } from "../../types/types"
import { defaultSwerve, defaultCharacter } from "../../types/types"
import AS from "../../services/ActionService"

describe("ActionService", () => {
  describe("actionResult", () => {
    it("adds the Swerve and the Action Value", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult } = AS.actionResult({ swerve: roll, actionValue: 17 })
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    })
  }),

  describe("outcome", () => {
    it("subtracts the Defense from the actionResult", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult, outcome } = AS.outcome({ swerve: roll, actionValue: 17, defense: 5 })
      expect(outcome).toEqual(18)
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    }),

    it("adds 2 to the Defense if the attack is a stunt", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult, outcome } = AS.outcome({ swerve: roll, actionValue: 17, defense: 5, stunt: true })
      expect(outcome).toEqual(16)
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    })
  }),

  describe("smackdown", () => {
    it("adds the Damage to the Outcome", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult, outcome, smackdown } = AS.smackdown(
        {
          swerve: roll,
          actionValue: 17,
          defense: 5,
          damage: 7
        }
      )
      expect(smackdown).toEqual(25)
      expect(outcome).toEqual(18)
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    }),

    it("subtracts 2 if the attack is a stunt", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult, outcome, smackdown } = AS.smackdown(
        {
          swerve: roll,
          actionValue: 17,
          defense: 5,
          stunt: true,
          damage: 7
        }
      )
      expect(smackdown).toEqual(23)
      expect(outcome).toEqual(16)
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    })
  }),

  describe("wounds", () => {
    it("subtracts toughness from the smackdown", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult, outcome, smackdown, wounds } = AS.wounds(
        {
          swerve: roll,
          actionValue: 17,
          defense: 5,
          damage: 7,
          toughness: 6
        }
      )
      expect(wounds).toEqual(19)
      expect(smackdown).toEqual(25)
      expect(outcome).toEqual(18)
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    }),

    it("subtracts 2 if the attack is a stunt", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const { swerve, actionResult, outcome, smackdown, wounds } = AS.wounds( {
        swerve: roll,
        actionValue: 17,
        defense: 5,
        stunt: true,
        damage: 7,
        toughness: 6
      })
      expect(wounds).toEqual(17)
      expect(smackdown).toEqual(23)
      expect(outcome).toEqual(16)
      expect(actionResult).toEqual(23)
      expect(swerve).toEqual(6)
    })
  }),

  describe("attacks", () => {
    it("returns an array of attacks", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const attacks = AS.attacks({
        count: 2,
        swerve: roll,
        actionValue: 17,
        defense: 5,
        stunt: true,
        damage: 7,
        toughness: 6
      })
      expect(attacks).toEqual([
        {
          boxcars: false,
          swerve: 6,
          actionResult: 23,
          wayAwfulFailure: false,
          outcome: 16,
          success: true,
          smackdown: 23,
          wounds: 17
        },
        {
          boxcars: false,
          swerve: 6,
          actionResult: 23,
          wayAwfulFailure: false,
          outcome: 16,
          success: true,
          smackdown: 23,
          wounds: 17
        }
      ])
    })
  }),

  describe("totalWounds", () => {
    it("returns the total wounds after subtracting toughness from each attack", () => {
      const roll = {
        ...defaultSwerve,
        result: 6
      }
      const attacks = AS.attacks({
        count: 2,
        swerve: roll,
        actionValue: 17,
        defense: 5,
        damage: 7,
        toughness: 6
      })
      expect(AS.totalWounds({ attackRolls: attacks, toughness: 6 })).toEqual(38)
    })
  })
})
