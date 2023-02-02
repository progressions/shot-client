import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import WeaponAutocomplete from "./WeaponAutocomplete"
import JunctureAutocomplete from "./JunctureAutocomplete"
import CategoryAutocomplete from "./CategoryAutocomplete"
import AddWeapon from "./AddWeapon"
import CreateWeapon from "./CreateWeapon"
import type { WeaponsStateType, WeaponsActionType } from "./weaponsState"

interface FilterWeaponsProps {
  state: WeaponsStateType
  dispatch: React.Dispatch<WeaponsActionType>
}

export default function FilterWeapons({ state: filter, dispatch: dispatchFilter }: FilterWeaponsProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { page, loading, juncture, name } = filter

  return (
    <>
      <Stack spacing={2} direction="row" alignItems="top">
        <JunctureAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
        <CategoryAutocomplete state={filter} dispatch={dispatchFilter} />
        <WeaponAutocomplete filter={filter} dispatchFilter={dispatchFilter} />
        { !character?.id && <CreateWeapon filter={filter} dispatchFilter={dispatchFilter} /> }
      </Stack>
    </>
  )
}

