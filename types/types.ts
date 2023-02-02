import { NextApiRequest, NextApiResponse } from 'next'
import { Session, User as NextAuthUser } from "next-auth"
import { AlertColor } from "@mui/material"

export interface AuthUser extends NextAuthUser {
  authorization: string | null
  admin: boolean
}

export interface SessionData {
  authorization: {}
  user?: User | AuthUser
}

export interface AuthSession extends Session {
  authorization: {} | null
  id: {}
  status: "loading" | "unauthenticated" | "authenticated"
  data: SessionData | null
}

export interface OptionType {
  inputValue: string
}

export interface FilterParamsType {
  getOptionLabel: (option: string | OptionType) => string
  inputValue: string
}

export type Severity = 'error' | 'info' | 'success' | 'warning'

export type WeaponCategory = string
export type SchtickCategory = string
export type SchtickPath = string
export type Juncture = string

export interface CampaignsResponse {
  gamemaster: Campaign[]
  player: Campaign[]
}

export interface PaginationMeta {
  current_page: number
  next_page: number | null
  prev_page: number | null
  total_pages: number
  total_count: number
}

export interface InputParamsType {
  [key: string]: unknown
}

export interface PasswordWithConfirmation {
  password: string
  password_confirmation: string
}

export interface Toast {
  open: boolean
  message: string
  severity: Severity
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

export interface Weapon {
  id?: string
  name: string
  description: string
  damage: number
  concealment: number
  reload_value: number
  category: WeaponCategory
  juncture: Juncture
  mook_bonus: number
  kachunk: boolean
}

export interface DescriptionValues {
  [key: string]: string
  Nicknames: string
  Age: string
  Height: string
  Weight: string
  "Hair Color": string
  "Eye Color": string
  "Style of Dress": string
  Appearance: string
  Background: string
  "Melodramatic Hook": string
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

export type SkillValue = [string, number] | [string, undefined]

export interface SkillValues {
  [key: string]: number | undefined
  Deceit?: number
  Detective?: number
  Driving?: number
  "Fix-It"?: number
  Gambling?: number
  Intimidation?: number
  Intrusion?: number
  Leadership?: number
  Medicine?: number
  Police?: number
  Sabotage?: number
  Seduction?: number
  Constitution?: number
  Defense?: number
  Melodrama?: number
  Will?: number
  Notice?: number
  Strength?: number
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
  category: SchtickCategory
  path: SchtickPath
  schtick_id: string
  prerequisite: {
    id?: string
    title?: string
  }
  color: string
}

export type Position = "near" | "far"

export type CharacterType = "" | "PC" | "Ally" | "Mook" | "Featured Foe" | "Boss" | "Uber-Boss"

export interface ID {
  id: string
}

export type Character = Vehicle | Person
export type CharacterCategory = "character" | "vehicle"

export interface Vehicle {
  id?: string
  name: string
  active: boolean
  current_shot?: number | string
  impairments: number
  color: string
  action_values: VehicleActionValues
  description: DescriptionValues
  schticks: Schtick[]
  advancements: Advancement[]
  sites: Site[]
  weapons: Weapon[]
  skills: SkillValues
  user?: User
  created_at?: string
  updated_at?: string
  new?: boolean
  category: CharacterCategory
}

export interface Person {
  id?: string
  name: string
  active: boolean
  current_shot?: number | string
  impairments: number
  color: string
  action_values: ActionValues
  description: DescriptionValues
  schticks: Schtick[]
  skills: SkillValues
  advancements: Advancement[]
  sites: Site[]
  weapons: Weapon[]
  user?: User
  created_at?: string
  updated_at?: string
  new?: boolean
  category: CharacterCategory
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
  severity: Severity
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
  severity: Severity
  change?: string
  action_value?: string
}

export type ShotType = [number, Character[]]

interface CharacterEffects {
  [key: string]: CharacterEffect[]
}

export interface Fight {
  id?: string
  active: boolean
  name?: string
  sequence: number
  effects: Effect[]
  characters?: Character[]
  vehicles?: Vehicle[]
  shot_order: ShotType[]
  character_effects: CharacterEffects
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
  campaign_id?: string
  campaign?: Campaign
  maximum_count: number
  remaining_count: number
  pending_user: User
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
    "Background": "",
    "Melodramatic Hook": ""
  },
  schticks: [],
  skills: {},
  advancements: [],
  sites: [],
  weapons: []
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
  description: {
    "Nicknames": "",
    "Age": "",
    "Height": "",
    "Weight": "",
    "Hair Color": "",
    "Eye Color": "",
    "Style of Dress": "",
    "Appearance": "",
    "Background": "",
    "Melodramatic Hook": ""
  },
  schticks: [],
  skills: {},
  advancements: [],
  sites: [],
  weapons: []
}

export const defaultFight:Fight = {
  name: '',
  active: true,
  sequence: 1,
  effects: [],
  characters: [],
  shot_order: [],
  character_effects: {}
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
  },
  color: ""
}

export const defaultAdvancement:Advancement = {
  description: ""
}

export const defaultSite:Site = {
  description: ""
}

export const defaultWeapon:Weapon = {
  name: "",
  description: "",
  damage: 7,
  concealment: 0,
  reload_value: 0,
  juncture: "",
  category: "",
  mook_bonus: 0,
  kachunk: false
}

export const defaultPaginationMeta:PaginationMeta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 1
}

