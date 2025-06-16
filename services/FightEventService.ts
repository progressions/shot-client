import type { Character, Vehicle, Fight, FightEvent } from "@/types/types"
import Client from "@/utils/Client"

const FightEventService = {
  createFight: async function(client: Client, fight: Fight): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "fight_created", description: `Fight ${fight.name} created`, details: { fight: { id: fight.id, name: fight.name }}})
  },

  addCharacter: async function(client: Client, fight: Fight, character: Character): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "character_added", description: `Character ${character.name} added`, details: { character: { id: character.id, name: character.name }}})
  },

  addVehicle: async function(client: Client, fight: Fight, vehicle: Vehicle): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "vehicle_added", description: `Vehicle ${vehicle.name} added`, details: { vehicle: { id: vehicle.id, name: vehicle.name }}})
  },

  removeCharacter: async function(client: Client, fight: Fight, character: Character): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "character_removed", description: `Character ${character.name} removed`})
  },

  removeVehicle: async function(client: Client, fight: Fight, vehicle: Vehicle): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "vehicle_removed", description: `Vehicle ${vehicle.name} removed`})
  }
}

export default FightEventService
