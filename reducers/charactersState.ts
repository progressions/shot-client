import { Archetype, CharacterTypes, CharacterType, Character, PaginationMeta, CharacterCategory, defaultPaginationMeta, defaultCharacter, defaultFaction, Faction, CharactersResponse, CharactersAndVehiclesResponse } from "@/types/types"

export enum CharactersActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  CHARACTER = "character",
  RESET_CHARACTER = "reset_character",
  CHARACTERS = "characters",
  UPDATE = "update",
  UPDATE_CHARACTER = "update_character",
  OPEN = "open"
}

export interface CharactersStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  showHidden: boolean
  page: number
  character_type: CharacterTypes | string
  character_types: CharacterTypes[]
  characters: Character[]
  character: Character
  faction: Faction,
  factions: Faction[]
  archetype: Archetype
  archetypes: Archetype[]
  search: string
  meta: PaginationMeta
  open: boolean
  anchorEl: Element | null
}

export type PayloadType = CharacterCategory | Character | CharactersResponse | CharactersAndVehiclesResponse | string | Element | null

interface ActionNoPayload {
  type: Extract<CharactersActions, CharactersActions.RESET | CharactersActions.EDIT | CharactersActions.SAVING | CharactersActions.SUCCESS | CharactersActions.PREVIOUS | CharactersActions.NEXT | CharactersActions.RESET_CHARACTER>
}

interface PayloadAction {
  type: Extract<CharactersActions, CharactersActions.CHARACTER | CharactersActions.CHARACTERS | CharactersActions.OPEN>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<CharactersActions, CharactersActions.UPDATE | CharactersActions.UPDATE_CHARACTER>
  name: string
  value: string | boolean | number
}

export type CharactersActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialCharactersState:CharactersStateType = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  character_type: "",
  character_types: [],
  faction: defaultFaction,
  factions: [],
  archetype: "",
  archetypes: [],
  character: defaultCharacter,
  characters: [],
  search: "",
  meta: defaultPaginationMeta,
  showHidden: false,
  open: false,
  anchorEl: null
}

export function charactersReducer(state: CharactersStateType, action: CharactersActionType): CharactersStateType {
  switch(action.type) {
    case CharactersActions.EDIT:
      return {
        ...state,
        edited: true
      }
    case CharactersActions.PREVIOUS:
      return {
        ...state,
        edited: true,
        page: state.meta["prev_page"] as number
      }
    case CharactersActions.NEXT:
      return {
        ...state,
        edited: true,
        page: state.meta["next_page"] as number
      }
    case CharactersActions.OPEN:
      return {
        ...state,
        edited: true,
        open: true,
        anchorEl: action.payload as Element
      }
    case CharactersActions.SAVING:
      return {
        ...state,
        saving: true,
        edited: false
      }
    case CharactersActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case CharactersActions.UPDATE:
      if (action.name === "faction") {
        const faction = state.factions.find(faction => faction.id === action.value) || defaultFaction
        return {
          ...state,
          edited: true,
          page: 1,
          [action.name]: faction
        }
      }
      if (action.name === "page" ) {
        return {
          ...state,
          edited: true,
          page: action.value as number,
        }
      }
      return {
        ...state,
        edited: true,
        page: 1,
        [action.name]: action.value
      }
    case CharactersActions.UPDATE_CHARACTER:
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          [action.name]: action.value
        }
      }
    case CharactersActions.CHARACTER:
      return {
        ...state,
        edited: true,
        character: (action.payload || initialCharactersState.character) as Character,
      }
    case CharactersActions.CHARACTERS:
      const { characters, meta, factions, archetypes } = action.payload as CharactersResponse
      return {
        ...state,
        loading: false,
        characters: characters,
        factions: factions,
        archetypes: archetypes,
        meta: meta,
        page: meta.current_page || 1,
        edited: false,
      }
    case CharactersActions.RESET_CHARACTER:
      return {
        ...state,
        edited: true,
        character: defaultCharacter
      }
    case CharactersActions.RESET:
      return initialCharactersState
    default:
      return state
  }
}
