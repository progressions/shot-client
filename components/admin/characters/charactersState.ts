import { Archetype, CharacterType, Character, PaginationMeta, CharacterCategory, defaultPaginationMeta, defaultCharacter, Faction, CharactersResponse, CharactersAndVehiclesResponse } from "../../../types/types"

export enum CharactersActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  CHARACTER = "character",
  CHARACTERS = "characters",
  UPDATE = "update",
  UPDATE_CHARACTER = "update_character"
}

export interface CharactersStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  showHidden: boolean
  page: number
  character_type: CharacterType
  character_types: CharacterType[]
  characters: Character[]
  character: Character
  faction: Faction,
  factions: Faction[]
  archetype: Archetype
  archetypes: Archetype[]
  search: string
  meta: PaginationMeta
}

export type PayloadType = CharacterCategory | Character | CharactersResponse | CharactersAndVehiclesResponse | string

interface ActionNoPayload {
  type: Extract<CharactersActions, CharactersActions.RESET | CharactersActions.EDIT | CharactersActions.SAVING | CharactersActions.SUCCESS | CharactersActions.PREVIOUS | CharactersActions.NEXT>
}

interface PayloadAction {
  type: Extract<CharactersActions, CharactersActions.CHARACTER | CharactersActions.CHARACTERS>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<CharactersActions, CharactersActions.UPDATE | CharactersActions.UPDATE_CHARACTER>
  name: string
  value: string | boolean
}

export type CharactersActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialCharactersState:CharactersStateType = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  character_type: "",
  character_types: [],
  faction: "",
  factions: [],
  archetype: "",
  archetypes: [],
  character: defaultCharacter,
  characters: [],
  search: "",
  meta: defaultPaginationMeta,
  showHidden: false
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
      return {
        ...state,
        edited: true,
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
        edited: false,
      }
    case CharactersActions.RESET:
      return initialCharactersState
    default:
      return state
  }
}
