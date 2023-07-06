import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useReducer } from "react"

import { SaveCancelButtons, StyledAutocomplete, StyledSelect } from "../../../StyledFields"
import { useCharacter } from "../../../../contexts/CharacterContext"
import { useClient } from "../../../../contexts/ClientContext"
import { useToast } from "../../../../contexts/ToastContext"
import { sitesReducer, initialSitesState, SitesActions } from "../../../../reducers/sitesState"
import { defaultSite, InputParamsType, Site } from "../../../../types/types"

export default function AddSite() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const [state, dispatchSites] = useReducer(sitesReducer, initialSitesState)
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const { edited, name, loading, site, sites } = state

  useEffect(() => {
    async function getSites() {
      try {
        const data = await client.getSites({character_id: character?.id})
        dispatchSites({ type: SitesActions.SITES, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getSites().catch(toastError)
    }
  }, [edited, character?.id, user?.id, client, toastError])

  async function addSite(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatchSites({ type: SitesActions.SAVING })

    try {
      if (site.id) {
        await client.addCharacterToSite(site, character)
        await reloadCharacter()
        dispatchSites({ type: SitesActions.RESET })
      } else {
        const newSite = await client.createSite(site)
        await client.addCharacterToSite(newSite, character)
        await reloadCharacter()
        dispatchSites({ type: SitesActions.RESET })
      }
    } catch(error) {
      toastError()
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchSites({ type: SitesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Site) {
    dispatchSites({ type: SitesActions.SITE, payload: newValue })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    dispatchSites({ type: SitesActions.NAME, payload: newValue })
  }

  function getOptionLabel(option: Site) {
    return option.name
  }

  const helperText = (sites.length) ? " ": "There are no available sites."

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <StyledAutocomplete
        onClick={() => dispatchSites({ type: SitesActions.RESET })}
        freeSolo
        value={site || defaultSite}
        disabled={loading}
        options={sites || []}
        sx={{ width: 250 }}
        onInputChange={handleInputChange}
        onChange={handleSelect}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option: Site, value: Site) => option.id === value.id}
        renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} onFocus={() => dispatchSites({ type: SitesActions.RESET })} label="Site" />}
        filterOptions={(options: Site[], params: any) => {
          const filtered = options.filter((option: Site) => option.name.toLowerCase().includes(params.inputValue.toLowerCase()))
          if (filtered.length === 0 && params.inputValue !== "") {
            filtered.push({ name: params.inputValue } as Site)
          }
          return filtered
        }}
      />
      <Box sx={{ height: 60 }}>
        <SaveCancelButtons disabled={loading} onSave={addSite} saveText="Add" />
      </Box>
    </Stack>
  )
}
