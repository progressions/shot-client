import { NextApiRequest, NextApiResponse } from 'next'
import { Session, User as NextAuthUser } from "next-auth"
import { AlertColor } from "@mui/material"

export interface Location {
  id?: string
  name: string
  shot?: Shot
}

export interface Shot {
  id?: string
  shot: number
}

export type Archetype = string

export interface Party {
  id?: string
  name: string
  description?: string
  faction?: Faction | null,
  characters: Character[]
  vehicles: Vehicle[]
  secret: boolean
}

export interface Faction {
  id?: string
  name: string
  description: string
}

export interface PartiesResponse {
  parties: Party[]
  factions: Faction[]
  meta: PaginationMeta
}

export interface SitesResponse {
  sites: Site[]
  factions: Faction[]
  meta: PaginationMeta
}

export interface SchticksResponse {
  schticks: Schtick[]
  meta: PaginationMeta
  paths: SchtickPath[]
  categories: SchtickCategory[]
}

export interface WeaponsResponse {
  weapons: Weapon[]
  meta: PaginationMeta
  junctures: Juncture[]
  categories: WeaponCategory[]
}

export interface FightsResponse {
  fights: Fight[]
  meta: PaginationMeta
}

export interface CharactersResponse {
  characters: Character[]
  meta: PaginationMeta
  factions: Faction[]
  archetypes: Archetype[]
}

export interface CharactersAndVehiclesResponse {
  characters: Character[]
  meta: PaginationMeta
  factions: Faction[]
}

export interface ErrorMessages {
  [key: string]: string
}

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
  name: string
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
  Archetype: Archetype
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
}

export interface Schtick {
  id?: string
  name: string
  description: string
  campaign_id: string
  category: SchtickCategory
  path: SchtickPath
  schtick_id: string
  prerequisite: {
    id?: string
    name?: string
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
  faction_id: string | null
  faction: Faction
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
  count: number
  shot_id: string
}

export interface Person {
  id?: string
  name: string
  active: boolean
  current_shot?: number | string
  impairments: number
  color: string
  faction_id: string | null
  faction: Faction
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
  count: number
  shot_id: string
}

export interface Advancement {
  id?: string
  description: string
}

export interface Site {
  id?: string
  name: string
  description?: string
  faction?: Faction | null,
  characters?: Character[]
  secret: boolean
}

export interface Effect {
  id?: string
  name: string
  description: string
  severity: Severity
  start_sequence: number
  end_sequence: number
  start_shot: number
  end_shot: number
}

export interface CharacterEffect {
  id?: string
  name: string
  description?: string
  character_id?: string
  vehicle_id?: string
  severity: Severity
  change?: string
  action_value?: string
  shot_id?: string
}

export type ShotType = [number, Character[]]

interface CharacterEffects {
  [key: string]: CharacterEffect[]
}

export interface Fight {
  id?: string
  active: boolean
  name?: string
  description?: string
  sequence: number
  effects: Effect[]
  characters?: Character[]
  vehicles?: Vehicle[]
  shot_order: ShotType[]
  character_effects: CharacterEffects
  vehicle_effects: CharacterEffects
}

export interface User {
  id?: string
  email: string
  password?: string
  first_name?: string
  last_name?: string
  gamemaster?: boolean
  admin?: boolean
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
  type: string | null
  name: string | null
}

export interface ParamsType {
  [key: string]: string
  id: string
}

export interface QueryType {
  [key: string]: string | undefined
  confirmation_token?: string
  reset_password_token?: string
}

export interface ServerSideProps {
  req: NextApiRequest
  res: NextApiResponse
  params?: ParamsType
  query?: QueryType
}

export const defaultFaction:Faction = {
  id: "",
  name: "",
  description: ""
}

export const defaultCharacter:Person = {
  name: '',
  category: "character",
  active: true,
  current_shot: 0,
  impairments: 0,
  color: '',
  faction_id: null,
  faction: defaultFaction,
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
  weapons: [],
  count: 0,
  shot_id: "",
}

export const defaultVehicle:Vehicle = {
  name: '',
  active: true,
  category: "vehicle",
  current_shot: '',
  impairments: 0,
  color: '',
  faction_id: null,
  faction: defaultFaction,
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
  weapons: [],
  count: 0,
  shot_id: "",
}

export const defaultFight:Fight = {
  name: "",
  description: "",
  active: true,
  sequence: 0,
  effects: [],
  characters: [],
  shot_order: [],
  character_effects: {},
  vehicle_effects: {}
}

export const defaultUser:User = {
  email: '',
}

export const defaultEffect:Effect = {
  name: "",
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
  name: "",
  description: "",
  gamemaster: defaultUser,
  players: [],
  invitations: []
}

export const defaultCharacterEffect:CharacterEffect = {
  name: "",
  description: "",
  severity: "info",
  character_id: "",
  shot_id: ""
}

export const defaultSchtick:Schtick = {
  name: "",
  description: "",
  campaign_id: "",
  category: "",
  path: "",
  schtick_id: "",
  prerequisite: {
    id: "",
    name: ""
  },
  color: ""
}

export const defaultAdvancement:Advancement = {
  description: ""
}

export const defaultSite:Site = {
  name: "",
  description: "",
  faction: null,
  secret: false
}

export const defaultParty:Party = {
  name: "",
  description: "",
  faction: null,
  characters: [],
  vehicles: [],
  secret: false
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

export const defaultLocation:Location = {
  name: ""
}
