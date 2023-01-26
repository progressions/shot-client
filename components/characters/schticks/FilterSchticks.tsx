import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import SchtickAutocomplete from "./SchtickAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import PathAutocomplete from "./PathAutocomplete"

export const initialFilterState = {
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

export default function FilterSchticks({ dispatch:schticksDispatch, state:schticksState }: any) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState)
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { loading, category, path } = state

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ category, path })
      if (response.status === 200) {
        const data = await response.json()
        console.log("getSchticks", data)
        schticksDispatch({ type: "replace_schticks", payload: data })
      }
    }

    if (user) {
      getSchticks().catch(toastError)
    }
  }, [client, toastError, user, schticksDispatch, category, path])

  return (
    <>
      <CategoryAutocomplete state={state} dispatch={dispatch} />
      <PathAutocomplete state={state} dispatch={dispatch} schticksState={schticksState} />
      <SchtickAutocomplete schticksState={schticksState} schticksDispatch={schticksDispatch} />
  </>
  )
}
