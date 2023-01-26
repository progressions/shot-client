import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import SchtickAutocomplete from "./SchtickAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import PathAutocomplete from "./PathAutocomplete"

export const initialFilter = {
  loading: true,
  saving: false,
  page: 1,
  path: "",
  paths: [],
  category: "",
  categories: [],
  schtick: { id: null, title: "" },
  schticks: [],
}

export function filterReducer (state: any, action: any) {
  switch(action.type) {
    case "previous":
      return {
        ...state,
        page: state.meta["prev_page"]
      }
    case "next":
      return {
        ...state,
        page: state.meta["next_page"]
      }
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
      const { schticks, meta, paths, categories } = action.payload
      return {
        ...state,
        loading: false,
        schtick: initialFilter.schtick,
        schticks: schticks,
        meta: meta,
        paths: paths,
        categories: categories
      }
    default:
      return state
  }
}

export default function FilterSchticks({ filter, dispatchFilter }: any) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { page, loading, category, path } = filter

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ page, category, path, character_id: character?.id as string })
      if (response.status === 200) {
        const data = await response.json()
        dispatchFilter({ type: "schticks", payload: data })
      }
    }

    if (user?.id) {
      getSchticks().catch(toastError)
    }
  }, [character?.id, dispatchFilter, user?.id, category, path, toastError, client, page])

  return (
    <>
      <CategoryAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <PathAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <SchtickAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
    </>
  )
}
