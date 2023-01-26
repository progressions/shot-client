import { Autocomplete, TextField } from '@mui/material'

export default function SchtickAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, schtick, data } = filter

  function handleSelect(event: any, newValue: any) {
    dispatchFilter({ type: "schtick", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option.title
  }

  return (
    <Autocomplete
      disabled={loading}
      options={data.schticks || []}
      sx={{ width: 300 }}
      onChange={handleSelect}
      openOnFocus
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => <TextField autoFocus name="Schtick" {...params} label="Schtick" />}
    />
  )
}
