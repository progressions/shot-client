import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"

export const initialState = {
  loading: false,
  category: "",
  path: "",
  title: ""
}

export function filterReducer (state: any, action: any) {
  switch(action.type) {
    case "update":
      return {
        ...state,
        [action.name]: action.value || ""
      }
    default:
      return state
  }
}

export default function FilterSchticks({ setState, state:schticksState }: any) {
  const [state, dispatch] = useReducer(filterReducer, initialState)
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { loading, category, path } = state
  const { paths } = schticksState

  const categories = useMemo(() => (["Guns", "Martial Arts", "Transformed Animal", "Creature", "Cyborg", "Driving", "Foe", "Mutant", "Sorcery"]), [])

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ category, path })
      if (response.status === 200) {
        const data = await response.json()
        setState(data)
      }
    }

    if (user) {
      getSchticks().catch(toastError)
    }
  }, [client, toastError, user, setState, category, path])

  function getOptionLabel(option: any) {
    return option || ""
  }

  function selectCategory(event: any, newValue: any) {
    dispatch({ type: "update", name: "category", value: newValue })
    dispatch({ type: "update", name: "path", value: "" })
  }

  function selectPath(event: any, newValue: any) {
    dispatch({ type: "update", name: "path", value: newValue })
  }

  return (
    <Stack direction="row" spacing={1} sx={{marginTop: 2}}>
      <Autocomplete
        value={category || null}
        disabled={loading}
        options={categories}
        sx={{ width: 300 }}
        onChange={selectCategory}
        openOnFocus
        getOptionLabel={getOptionLabel}
        renderInput={(params) => <TextField autoFocus name="Category" {...params} label="Category" />}
      />
      <Autocomplete
        value={path || null}
        disabled={loading}
        options={paths}
        sx={{ width: 300 }}
        onChange={selectPath}
        openOnFocus
        getOptionLabel={getOptionLabel}
        renderInput={(params) => <TextField autoFocus name="Path" {...params} label="Path" />}
      />
    </Stack>
  )
}
