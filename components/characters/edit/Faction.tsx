import { useClient } from "../../../contexts/ClientContext"
import { TextField, Stack, Autocomplete } from "@mui/material"
import { useEffect, useReducer } from "react"
import { StyledAutocomplete, StyledTextField } from "../../StyledFields"
import type { Faction, InputParamsType } from "../../../types/types"
import { defaultFaction } from "../../../types/types"

export interface FactionStateType {
  loading: boolean
  anchorEl: Element | null
  value: Faction
  factions: Faction[]
}

export interface FactionActionType {
  type: string
  factions: Faction[]
}

const initialState: FactionStateType = {
  loading: false,
  anchorEl: null,
  value: defaultFaction,
  factions: []
}

function factionReducer(state: FactionStateType, action: FactionActionType) {
  switch(action.type) {
    case "replace":
      return {
        ...state,
        factions: action.factions
      }
    default:
      return state
  }
}

interface FactionProps {
  faction: Faction
  onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}

export default function Faction({ faction, onChange }: FactionProps) {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(factionReducer, initialState)
  const { loading, anchorEl, value, factions } = state

  async function getFactions() {
    try {
      const data = await client.getFactions()
      dispatch({ type: "replace", factions: data })
    } catch(error) {
      console.error(error)
    }
  }

  function changeFaction(event: React.ChangeEvent<HTMLInputElement>, newFaction: Faction) {
    onChange({...event, target: {...event.target, name: "faction_id", value: newFaction.id as string}}, newFaction.id as string)
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={factions}
          sx={{ width: 300 }}
          value={faction || defaultFaction}
          onChange={changeFaction}
          onOpen={getFactions}
          openOnFocus
          renderInput={(params: InputParamsType) => <StyledTextField autoFocus name="faction_id" {...params} label="Faction" />}
          getOptionLabel={(option: Faction) => option.name}
        />
      </Stack>
    </>
  )
}
