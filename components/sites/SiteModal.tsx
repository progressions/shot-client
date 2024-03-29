import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { FormControlLabel, Switch, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"

import GamemasterOnly from "@/components/GamemasterOnly"
import type { Vehicle, FilterParamsType, OptionType, InputParamsType, Character, Site } from "@/types/types"
import { defaultFaction, defaultSite } from "@/types/types"
import { useEffect, useReducer } from "react"
import type { SitesStateType, SitesActionType } from "@/reducers/sitesState"
import { SitesActions } from "@/reducers/sitesState"
import Faction from "@/components/characters/edit/Faction"
import CharacterFilters from "@/components/characters/CharacterFilters"
import SelectCharacter from "@/components/characters/SelectCharacter"
import ImageManager from "@/components/images/ImageManager"
import Api from "@/utils/Api"

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
  const api = new Api()

  async function updateSite(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
      console.error(error)
      toastError()
    }
    dispatch({ type: SitesActions.RESET })
  }

  async function deleteImage(site: Site) {
    await client.deleteSiteImage(site as Site)
  }

  function cancelForm() {
    dispatch({ type: SitesActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: SitesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: SitesActions.UPDATE, name: "secret", value: checked })
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
      <GamemasterOnly user={user}>
        <FormControlLabel label="Hidden" name="secret" control={<Switch checked={site.secret} />} onChange={handleCheck} />
      </GamemasterOnly>
      <Stack spacing={2} direction="row">
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              sx={{width: 300}}
              required
              autoFocus
              value={site?.name || ""}
              name="name"
              label="Name"
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              sx={{width: 300}}
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
            <SaveButton disabled={loading} onClick={updateSite}>{ site?.id ? "Save" : "Add" }</SaveButton>
          </Stack>
        </Stack>
        { site?.id && <ImageManager name="site" entity={site} updateEntity={updateSite} deleteImage={deleteImage} apiEndpoint="allSites" /> }
      </Stack>
    </>
  )
}

