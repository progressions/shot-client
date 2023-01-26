import { Autocomplete, TextField } from '@mui/material'

export default function SchtickAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, schtick, data } = filter

  function handleSelect(event: any, newValue: any) {
    dispatchFilter({ type: "schtick", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option.title
  }

  const helperText = (data.schticks.length) ? "": "There are no available schticks."

  return (
    <Autocomplete
      freeSolo
      value={schtick || {id: null, title: ""}}
      disabled={loading || !data.schticks.length}
      options={data.schticks || []}
      sx={{ width: 300 }}
      onChange={handleSelect}
      openOnFocus
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField autoFocus helperText={helperText} {...params} label="Schtick" />}
    />
  )
}
