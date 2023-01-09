export interface ActionValues {
  [key: string]: string | number | null | undefined,
  Guns?: string,
  "Martial Arts"?: string,
  Sorcery?: string,
  Scroungetech?: string,
  Genome?: string,
  Defense?: string,
  Toughness?: string,
  Speed?: string,
  Fortune?: string,
  "Max Fortune"?: string,
  FortuneType?: string,
  MainAttack?: string,
  SecondaryAttack?: string,
  Wounds: string,
  Type?: CharacterType | string | null,
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
  defense?: string,
  current_shot?: number | string,
  impairments: number,
  color?: string,
  action_values: ActionValues,
  user?: any,
  created_at?: string,
  updated_at?: string,
  new?: boolean
}

export interface Fight {
  id?: string,
  name?: string,
  characters?: Character[],
  shot_order?: any
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
