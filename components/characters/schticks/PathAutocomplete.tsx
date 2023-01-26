import { Autocomplete, TextField } from "@mui/material"

export default function PathAutocomplete({ state, dispatch, schticksState }) {
  const { loading, path } = state
  const { paths } = schticksState

  function selectPath(event: any, newValue: any) {
    dispatch({ type: "update", name: "path", value: newValue })
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
