import { useEffect, useState, useMemo, useReducer } from "react"
import { FormControlLabel, Switch, Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { useToast } from "@/contexts/ToastContext"
import CreateJuncture from "@/components/junctures/CreateJuncture"
import { JuncturesActions, JuncturesStateType, JuncturesActionType } from "@/reducers/juncturesState"
import { StyledSelect } from "@/components/StyledFields"
import JunctureAutocomplete from "@/components/junctures/JunctureAutocomplete"
import type { Faction, Juncture } from "@/types/types"
import { useLocalStorage } from "@/contexts/LocalStorageContext"
import GamemasterOnly from "@/components/GamemasterOnly"

interface FilterJuncturesProps {
  state: JuncturesStateType
  dispatch: React.Dispatch<JuncturesActionType>
}

export default function FilterJunctures({ state, dispatch }: FilterJuncturesProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { saveLocally, getLocally } = useLocalStorage()
  const { hidden, faction, page, loading, search } = state

  useEffect(() => {
    const showHidden = getLocally("junctures.showHidden")
    dispatch({ type: JuncturesActions.EDIT, name: "hidden", value: showHidden === "true" })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: JuncturesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const showHidden = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    saveLocally("junctures.showHidden", checked.toString())
    dispatch({ type: JuncturesActions.EDIT, name: "hidden", value: checked })
  }

  return (
    <>
      <Stack spacing={2} direction="row" alignItems="center">
        <JunctureAutocomplete state={state} dispatch={dispatch} />
        { !character?.id && <CreateJuncture state={state} dispatch={dispatch} /> }
        <GamemasterOnly user={user}>
          <FormControlLabel name="hidden" label="Show Hidden" control={<Switch checked={!!hidden} />} onChange={showHidden} />
        </GamemasterOnly>
      </Stack>
    </>
  )
}
