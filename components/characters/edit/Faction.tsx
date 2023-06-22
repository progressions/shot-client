import { useClient } from "../../../contexts/ClientContext"
import { TextField, Stack, Autocomplete } from "@mui/material"
import { useEffect, useReducer } from "react"
import { StyledAutocomplete, StyledTextField } from "../../StyledFields"
import type { InputParamsType } from "../../../types/types"

export interface FactionStateType {
  loading: boolean
  anchorEl: Element | null
  value: string
  factions: string[]
}

export interface FactionActionType {
  type: string
  factions: string[]
}

const initialState: FactionStateType = {
  loading: false,
  anchorEl: null,
  value: "",
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
  faction: string
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

  function changeFaction(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    console.log("hello")
    onChange({...event, target: {...event.target, name: "Faction", value: newValue}}, newValue)
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={factions}
          sx={{ width: 300 }}
          value={faction}
          onChange={changeFaction}
          onOpen={getFactions}
          openOnFocus
          renderInput={(params: InputParamsType) => <StyledTextField autoFocus name="Faction" {...params} label="Faction" />}
          filterOptions={(options: string[], params: any) => {
            const filtered = options.filter((option: string) => option.toLowerCase().includes(params.inputValue.toLowerCase()))
            if (filtered.length === 0 && params.inputValue !== "") {
              filtered.push(params.inputValue)
            }
            return filtered
          }}
        />
      </Stack>
    </>
  )
}
