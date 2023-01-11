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
  FortuneType?: number
  MainAttack?: number
  SecondaryAttack?: number
  Wounds: number
  Type?: CharacterType
  Damage?: number,
  Vehicle?: boolean,
  "Marks of Death": number
}

export type CharacterType = "" | "PC" | "Ally" | "Mook" | "Featured Foe" | "Boss" | "Uber-Boss"

export interface ID {
  id: string
}

export interface Character {
  id?: string,
  name: string,
  defense: string,
  current_shot?: number | string,
  impairments: number,
  color: string,
  action_values: ActionValues,
  user?: User,
  created_at?: string,
  updated_at?: string,
  new?: boolean
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


export const defaultCharacter:Character = {
  name: '',
  defense: '',
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
    FortuneType: 0,
    MainAttack: 0,
    SecondaryAttack: 0,
    Wounds: 0,
    Type: "PC",
    Vehicle: false,
    "Marks of Death": 0
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
