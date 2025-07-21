import { StyledFormDialog, StyledAutocomplete, StyledSelect, StyledTextField, SaveCancelButtons } from "@/components/StyledFields"
import { FormControlLabel, Switch, DialogContent, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"

import type { WeaponCategory, FilterParamsType, OptionType, JunctureName, InputParamsType, Character, Weapon } from "@/types/types"
import { defaultWeapon } from "@/types/types"
import { useState, useEffect, useReducer } from "react"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"
import { WeaponsActions } from "@/reducers/weaponsState"
import ImageManager from "@/components/images/ImageManager"

const filterOptions = createFilterOptions<JunctureName>();

interface WeaponModalProps {
  weapon?: Weapon
  state: WeaponsStateType
  dispatch?: React.Dispatch<WeaponsActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WeaponModal({ state, dispatch, open, setOpen, weapon:initialWeapon }: WeaponModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, categories, junctures } = state
  const [weapon, setWeapon] = useState<Weapon>(initialWeapon || defaultWeapon)

  async function updateWeapon(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    if (dispatch) {
      dispatch({ type: WeaponsActions.SAVING })
    }

    try {
      weapon?.id ? await client.updateWeapon(weapon) : await client.createWeapon(weapon)
      if (dispatch) {
        dispatch({ type: WeaponsActions.EDIT })
      }
      setOpen(false)
    } catch(error) {
      toastError()
    }
  }

  async function deleteImage(weapon: Weapon) {
    await client.deleteWeaponImage(weapon as Weapon)
  }

  function cancelForm() {
    // dispatch({ type: WeaponsActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // dispatch({ type: WeaponsActions.UPDATE, name: event.target.name, value: event.target.value })
    setWeapon(oldWeapon => ({ ...weapon, [event.target.name]: event.target.value }))
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>) => {
    const target = event.target as HTMLInputElement
    setWeapon(oldWeapon => ({ ...weapon, [target.name]: target.checked }))
  }

  function changeCategory(event: React.SyntheticEvent<Element, Event>, newValue: WeaponCategory) {
    // dispatch({ type: WeaponsActions.UPDATE, name: "category", value: newValue })
    setWeapon(oldWeapon => ({ ...weapon, category: newValue }))
  }

  function changeJuncture(event: React.SyntheticEvent<Element, Event>, newValue: JunctureName) {
    // dispatch({ type: WeaponsActions.UPDATE, name: "juncture", value: newValue })
    setWeapon(oldWeapon => ({ ...weapon, juncture: newValue }))
  }

  function getOptionLabel(option: JunctureName | OptionType) {
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
      <StyledFormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Weapon"
        onCancel={cancelForm}
        onSubmit={updateWeapon}
      >
        <Stack direction="column" spacing={2}>
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
                  filterOptions={(options: JunctureName[], params: FilterParamsType) => {
                    const filtered = filterOptions(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option: JunctureName) => inputValue === option);
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
              <StyledAutocomplete
                name="category"
                freeSolo
                value={weapon?.category || null}
                disabled={loading}
                options={categories || []}
                sx={{ width: 200 }}
                onChange={changeCategory}
                openOnFocus
                getOptionLabel={getOptionLabel}
                filterOptions={(options: WeaponCategory[], params: FilterParamsType) => {
                  const filtered = filterOptions(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option: WeaponCategory) => inputValue === option);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push(
                      inputValue,
                    );
                  }

                  return filtered;
                }}
                renderInput={(params: InputParamsType) => <StyledTextField {...params} name="category" label="Category" />}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                required
                value={weapon?.damage || ""}
                name="damage"
                label="Damage"
                onChange={handleChange}
                disabled={loading}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                value={weapon?.concealment || ""}
                name="concealment"
                label="Concealment"
                onChange={handleChange}
                disabled={loading}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                value={weapon?.reload_value || ""}
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
                value={weapon?.description || ""}
                name="description"
                label="Description"
                onChange={handleChange}
                disabled={loading}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledTextField
                sx={{width: 100}}
                value={weapon?.mook_bonus}
                name="mook_bonus"
                label="Bonus vs Mooks"
                onChange={handleChange}
                disabled={loading}
              />
              <FormControlLabel
                label="Ka-chunk"
                name="kachunk"
                control={<Switch checked={weapon?.kachunk} />}
                onChange={handleCheck} />
            </Stack>
            { weapon?.id && <ImageManager name="weapon" entity={weapon} updateEntity={updateWeapon} deleteImage={deleteImage} apiEndpoint="weapons" /> }
          </Stack>
      </StyledFormDialog>
    </>
  )
}
