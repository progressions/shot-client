import { NextApiRequest, NextApiResponse } from 'next'
import { AlertColor } from "@mui/material"

export interface Toast {
  open: boolean
  message: string
  severity: AlertColor | undefined
}

export interface Campaign {
  id?: string
  title: string
  description?: string
  gamemaster?: User
  new?: boolean
  players: User[]
  invitations: Invitation[]
}

export interface ActionValues {
  [key: string]: string | number | null | undefined | boolean
  Guns?: number
  "Martial Arts"?: number
  Sorcery?: number
  Scroungetech?: number
  Genome?: number
  Creature?: number
  Defense?: number
  Toughness?: number
  Speed?: number
  Fortune?: number
  "Max Fortune"?: number
  FortuneType?: string
  MainAttack?: string
  SecondaryAttack?: string | null
  Wounds: number
  Type?: CharacterType
  Damage?: number
  Vehicle?: boolean
  "Marks of Death": number
  Archetype: string
  Faction: string
}

export interface VehicleActionValues {
  [key: string]: string | number | Position | CharacterType | undefined
  Acceleration: number
  Handling: number
  Squeal: number
  Frame: number
  Crunch: number
  "Chase Points": number
  "Condition Points": number
  Position: Position
  Type: CharacterType
  Faction: string
}

export interface Schtick {
  id?: string
  title: string
  description: string
  campaign_id: string
  category: string
  path: string
  schtick_id: string
  prerequisite: {
    id?: string
    title?: string
  }
}

export type Position = "near" | "far"

export type CharacterType = "" | "PC" | "Ally" | "Mook" | "Featured Foe" | "Boss" | "Uber-Boss"

export interface ID {
  id: string
}

export type Character = Vehicle | Person

export interface Vehicle {
  id?: string
  name: string
  active: boolean
  current_shot?: number | string
  impairments: number
  color: string
  action_values: VehicleActionValues
  description: any
  schticks: Schtick[]
  advancements: Advancement[]
  sites: Site[]
  skills: any
  user?: User
  created_at?: string
  updated_at?: string
  new?: boolean
  category: "character" | "vehicle"
}

export interface Person {
  id?: string
  name: string
  active: boolean
  current_shot?: number | string
  impairments: number
  color: string
  action_values: ActionValues
  description: any
  schticks: Schtick[]
  skills: any
  advancements: Advancement[]
  sites: Site[]
  user?: User
  created_at?: string
  updated_at?: string
  new?: boolean
  category: "character" | "vehicle"
}

export interface Advancement {
  id?: string
  description: string
}

export interface Site {
  id?: string
  description: string
}

export interface Effect {
  id?: string
  title: string
  description: string
  severity: AlertColor | undefined
  start_sequence: number
  end_sequence: number
  start_shot: number
  end_shot: number
}

export interface CharacterEffect {
  id?: string
  title: string
  description?: string
  character_id?: string
  vehicle_id?: string
  severity: AlertColor | undefined
  change?: string
  action_value?: string
}

export type ShotType = [number, Character[]]

export interface Fight {
  id?: string
  active: boolean
  name?: string
  sequence: number
  effects: Effect[]
  characters?: Character[]
  vehicles?: Vehicle[]
  shot_order: ShotType[]
  character_effects: any
}

export interface User {
  id?: string,
  email: string,
  password?: string,
  first_name?: string,
  last_name?: string,
  gamemaster?: boolean,
  admin?: boolean,
  avatar_url?: string
}

export interface Invitation {
  id?: string
  email?: string
  campaign_id: string
  maximum_count: number
  remaining_count: number
}

export interface CharacterFilter {
  type: string | null,
  name: string | null
}

export interface ServerSideProps {
  req: NextApiRequest,
  res: NextApiResponse,
  params?: any
  query?: any
}

export const defaultCharacter:Person = {
  name: '',
  category: "character",
  active: true,
  current_shot: 0,
  impairments: 0,
  color: '',
  action_values: {
    Archetype: "",
    Guns: 0,
    "Martial Arts": 0,
    Sorcery: 0,
    Scroungetech: 0,
    Genome: 0,
    Creature: 0,
    Defense: 0,
    Toughness: 0,
    Speed: 0,
    Fortune: 0,
    "Max Fortune": 0,
    FortuneType: "Fortune",
    MainAttack: "Guns",
    SecondaryAttack: null,
    Wounds: 0,
    Type: "Featured Foe",
    Vehicle: false,
    "Marks of Death": 0,
    Damage: 0,
    Faction: ""
  },
  description: {
    "Nicknames": "",
    "Age": "",
    "Height": "",
    "Weight": "",
    "Hair Color": "",
    "Eye Color": "",
    "Style of Dress": "",
    "Appearance": "",
    "Background": ""
  },
  schticks: [],
  skills: {},
  advancements: [],
  sites: []
}

export const defaultVehicle:Vehicle = {
  name: '',
  active: true,
  category: "vehicle",
  current_shot: '',
  impairments: 0,
  color: '',
  action_values: {
    Acceleration: 0,
    Handling: 0,
    Squeal: 0,
    Frame: 0,
    Crunch: 0,
    "Chase Points": 0,
    "Condition Points": 0,
    Pursuer: "true",
    Position: "far",
    Type: "Featured Foe",
    Faction: ""
  },
  description: {},
  schticks: [],
  skills: {},
  advancements: [],
  sites: []
}

export const defaultFight:Fight = {
  name: '',
  active: true,
  sequence: 1,
  effects: [],
  characters: [],
  shot_order: [],
  character_effects: []
}

export const defaultUser:User = {
  email: '',
}

export const defaultEffect:Effect = {
  title: "",
  description: "",
  severity: "error",
  start_sequence: 1,
  end_sequence: 2,
  start_shot: 15,
  end_shot: 15,
}

export const defaultToast:Toast = {
  open: false,
  message: "",
  severity: "success"
}

export const defaultCampaign:Campaign = {
  title: "",
  description: "",
  gamemaster: defaultUser,
  players: [],
  invitations: []
}

export const defaultCharacterEffect:CharacterEffect = {
  title: "",
  description: "",
  severity: "info",
  character_id: ""
}

export const defaultSchtick:Schtick = {
  title: "",
  description: "",
  campaign_id: "",
  category: "",
  path: "",
  schtick_id: "",
  prerequisite: {
    id: "",
    title: ""
  }
}

export const defaultAdvancement:Advancement = {
  description: ""
}

export const defaultSite:Site = {
  description: ""
}
