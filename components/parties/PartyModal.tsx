import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import type { FilterParamsType, OptionType, InputParamsType, Character, Party } from "../../types/types"
import { defaultFaction, defaultParty } from "../../types/types"
import { useEffect, useReducer } from "react"
import type { PartiesStateType, PartiesActionType } from "../../reducers/partiesState"
import { PartiesActions } from "../../reducers/partiesState"
import Faction from "../../components/characters/edit/Faction"
import CharacterFilters from "../../components/characters/CharacterFilters"
import SelectCharacter from "../../components/characters/SelectCharacter"

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

  async function addParty(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatch({ type: PartiesActions.SAVING })

    try {
      const data = party?.id ?
        await client.updateParty(party as Party) :
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
    dispatch({ type: PartiesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const addCharacter = async (character: Character):Promise<void> => {
    try {
      (character.category === "character") ?
        await client.addCharacterToParty(party, character)
      : await client.addVehicleToParty(party, character)

      toastSuccess(`${character.name} added.`)
    } catch(error) {
      toastError()
    }
    dispatch({ type: PartiesActions.EDIT })
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
      <Faction faction={party.faction || defaultFaction} onChange={handleChange} />
      <SelectCharacter addCharacter={addCharacter} />
      <Stack direction="row" spacing={1} alignItems="center">
        <CancelButton disabled={loading} onClick={cancelForm} />
        <SaveButton disabled={loading} onClick={addParty}>{ party?.id ? "Save" : "Add" }</SaveButton>
      </Stack>
    </>
  )
}

