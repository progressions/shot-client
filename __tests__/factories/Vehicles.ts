import type { Vehicle, Character } from "../../types/types"
import { defaultVehicle, defaultCharacter } from "../../types/types"
import { carolina, shing } from "./Characters"

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

