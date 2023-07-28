import type { Vehicle, Character } from "../../types/types"
import { defaultVehicle, defaultCharacter } from "../../types/types"
import { carolina, shing } from "./Characters"
import VS from "../../services/VehicleService"

export function pursuer(vehicle: Vehicle, position: string) {
  return VS.chain(vehicle, [
    ["updateActionValue", "Pursuer", "true"],
    ["updatePosition", position]
  ])
}
export function evader(vehicle: Vehicle, position: string) {
  return VS.chain(vehicle, [
    ["updateActionValue", "Pursuer", "false"],
    ["updatePosition", position]
  ])
}

export const brickMobile: Vehicle = {
  ...defaultVehicle,
  name: "Brickmobile",
  action_values: {
    "Type": "PC",
    "Acceleration": 8,
    "Handling": 8,
    "Squeal": 10,
    "Frame": 6,
    "Crunch": 8
  }
}

export const copCar: Vehicle = {
  ...defaultVehicle,
  name: "PC",
  driver: carolina,
  // Driving: 13
  action_values: {
    "Type": "Featured Foe",
    "Acceleration": 8,
    "Handling": 8,
    "Squeal": 10,
    "Frame": 6,
    "Crunch": 8
  }
}

export const battleTruck: Vehicle = {
  ...defaultVehicle,
  name: "Battle Truck",
  driver: shing,
  // Driving: 15
  action_values: {
    "Type": "Boss",
    "Acceleration": 6,
    "Handling": 6,
    "Squeal": 8,
    "Frame": 10,
    "Crunch": 12
  }
}

export const motorcycles: Vehicle = {
  ...defaultVehicle,
  name: "Motorcycles",
  count: 15,
  action_values: {
    "Type": "Mook",
    "Acceleration": 6,
    "Handling": 8,
    "Squeal": 10,
    "Frame": 0,
    "Crunch": 0
  }
}

export const hondas: Vehicle = {
  ...defaultVehicle,
  name: "Hondas",
  count: 15,
  action_values: {
    "Type": "Mook",
    "Acceleration": 6,
    "Handling": 9,
    "Squeal": 11,
    "Frame": 5,
    "Crunch": 7
  }
}
