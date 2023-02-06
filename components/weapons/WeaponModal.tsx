import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import type { FilterParamsType, OptionType, Juncture, InputParamsType, Character, Weapon } from "../../types/types"
import { defaultWeapon } from "../../types/types"
import { useEffect, useReducer } from "react"
import type { WeaponsStateType, WeaponsActionType } from "../../reducers/weaponsState"
import { WeaponsActions } from "../../reducers/weaponsState"

const filterOptions = createFilterOptions<Juncture>();

interface WeaponModalProps {
  state: WeaponsStateType
  dispatch: React.Dispatch<WeaponsActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WeaponModal({ state, dispatch, open, setOpen }: WeaponModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, weapon, junctures } = state

  async function addWeapon(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatch({ type: WeaponsActions.SAVING })

    try {
      await client.createWeapon(weapon)
      dispatch({ type: WeaponsActions.EDIT })
      setOpen(false)
    } catch(error) {
      toastError()
    }
  }

  function cancelForm() {
    dispatch({ type: WeaponsActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: WeaponsActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  function changeJuncture(event: React.SyntheticEvent<Element, Event>, newValue: Juncture) {
    dispatch({ type: WeaponsActions.UPDATE, name: "juncture", value: newValue })
  }

  function getOptionLabel(option: Juncture | OptionType) {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          sx={{width: 400}}
          required
          value={weapon?.name}
          name="name"
          label="Name"
          onChange={handleChange}
          disabled={loading}
        />
        <Box sx={{width: 300}}>
          <StyledAutocomplete
            freeSolo
            value={weapon?.juncture || null}
            disabled={loading}
            options={junctures || []}
            sx={{ width: 200 }}
            onChange={changeJuncture}
            openOnFocus
            getOptionLabel={getOptionLabel}
            filterOptions={(options: Juncture[], params: FilterParamsType) => {
              const filtered = filterOptions(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option: Juncture) => inputValue === option);
              if (inputValue !== '' && !isExisting) {
                filtered.push(
                  inputValue,
                );
              }

              return filtered;
            }}
            renderInput={(params: InputParamsType) => <StyledTextField {...params} label="Juncture" />}
          />
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          sx={{width: 80}}
          type="number"
          required
          value={weapon?.damage}
          name="damage"
          label="Damage"
          onChange={handleChange}
          disabled={loading}
        />
        <StyledTextField
          sx={{width: 80}}
          type="number"
          required
          value={weapon?.concealment}
          name="concealment"
          label="Concealment"
          onChange={handleChange}
          disabled={loading}
        />
        <StyledTextField
          sx={{width: 80}}
          type="number"
          required
          value={weapon?.reload_value}
          name="reload_value"
          label="Reload"
          onChange={handleChange}
          disabled={loading}
        />
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          fullWidth
          multiline
          rows={3}
          required
          value={weapon?.description}
          name="description"
          label="Description"
          onChange={handleChange}
          disabled={loading}
        />
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <CancelButton disabled={loading} onClick={cancelForm} />
        <SaveButton disabled={loading} onClick={addWeapon}>Add</SaveButton>
      </Stack>
    </>
  )
}
