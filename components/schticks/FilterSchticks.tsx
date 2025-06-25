import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { useToast } from "@/contexts/ToastContext"
import SchtickAutocomplete from "@/components/schticks/SchtickAutocomplete"
import CategoryAutocomplete from "@/components/schticks/CategoryAutocomplete"
import PathAutocomplete from "@/components/schticks/PathAutocomplete"
import { SchticksActions } from "@/reducers/schticksState"

import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

interface FilterSchticksProps {
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function FilterSchticks({ state, dispatch }: FilterSchticksProps) {
  console.log("FilterSchticks edited", state.edited)
  return (
    <>
      <CategoryAutocomplete state={state} dispatch={dispatch} />
      <PathAutocomplete state={state} dispatch={dispatch} />
      <SchtickAutocomplete state={state} dispatch={dispatch} />
    </>
  )
}
