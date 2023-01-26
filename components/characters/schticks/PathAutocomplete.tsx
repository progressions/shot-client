import { Autocomplete, TextField } from "@mui/material"

export default function PathAutocomplete({ filter, dispatchFilter }) {
  const { loading, path, paths } = filter

  function selectPath(event: any, newValue: any) {
    dispatchFilter({ type: "path", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option || ""
  }

  const helperText = (paths.length) ? "" : "There are no available paths."

  return (
    <Autocomplete
      value={path || null}
      disabled={loading || !paths.length}
      options={paths}
      sx={{ width: 300 }}
      onChange={selectPath}
      openOnFocus
      getOptionLabel={getOptionLabel}
      renderInput={(params) => <TextField autoFocus helperText={helperText} {...params} label="Path" />}
    />
  )
}
