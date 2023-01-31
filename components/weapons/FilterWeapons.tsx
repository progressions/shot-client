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

  return (
    <>
      <JunctureAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
      <WeaponAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
    </>
  )
}

