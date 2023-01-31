import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import WeaponAutocomplete from "./WeaponAutocomplete"
import JunctureAutocomplete from "./JunctureAutocomplete"

export default function FilterWeapons({ filter, dispatchFilter }: any) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { page, loading, juncture, name } = filter

  useEffect(() => {
    async function getWeapons() {
      const response = await client.getWeapons({ page, juncture, name, character_id: character?.id as string })
      if (response.status === 200) {
        const data = await response.json()
        dispatchFilter({ type: "weapons", payload: data })
      }
    }

    if (user?.id) {
      getWeapons().catch(toastError)
    }
  }, [character?.id, dispatchFilter, user?.id, juncture, toastError, client, page, name])

  return (
    <>
      <JunctureAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <WeaponAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
    </>
  )
}

