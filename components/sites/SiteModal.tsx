import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { FormControlLabel, Switch, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import GamemasterOnly from "../GamemasterOnly"
import type { Vehicle, FilterParamsType, OptionType, InputParamsType, Character, Site } from "../../types/types"
import { defaultFaction, defaultSite } from "../../types/types"
import { useEffect, useReducer } from "react"
import type { SitesStateType, SitesActionType } from "../../reducers/sitesState"
import { SitesActions } from "../../reducers/sitesState"
import Faction from "../../components/characters/edit/Faction"
import CharacterFilters from "../../components/characters/CharacterFilters"
import SelectCharacter from "../../components/characters/SelectCharacter"

interface SiteModalProps {
  state: SitesStateType
  dispatch: React.Dispatch<SitesActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SiteModal({ state, dispatch, open, setOpen }: SiteModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client, user } = useClient()
  const { loading, site } = state

  async function addSite(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatch({ type: SitesActions.SAVING })

    try {
      const data = site?.id ?
        await client.updateSite(site as Site) :
        await client.createSite(site as Site)
      dispatch({ type: SitesActions.EDIT })
      setOpen(false)
      toastSuccess(`${site.name} ${site?.id ? "updated" : "added"}.`)
    } catch(error) {
      console.log(error)
      toastError()
    }
    dispatch({ type: SitesActions.RESET })
  }

  function cancelForm() {
    dispatch({ type: SitesActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: SitesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: SitesActions.UPDATE, name: event.target.name, value: checked })
  }

  const addCharacter = async (character: Character):Promise<void> => {
    try {
      await client.addCharacterToSite(site, character as Character)

      toastSuccess(`${character.name} added.`)
    } catch(error) {
      toastError()
    }
    dispatch({ type: SitesActions.EDIT })
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          sx={{width: 400}}
          required
          autoFocus
          value={site?.name || ""}
          name="name"
          label="Name"
          onChange={handleChange}
          disabled={loading}
        />
        <GamemasterOnly user={user}>
          <FormControlLabel label="Active" name="secret" control={<Switch checked={site.secret} />} onChange={handleCheck} />
        </GamemasterOnly>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          fullWidth
          multiline
          rows={3}
          value={site?.description || ""}
          name="description"
          label="Description"
          onChange={handleChange}
          disabled={loading}
        />
      </Stack>
      <Faction faction={site.faction || defaultFaction} onChange={handleChange} />
      { site?.id && <SelectCharacter addCharacter={addCharacter} /> }
      <Stack direction="row" spacing={1} alignItems="center">
        <CancelButton disabled={loading} onClick={cancelForm} />
        <SaveButton disabled={loading} onClick={addSite}>{ site?.id ? "Save" : "Add" }</SaveButton>
      </Stack>
    </>
  )
}

