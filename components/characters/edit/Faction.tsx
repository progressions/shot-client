import { useClient } from "@/contexts/ClientContext"
import { TextField, Stack, Autocomplete } from "@mui/material"
import { useReducer } from "react"
import { StyledAutocomplete, StyledTextField } from "@/components/StyledFields"
import type { Faction, InputParamsType } from "@/types/types"
import { defaultFaction } from "@/types/types"

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
  width?: number
  sx?: React.CSSProperties
}

export default function Faction({ faction, onChange, width, sx }: FactionProps) {
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

  async function changeFaction(event: React.ChangeEvent<HTMLInputElement>, newFaction: Faction) {
    if (newFaction?.id === undefined && newFaction?.name !== undefined) {
      const data = await client.createFaction({ ...defaultFaction, name: newFaction.name })
      onChange({...event, target: {...event.target, name: "faction_id", value: data.id as string}}, data.id as string)
      return
    }
    onChange({...event, target: {...event.target, name: "faction_id", value: newFaction?.id || "" as string}}, newFaction?.id || "" as string)
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={factions}
          sx={sx || { width: width || 300 }}
          value={faction || ""}
          onChange={changeFaction}
          onOpen={getFactions}
          openOnFocus
          renderInput={(params: InputParamsType) => <StyledTextField name="faction_id" {...params} label="Faction" />}
          getOptionLabel={(option: Faction) => option.name || ""}
          filterOptions={(options: Faction[], params: any) => {
            const filtered = options.filter((option: Faction) => option.name.toLowerCase().includes(params.inputValue.toLowerCase()))
            if (filtered.length === 0 && params.inputValue !== "") {
              filtered.push({ name: params.inputValue } as Faction)
            }
            return filtered
          }}
        />
      </Stack>
    </>
  )
}
