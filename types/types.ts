import { NextApiRequest, NextApiResponse } from 'next'
import { AlertColor } from "@mui/material"

export interface Toast {
  open: boolean
  message: string
  severity: AlertColor | undefined
}

export interface ActionValues {
  [key: string]: string | number | null | undefined | boolean
  Guns?: number
  "Martial Arts"?: number
  Sorcery?: number
  Scroungetech?: number
  Genome?: number
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
  Damage?: number,
  Vehicle?: boolean,
  "Marks of Death": number
}

export interface VehicleActionValues {
  [key: string]: number | Position | CharacterType | undefined
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

export type Position = "near" | "far"

export type CharacterType = "" | "PC" | "Ally" | "Mook" | "Featured Foe" | "Boss" | "Uber-Boss"

export interface ID {
  id: string
}

export type Character = Vehicle | Person

export interface Vehicle {
  id?: string,
  name: string,
  current_shot?: number | string,
  impairments: number,
  color: string,
  action_values: VehicleActionValues,
  user?: User,
  created_at?: string,
  updated_at?: string,
  new?: boolean
  category: "character" | "vehicle"
}

export interface Person {
  id?: string,
  name: string,
  current_shot?: number | string,
  impairments: number,
  color: string,
  action_values: ActionValues,
  user?: User,
  created_at?: string,
  updated_at?: string,
  new?: boolean
  category: "character" | "vehicle"
}

export type ShotType = [number, Character[]]

export interface Fight {
  id?: string,
  name?: string,
  characters?: Character[],
  shot_order: ShotType[]
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

export interface CharacterFilter {
  type: string | null,
  name: string | null
}

export interface ServerSideProps {
  req: NextApiRequest,
  res: NextApiResponse,
  params?: any
}

export const defaultCharacter:Person = {
  name: '',
  category: "character",
  current_shot: '',
  impairments: 0,
  color: '',
  action_values: {
    Guns: 0,
    "Martial Arts": 0,
    Sorcery: 0,
    Scroungetech: 0,
    Genome: 0,
    Defense: 0,
    Toughness: 0,
    Speed: 0,
    Fortune: 0,
    "Max Fortune": 0,
    FortuneType: "Fortune",
    MainAttack: "Guns",
    SecondaryAttack: null,
    Wounds: 0,
    Type: "PC",
    Vehicle: false,
    "Marks of Death": 0
  }
}

export const defaultVehicle:Vehicle = {
  name: '',
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
    Position: "far",
    Type: "PC"
  }
}

export const defaultFight:Fight = {
  name: '',
  characters: [],
  shot_order: []
}

export const defaultUser:User = {
  email: '',
}
