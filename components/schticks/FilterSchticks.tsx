import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import SchtickAutocomplete from "./SchtickAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import PathAutocomplete from "./PathAutocomplete"

export default function FilterSchticks({ filter, dispatchFilter }: any) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { page, loading, category, path, title } = filter

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ page, category, path, title, character_id: character?.id as string })
      if (response.status === 200) {
        const data = await response.json()
        dispatchFilter({ type: "schticks", payload: data })
      }
    }

    if (user?.id) {
      getSchticks().catch(toastError)
    }
  }, [character?.id, dispatchFilter, user?.id, category, path, toastError, client, page, title])

  return (
    <>
      <CategoryAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <PathAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <SchtickAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
    </>
  )
}
