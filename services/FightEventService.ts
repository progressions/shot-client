import type { Character, Vehicle, Fight, FightEvent } from "@/types/types"
import Client from "@/utils/Client"
import FS from "@/services/FightService"

function shotsText(shots: number): string {
  return `${shots} ${shots == 1 ? "Shot" : "Shots"}`
}

const FightEventService = {
  getFightEvents: async function(client: Client, fight: Fight): Promise<FightEvent[]> {
    return client.getFightEvents(fight)
  },

  createFight: async function(client: Client, fight: Fight): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "fight_created", description: `Fight ${fight.name} created`, details: { fight: { id: fight.id, name: fight.name }, sequence: 0, shot: 0}})
  },

  addCharacter: async function(client: Client, fight: Fight, character: Character): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "character_added", description: `Character ${character.name} added`, details: { character: { id: character.id, name: character.name }, sequence: fight.sequence, shot: FS.currentShot(fight)}})
  },

  addVehicle: async function(client: Client, fight: Fight, vehicle: Vehicle): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "vehicle_added", description: `Vehicle ${vehicle.name} added`, details: { vehicle: { id: vehicle.id, name: vehicle.name }, sequence: fight.sequence, shot: FS.currentShot(fight)}})
  },

  removeCharacter: async function(client: Client, fight: Fight, character: Character): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "character_removed", description: `Character ${character.name} removed`, details: { character: { id: character.id, name: character.name }, sequence: fight.sequence, shot: FS.currentShot(fight) }})
  },

  removeVehicle: async function(client: Client, fight: Fight, vehicle: Vehicle): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "vehicle_removed", description: `Vehicle ${vehicle.name} removed`, details: { vehicle: { id: vehicle.id, name: vehicle.name }, sequence: fight.sequence, shot: FS.currentShot(fight) }})
  },

  startSequence: async function(client: Client, fight: Fight, sequence: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "fight_started", description: `Sequence ${sequence} started`, details: { fight: { id: fight.id, name: fight.name }, sequence, shot: FS.currentShot(fight) }})
  },

  attack: async function(client: Client, fight: Fight, attacker: Character, target: Character, wounds: number, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "attack", description: `${attacker.name} attacked ${target.name}, doing ${wounds} ${wounds == 1 ? "Wound" : "Wounds"} and spending ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, wounds, shots, sequence: fight.sequence, shot: FS.currentShot(fight) }})
  },

  killMooks: async function(client: Client, fight: Fight, attacker: Vehicle, target: Vehicle, count: number, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "kill_mooks", description: `${attacker.name} attacked ${target.name}, eliminating ${count} ${count == 1 ? "mook" : "mooks"} and spending ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, count, shots, sequence: fight.sequence, shot: FS.currentShot(fight) }})
  },

  spendShots: async function(client: Client, fight: Fight, character: Character, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "Shots_spent", description: `${character.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { character: { id: character.id, name: character.name }, shots, sequence: fight.sequence, shot: FS.currentShot(fight) }})
  },

  dodge: async function(client: Client, fight: Fight, character: Character, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "dodged", description: `${character.name} dodged for ${shots} ${shots == 1 ? "Shot" : "Shots"}`, details: { character: { id: character.id, name: character.name }, shots, sequence: fight.sequence, shot: FS.currentShot(fight) }})
  },

  event: async function(client: Client, fight: Fight, character: Character, description: string, details: any): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "message", description, details: { character: { id: character.id, name: character.name }, sequence: fight.sequence, shot: FS.currentShot(fight), ...details }})
  },

  chaseAttack: async function(client: Client, fight: Fight, attacker: Vehicle, target: Vehicle, chasePoints: number, conditionPoints: number, method: string, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "chase_attack", description: `${attacker.name} used ${method} on ${target.name}, doing ${chasePoints} Chase Points and ${conditionPoints} Condition Points, spending ${shotsText(shots)}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, chasePoints, conditionPoints, method, sequence: fight.sequence, shot: FS.currentShot(fight), shots}})
  },

  chaseMooks: async function(client: Client, fight: Fight, attacker: Vehicle, target: Vehicle, count: number, method: string, shots: number): Promise<FightEvent> {
    return client.createFightEvent(fight, {event_type: "chase_mooks", description: `${attacker.name} used ${method} on ${target.name}, eliminating ${count} ${count == 1 ? "mook" : "mooks"}, spending ${shotsText(shots)}`, details: { attacker: { id: attacker.id, name: attacker.name }, target: { id: target.id, name: target.name }, count, sequence: fight.sequence, shot: FS.currentShot(fight), shots}})
  }
}

export default FightEventService
