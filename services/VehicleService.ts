import type { Position, Fight, Vehicle, CharacterEffect } from "../types/types"
import CS, { woundThresholds } from "./CharacterService"

const VehicleService = {
  name: (vehicle: Vehicle): string => {
    return vehicle.name
  },

  type: (vehicle: Vehicle): string => {
    return "PC"
  },

  isVehicle: (vehicle: Vehicle): boolean => {
    return (vehicle.category === "vehicle")
  },

  isType: (vehicle: Vehicle, type: string | string[]): boolean => {
    if (Array.isArray(type)) {
      return type.includes(vehicle.action_values["Type"] as string)
    }

    return vehicle.action_values["Type"] === type
  },

  actionValue: (vehicle: Vehicle, key: string): number => {
    const value = VehicleService.rawActionValue(vehicle, key)
    return Math.max(0, value - (vehicle.impairments || 0))
  },

  rawActionValue: (vehicle: Vehicle, key: string): number => {
    return vehicle.action_values[key] as number || 0
  },

  // Use when fetching action values other than numbers.
  otherActionValue: (vehicle: Vehicle, key: string): string => {
    return vehicle.action_values[key] as string || ""
  },

  mainAttackValue: (vehicle: Vehicle): number => {
    if (!vehicle.driver?.id) return 7

    return CS.skill(vehicle.driver, "Driving")
  },

  isPursuer: (vehicle: Vehicle): boolean => {
    return vehicle.otherActionValue("Pursuer") === "true"
  },

  isNear: (vehicle: Vehicle): boolean => {
    return VehicleService.position(vehicle).toLowerCase() === "Near".toLowerCase()
  },

  position: (vehicle: Vehicle): Position => {
    return vehicle.otherActionValue("Position") as Position
  },

  isImpaired: (vehicle: Vehicle): boolean => {
    return vehicle.impairments > 0
  },

  chasePoints: (vehicle: Vehicle): number => {
    return VehicleService.rawActionValue(vehicle, "Chase Points")
  },

  conditionPoints: (vehicle: Vehicle): number => {
    return VehicleService.rawActionValue(vehicle, "Condition Points")
  },

  calculateImpairments: (vehicle: Vehicle, originalChasePoints, newChasePoints: number): number => {
    if (VehicleService.isType(vehicle, "Mook")) return 0

    const threshold = woundThresholds[CS.type(vehicle)]

    // a Boss and an Uber-Boss gain 1 point of Impairment when their Chase Points
    // goes from < 40 to between 40 and 44
    // A PC, Ally, Featured Foe gain 1 point of Impairment when their Chase Points
    // go from < 25 to between 25 and 30
    if (originalChasePoints < threshold.low && newChasePoints >= threshold.low && newChasePoints <= threshold.high) {
      return 1
    }
    // Boss and Uber-Boss gain 1 point of Impairment when their Chase Points go from
    // between 40 and 44 to > 45
    // PC, Ally, Featured Foe gain 1 point of Impairment when their Chase Points go from
    // between 25 and 29 to >= 30
    if (originalChasePoints >= threshold.low && originalChasePoints < threshold.high && newChasePoints >= 30) {
      return 1
    }
    // Boss and Uber-Boss gain 2 points of Impairment when their Chase Points go from
    // < 40 to >= 45
    // PC, Ally, Featured Foe gain 2 points of Impairment when their Chase Points go from
    // < 25 to >= 35
    if (originalChasePoints < threshold.low && newChasePoints >= threshold.high) {
      return 2
    }

    return 0
  },

  calculateChasePoints: (vehicle: Vehicle, smackdown: number): number => {
    const toughness = VehicleService.actionValue(vehicle, "Handling")
    const chasePoints = Math.max(0, smackdown - toughness)

    return chasePoints
  },

  takeChasePoints: (vehicle: Vehicle, smackdown: number): Vehicle => {
    const chasePoints = VehicleService.calculateChasePoints(vehicle, smackdown)
    const originalChasePoints = VehicleService.chasePoints(vehicle)
    const impairments = VehicleService.calculateImpairments(vehicle, originalChasePoints, originalChasePoints + chasePoints)
    const updatedVehicle = VehicleService.addImpairments(vehicle, impairments)

    return VehicleService.updateActionValue(updatedVehicle, "Chase Points", Math.max(0, originalChasePoints + chasePoints))
  },

  takeRawChasePoints: (vehicle: Vehicle, chasePoints: number): Vehicle => {
    const originalChasePoints = VehicleService.chasePoints(vehicle)
    return VehicleService.updateActionValue(vehicle, "Chase Points", Math.max(0, originalChasePoints + chasePoints))
  },

  calculateConditionPoints: (vehicle: Vehicle, smackdown: number): number => {
    const toughness = VehicleService.rawActionValue(vehicle, "Frame")
    const conditionPoints = Math.max(0, smackdown - toughness)

    return conditionPoints
  },

  takeConditionPoints: (vehicle: Vehicle, smackdown: number): Vehicle => {
    const conditionPoints = VehicleService.calculateConditionPoints(vehicle, smackdown)
    const originalConditionPoints = VehicleService.conditionPoints(vehicle)

    return VehicleService.updateActionValue(vehicle, "Condition Points", Math.max(0, originalConditionPoints + conditionPoints))
  },

  healChasePoints: (vehicle: Vehicle, value: number): Vehicle => {
    const originalWounds = VehicleService.chasePoints(vehicle)
    const impairments = VehicleService.calculateImpairments(vehicle, originalChasePoints - chasePoints, originalChasePoints)
    let updatedVehicle = VehicleService.addImpairments(vehicle, -impairments)

    return VehicleService.updateActionValue(updatedVehicle, "Chase Points", Math.max(0, originalChasePoints - chasePoints))
  },

  addImpairments: (vehicle: Vehicle, value: number): Vehicle => {
    return VehicleService.updateValue(vehicle, "impairments", Math.max(0, vehicle.impairments + value))
  },

  updateValue: (vehicle: Vehicle, key: string, value: number | string): Vehicle => {
    return {
      ...vehicle,
      [key]: value
    } as Vehicle
  },

  updateActionValue: (vehicle: Vehicle, key: string, value: number | string): Vehicle => {
    return {
      ...vehicle,
      action_values: {
        ...vehicle.action_values,
        [key]: value
      }
    } as Vehicle
  },

  updatePosition: (vehicle: Vehicle, position: Position): Vehicle => {
    return VehicleService.updateActionValue(vehicle, "Position", position)
  },

  updatePursuer: (vehicle: Vehicle, pursuer: boolean): Vehicle => {
    return VehicleService.updateActionValue(vehicle, "Pursuer", pursuer)
  },

  updateDriver: (vehicle: Vehicle, driver: Character | null): Vehicle => {
    console.log("vehicle.driver", vehicle.driver)
    if (!driver?.id) {
      return VehicleService.updateValue(vehicle, "driver", { id: "" } as Character)
    }
    return VehicleService.updateValue(vehicle, "driver", driver)
  },

}

export default VehicleService
