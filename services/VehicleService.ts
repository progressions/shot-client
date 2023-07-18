import type { Character, Position, Vehicle, CharacterEffect } from "../types/types"
import CS from "./CharacterService"
import SharedService, { woundThresholds } from "./SharedService"

const VehicleService = {
  ...SharedService,

  mainAttackValue: function(vehicle: Vehicle): number {
    if (!vehicle.driver?.id) return 7

    return CS.skill(vehicle.driver, "Driving")
  },

  handling: function(vehicle: Vehicle): number {
    return this.rawActionValue(vehicle, "Handling")
  },

  isPursuer: function(vehicle: Vehicle): boolean {
    return this.otherActionValue(vehicle, "Pursuer") === "true"
  },

  isNear: function(vehicle: Vehicle): boolean {
    return this.position(vehicle).toLowerCase() === "Near".toLowerCase()
  },

  position: function(vehicle: Vehicle): Position {
    return this.otherActionValue(vehicle, "Position") as Position
  },

  chasePoints: function(vehicle: Vehicle): number {
    return this.rawActionValue(vehicle, "Chase Points")
  },

  seriousChasePoints: function(vehicle: Vehicle): boolean {
    return this.seriousPoints(vehicle, this.chasePoints(vehicle))
  },

  seriousConditionPoints: function(vehicle: Vehicle): boolean {
    return this.seriousPoints(vehicle, this.conditionPoints(vehicle))
  },

  conditionPoints: function(vehicle: Vehicle): number {
    return this.rawActionValue(vehicle, "Condition Points")
  },

  calculateChasePoints: function(vehicle: Vehicle, smackdown: number): number {
    const toughness = this.handling(vehicle)
    const chasePoints = Math.max(0, smackdown - toughness)

    return chasePoints
  },

  takeChasePoints: function(vehicle: Vehicle, smackdown: number): Vehicle {
    if (this.isType(vehicle, "Mook")) {
      return this.killMooks(vehicle, smackdown)
    }

    const chasePoints = this.calculateChasePoints(vehicle, smackdown)
    const originalChasePoints = this.chasePoints(vehicle)
    const impairments = this.calculateImpairments(vehicle, originalChasePoints, originalChasePoints + chasePoints)
    const updatedVehicle = this.addImpairments(vehicle, impairments)

    return this.takeRawChasePoints(updatedVehicle, chasePoints)
  },

  takeRawChasePoints: function(vehicle: Vehicle, chasePoints: number): Vehicle {
    const originalChasePoints = this.chasePoints(vehicle)
    return this.updateActionValue(vehicle, "Chase Points", Math.max(0, originalChasePoints + chasePoints))
  },

  calculateConditionPoints: function(vehicle: Vehicle, smackdown: number): number {
    const toughness = this.rawActionValue(vehicle, "Frame")
    const conditionPoints = Math.max(0, smackdown - toughness)

    return conditionPoints
  },

  takeConditionPoints: function(vehicle: Vehicle, smackdown: number): Vehicle {
    const conditionPoints = this.calculateConditionPoints(vehicle, smackdown)
    const originalConditionPoints = this.conditionPoints(vehicle)

    return this.updateActionValue(vehicle, "Condition Points", Math.max(0, originalConditionPoints + conditionPoints))
  },

  healChasePoints: function(vehicle: Vehicle, value: number): Vehicle {
    const originalChasePoints = this.chasePoints(vehicle)
    const impairments = this.calculateImpairments(vehicle, originalChasePoints - value, originalChasePoints)
    let updatedVehicle = this.addImpairments(vehicle, -impairments)

    return this.updateActionValue(updatedVehicle, "Chase Points", Math.max(0, originalChasePoints - value))
  },

  updatePosition: function(vehicle: Vehicle, position: Position): Vehicle {
    return this.updateActionValue(vehicle, "Position", position)
  },

  updatePursuer: function(vehicle: Vehicle, pursuer: boolean): Vehicle {
    return this.updateActionValue(vehicle, "Pursuer", pursuer ? "true" : "false")
  },

  updateDriver: function(vehicle: Vehicle, driver: Character | null): Vehicle {
    if (!driver?.id) {
      return { ...vehicle, driver: { id: "", name: "" } } as Vehicle
    }
    return { ...vehicle, driver: { id: driver.id, name: driver.name } } as Vehicle
  },

}

export default VehicleService
