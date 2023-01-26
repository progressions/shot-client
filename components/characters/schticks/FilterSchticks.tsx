import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import SchtickAutocomplete from "./SchtickAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import PathAutocomplete from "./PathAutocomplete"

export const initialFilter = {
  loading: false,
  category: "",
  path: "",
  paths: [],
  schtick: "",
  data: {}
}

export function filterReducer (state: any, action: any) {
  switch(action.type) {
    case "category":
      return {
        ...state,
        category: action.payload || "",
        path: ""
      }
    case "path":
      return {
        ...state,
        path: action.payload || "",
      }
    case "schtick":
      return {
        ...state,
        schtick: action.payload || "",
      }
    case "schticks":
      const { paths } = action.payload
      return {
        ...state,
        data: action.payload || {},
        paths: paths
      }
    default:
      return state
  }
}

export default function FilterSchticks({ filter, dispatchFilter }: any) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { loading, category, path } = filter

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ category, path })
      if (response.status === 200) {
        const data = await response.json()
        console.log("getSchticks", data)
        dispatchFilter({ type: "schticks", payload: data })
      }
    }

    if (user) {
      getSchticks().catch(toastError)
    }
  }, [client, toastError, user, dispatchFilter, category, path])

  return (
    <>
      <CategoryAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <PathAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <SchtickAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
    </>
  )
}
