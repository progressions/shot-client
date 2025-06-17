import type { Character, Vehicle, Fight, FightEvent } from "@/types/types"
import Client from "@/utils/Client"

const FightEventService = {
  getFightEvents: async function(client: Client, fight: Fight): Promise<FightEvent[]> {
    return client.getFightEvents(fight)
  },

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

  attack: async function(client: Client, fight: Fight, attacker: Character, target: Character, wounds: number, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "attack", description: `${attacker.name} attacked ${target.name} doing ${wounds} ${wounds == 1 ? "Wound" : "Wounds"} and spent ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, wounds, shots}})
  },

  killMooks: async function(client: Client, fight: Fight, attacker: Vehicle, target: Vehicle, count: number, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "kill_mooks", description: `${attacker.name} attacked ${target.name} and killed ${count} ${count == 1 ? "mook" : "mooks"} and spent ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, count, shots}})
  },

  spendShots: async function(client: Client, fight: Fight, character: Character, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "Shots_spent", description: `${character.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { character: { id: character.id, name: character.name }, shots}})
  },

  dodge: async function(client: Client, fight: Fight, character: Character, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "dodged", description: `${character.name} dodged for ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { character: { id: character.id, name: character.name }, shots}})
  },

  chaseAttack: async function(client: Client, fight: Fight, attacker: Vehicle, target: Vehicle, chasePoints: number, conditionPoints: number, method: string): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "chase_attack", description: `${attacker.name} used ${method} on ${target.name} doing ${chasePoints} Chase Points and ${conditionPoints} Condition Points`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, chasePoints, conditionPoints, method}})
  },

  chaseMooks: async function(client: Client, fight: Fight, attacker: Vehicle, target: Vehicle, count: number, method: string): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "chase_mooks", description: `${attacker.name} used ${method} on ${target.name} and killed ${count} ${count == 1 ? "mook" : "mooks"}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, count}})
  }
}

export default FightEventService
