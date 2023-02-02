import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import SchtickAutocomplete from "./SchtickAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import PathAutocomplete from "./PathAutocomplete"
import { SchticksActions } from "./schticksState"

import type { SchticksStateType, SchticksActionType } from "./schticksState"

interface FilterSchticksProps {
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function FilterSchticks({ state, dispatch }: FilterSchticksProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { page, loading, category, path, title } = state

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks({ page, category, path, title, character_id: character?.id as string })
      if (response.status === 200) {
        const data = await response.json()
        dispatch({ type: SchticksActions.SCHTICKS, payload: data })
      }
    }

    if (user?.id) {
      getSchticks().catch(toastError)
    }
  }, [character?.id, dispatch, user?.id, category, path, toastError, client, page, title])

  return (
    <>
      <CategoryAutocomplete state={state} dispatch={dispatch} />
      <PathAutocomplete state={state} dispatch={dispatch} />
      <SchtickAutocomplete state={state} dispatch={dispatch} />
    </>
  )
}
