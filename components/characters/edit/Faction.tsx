import { useClient } from "../../../contexts/ClientContext"
import { TextField, Stack, Autocomplete } from "@mui/material"
import { useEffect, useReducer } from "react"
import { StyledAutocomplete, StyledTextField } from "../../StyledFields"

const initialState = {
  loading: false,
  anchorEl: null,
  value: "",
  factions: []
}

function factionReducer(state: any, action: any) {
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

export default function Faction({ faction, onChange }: any) {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(factionReducer, initialState)
  const { loading, anchorEl, value, factions } = state

  async function getFactions() {
    const response = await client.getFactions()
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: "replace", factions: data })
    }
  }

  function changeFaction(event: any, newValue: any) {
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
          renderInput={(params: any) => <StyledTextField autoFocus name="Faction" {...params} label="Faction" />}
        />
      </Stack>
    </>
  )
}
