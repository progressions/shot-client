import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { FormControlLabel, Switch, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient, useToast, useCharacter } from "@/contexts"

import GamemasterOnly from "@/components/GamemasterOnly"
import type { Vehicle, FilterParamsType, OptionType, InputParamsType, Character, Party } from "@/types/types"
import { defaultFaction, defaultParty } from "@/types/types"
import { useState, useEffect, useReducer } from "react"
import type { PartiesStateType, PartiesActionType } from "@/reducers/partiesState"
import { PartiesActions } from "@/reducers/partiesState"
import Faction from "@/components/characters/edit/Faction"
import CharacterFilters from "@/components/characters/CharacterFilters"
import SelectCharacter from "@/components/characters/SelectCharacter"
import ImageManager from "@/components/images/ImageManager"
import Editor from "@/components/editor/Editor"

interface PartyModalProps {
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  party?: Party | undefined
}

export default function PartyModal({ state, dispatch, open, setOpen, party:initialParty }: PartyModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const { loading } = state
  const [party, setParty] = useState<Party>(initialParty || defaultParty)

  useEffect(() => {
    if (!party.id) {
      setParty(defaultParty)
    }
  }, [])

  async function updateParty(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()

    try {
      const data = party?.id ?
        await client.updateParty(party as Party) :
        await client.createParty(party as Party)
      dispatch({ type: PartiesActions.UPDATE, name: "search", value: "" })
      dispatch({ type: PartiesActions.EDIT })
      setOpen(false)
      toastSuccess(`${party.name} ${party?.id ? "updated" : "added"}.`)
    } catch(error) {
      toastError()
    }
  }

  async function deleteImage(party: Party) {
    await client.deletePartyImage(party as Party)
  }

  function cancelForm() {
    dispatch({ type: PartiesActions.UPDATE, name: "search", value: "" })
    setParty(defaultParty)
    setOpen(false)
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setParty({
      ...party,
      secret: checked
    })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setParty({
      ...party,
      [event.target.name]: event.target.value
    })
  }

  const addCharacter = async (character: Character):Promise<void> => {
    try {
      (character.category === "character") ?
        await client.addCharacterToParty(party, character as Character)
      : await client.addVehicleToParty(party, character as Vehicle)

      toastSuccess(`${character.name} added.`)
    } catch(error) {
      toastError()
    }
    dispatch({ type: PartiesActions.EDIT })
  }

  return (
    <>
      <GamemasterOnly user={user}>
        <FormControlLabel label="Secret" name="secret" control={<Switch checked={party.secret} />} onChange={handleCheck} />
      </GamemasterOnly>
      <Stack spacing={2} direction="row">
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              sx={{width: 600}}
              required
              autoFocus
              value={party?.name || ""}
              name="name"
              label="Name"
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>
          <Editor name="description" value={party?.description || ""} onChange={handleChange} />
          <Faction faction={party.faction || defaultFaction} onChange={handleChange} width={600} />
          { party?.id && <SelectCharacter addCharacter={addCharacter} /> }
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelButton disabled={loading} onClick={cancelForm} />
            <SaveButton disabled={loading} onClick={updateParty}>{ party?.id ? "Save" : "Add" }</SaveButton>
          </Stack>
        </Stack>
        { party?.id && <ImageManager name="party" entity={party} updateEntity={updateParty} deleteImage={deleteImage} apiEndpoint="parties" /> }
      </Stack>
    </>
  )
}

