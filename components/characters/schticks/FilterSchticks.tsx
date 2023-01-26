import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useCharacter } from "../../../contexts/CharacterContext"
import { useToast } from "../../../contexts/ToastContext"
import SchtickAutocomplete from "./SchtickAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import PathAutocomplete from "./PathAutocomplete"

export const initialFilter = {
  loading: false,
  saving: false,
  path: "",
  paths: [],
  category: "",
  categories: [],
  schtick: { id: null, title: "" },
  data: {
    schticks: [],
    meta: {}
  }
}

export function filterReducer (state: any, action: any) {
  switch(action.type) {
    case "saving":
      return {
        ...state,
        saving: true
      }
    case "success":
      return {
        ...state,
        loading: false,
        saving: false
      }
    case "category":
      return {
        ...state,
        category: action.payload || initialFilter.category,
        path: initialFilter.path,
        schtick: initialFilter.schtick
      }
    case "path":
      return {
        ...state,
        path: action.payload || initialFilter.path,
      }
    case "schtick":
      return {
        ...state,
        schtick: action.payload || initialFilter.schtick,
      }
    case "schticks":
      const { paths, categories } = action.payload
      return {
        ...state,
        data: action.payload || initialFilter.data,
        paths: paths,
        categories: categories,
        schtick: initialFilter.schtick
      }
    default:
      return state
  }
}

export default function FilterSchticks({ filter, dispatchFilter }: any) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { loading, category, path } = filter

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ category, path, character_id: character?.id })
      if (response.status === 200) {
        const data = await response.json()
        dispatchFilter({ type: "schticks", payload: data })
      }
    }

    if (user?.id) {
      getSchticks().catch(toastError)
    }
  }, [character?.id, dispatchFilter, user?.id, category, path, toastError, client])

  return (
    <>
      <CategoryAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <PathAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <SchtickAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
    </>
  )
}
