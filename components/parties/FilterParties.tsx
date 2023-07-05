import { useEffect, useState, useMemo, useReducer } from "react"
import { Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import CreateParty from "./CreateParty"
import type { PartiesStateType, PartiesActionType } from "../../reducers/partiesState"

interface FilterPartiesProps {
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
}

export default function FilterParties({ state, dispatch }: FilterPartiesProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { page, loading, search } = state

  return (
    <>
      <Stack spacing={2} direction="row" alignItems="top">
        { !character?.id && <CreateParty state={state} dispatch={dispatch} /> }
      </Stack>
    </>
  )
}


