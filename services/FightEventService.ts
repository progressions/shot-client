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
  },

  startFight: async function(client: Client, fight: Fight): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "fight_started", description: `Fight ${fight.name} started`, details: { fight: { id: fight.id, name: fight.name }}})
  },

  attack: async function(client: Client, fight: Fight, attacker: Character, target: Character, wounds: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "attack", description: `${attacker.name} attacks ${target.name} doing ${wounds} Wounds`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, wounds}})
  },

  spendShots: async function(client: Client, fight: Fight, character: Character, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "shots_spent", description: `${character.name} spends ${shots} shots`, details: { character: { id: character.id, name: character.name }, shots}})
  },

  dodge: async function(client: Client, fight: Fight, character: Character, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "dodged", description: `${character.name} dodged for ${shots} shots`, details: { character: { id: character.id, name: character.name }, shots}})
  }
}

export default FightEventService
