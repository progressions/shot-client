import { Stack, Box, TextField, MenuItem } from "@mui/material"
import type { Site, InputParamsType } from "@/types/types"
import { SitesStateType, SitesActionType, SitesActions } from "@/reducers/sitesState"
import { StyledAutocomplete, StyledTextField, StyledSelect } from "@/components/StyledFields"

interface SiteAutocompleteProps {
  state: SitesStateType,
  dispatch: React.Dispatch<SitesActionType>
}

export default function SiteAutocomplete({ state, dispatch }: SiteAutocompleteProps) {
  const { loading, site, sites } = state

  const selectSite = (event: React.SyntheticEvent, value: Site | null) => {
    dispatch({ type: SitesActions.SITE, payload: value })
  }

  const getOptionLabel = (option: Site) => {
    if (!option?.id) return ""
    return `${option?.name} (${option?.characters?.length} characters)`
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={sites}
          sx={{ width: 300 }}
          value={site}
          onChange={selectSite}
          getOptionLabel={getOptionLabel}
          renderInput={(params: InputParamsType) => <StyledTextField autoFocus {...params} label="Site" />}
        />
      </Stack>
    </>
  )
}
