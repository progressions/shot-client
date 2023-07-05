import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import type { FilterParamsType, OptionType, InputParamsType, Character, Party } from "../../types/types"
import { defaultParty } from "../../types/types"
import { useEffect, useReducer } from "react"
import type { PartiesStateType, PartiesActionType } from "../../reducers/partiesState"
import { PartiesActions } from "../../reducers/partiesState"
import Faction from "../../components/characters/edit/Faction"

interface PartyModalProps {
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PartyModal({ state, dispatch, open, setOpen }: PartyModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, party } = state

  console.log(party)

  async function addParty(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatch({ type: PartiesActions.SAVING })

    try {
      await client.createParty(party as Party)
      dispatch({ type: PartiesActions.EDIT })
      setOpen(false)
    } catch(error) {
      toastError()
    }
    dispatch({ type: PartiesActions.RESET })
  }

  function cancelForm() {
    dispatch({ type: PartiesActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.name, event.target.value)
    dispatch({ type: PartiesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          sx={{width: 400}}
          required
          autoFocus
          value={party?.name || ""}
          name="name"
          label="Name"
          onChange={handleChange}
          disabled={loading}
        />
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          fullWidth
          multiline
          rows={3}
          value={party?.description || ""}
          name="description"
          label="Description"
          onChange={handleChange}
          disabled={loading}
        />
      </Stack>
      <Faction faction={""} onChange={handleChange} />
      <Stack direction="row" spacing={1} alignItems="center">
        <CancelButton disabled={loading} onClick={cancelForm} />
        <SaveButton disabled={loading} onClick={addParty}>Add</SaveButton>
      </Stack>
    </>
  )
}

