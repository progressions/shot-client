import { Autocomplete, TextField } from '@mui/material'

export default function SchtickAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, schtick, schticks } = filter

  function handleSelect(event: any, newValue: any) {
    dispatchFilter({ type: "schtick", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option.title
  }

  const helperText = (schticks.length) ? "": "There are no available schticks."

  return (
    <Autocomplete
      freeSolo
      value={schtick || {id: null, title: ""}}
      disabled={loading || !schticks.length}
      options={schticks || []}
      sx={{ width: 300 }}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField helperText={helperText} {...params} label="Schtick" />}
    />
  )
}
