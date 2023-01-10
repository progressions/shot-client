import { NextApiRequest, NextApiResponse } from 'next'
import { AlertColor } from "@mui/material"

export interface Toast {
  open: boolean
  message: string
  severity: AlertColor | undefined
}

export interface ActionValues {
  [key: string]: string | number | null | undefined
  Guns?: string
  "Martial Arts"?: string
  Sorcery?: string
  Scroungetech?: string
  Genome?: string
  Defense?: string
  Toughness?: string
  Speed?: string
  Fortune?: string
  "Max Fortune"?: string
  FortuneType?: string
  MainAttack?: string
  SecondaryAttack?: string
  Wounds: string
  Type?: CharacterType | string | null
  Damage?: string
}

export enum CharacterType {
  "PC",
  "Ally",
  "Mook",
  "Featured Foe",
  "Boss",
  "Uber-Boss"
}

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

export interface Fight {
  id?: string,
  name?: string,
  characters?: Character[],
  shot_order: [number, Character[]][]
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
    Guns: "",
    "Martial Arts": "",
    Sorcery: "",
    Scroungetech: "",
    Genome: "",
    Defense: "",
    Toughness: "",
    Speed: "",
    Fortune: "",
    "Max Fortune": "",
    FortuneType: "",
    MainAttack: "",
    SecondaryAttack: "",
    Wounds: "0",
    Type: ""
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
