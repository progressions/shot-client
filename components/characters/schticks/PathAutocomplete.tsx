import { Autocomplete, TextField } from "@mui/material"

export default function PathAutocomplete({ filter, dispatchFilter }) {
  const { loading, path, paths } = filter

  function selectPath(event: any, newValue: any) {
    dispatchFilter({ type: "path", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option || ""
  }

  return (
    <Autocomplete
      value={path || null}
      disabled={loading}
      options={paths}
      sx={{ width: 300 }}
      onChange={selectPath}
      openOnFocus
      getOptionLabel={getOptionLabel}
      renderInput={(params) => <TextField autoFocus name="Path" {...params} label="Path" />}
    />
  )
}
