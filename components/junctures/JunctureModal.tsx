import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { FormControlLabel, Switch, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"

import GamemasterOnly from "@/components/GamemasterOnly"
import type { Vehicle, FilterParamsType, OptionType, InputParamsType, Character, Juncture } from "@/types/types"
import { defaultFaction, defaultJuncture } from "@/types/types"
import { useState, useEffect, useReducer } from "react"
import type { JuncturesStateType, JuncturesActionType } from "@/reducers/juncturesState"
import { JuncturesActions } from "@/reducers/juncturesState"
import Faction from "@/components/characters/edit/Faction"
import CharacterFilters from "@/components/characters/CharacterFilters"
import SelectCharacter from "@/components/characters/SelectCharacter"
import ImageManager from "@/components/images/ImageManager"
import Editor from "@/components/editor/Editor"
import { FormActions, useForm } from "@/reducers/formState"

interface JunctureModalProps {
  state: JuncturesStateType
  dispatch: React.Dispatch<JuncturesActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  juncture?: Juncture
}

type FormData = {
  juncture: Juncture
}

export default function JunctureModal({ state, dispatch, open, setOpen, juncture:initialJuncture }: JunctureModalProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({
    juncture: initialJuncture || defaultJuncture
  })
  const { loading, formData } = formState
  const { juncture } = formData

  const { toastSuccess, toastError } = useToast()
  const { client, user } = useClient()

  async function updateJuncture(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    try {
      const data = juncture?.id ?
        await client.updateJuncture(juncture as Juncture) :
        await client.createJuncture(juncture as Juncture)
      setOpen(false)
      toastSuccess(`${juncture.name} ${juncture?.id ? "updated" : "added"}.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatch({ type: JuncturesActions.EDIT })
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  async function deleteImage(juncture: Juncture) {
    await client.deleteJunctureImage(juncture as Juncture)
  }

  function cancelForm() {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchForm({ type: FormActions.UPDATE, name: "juncture", value: {
      ...juncture,
      [event.target.name]: event.target.value
    } })
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    const target = event.target as HTMLInputElement
    dispatchForm({
      type: FormActions.UPDATE,
      name: "juncture",
      value: {
        ...juncture,
        [target.name]: checked
      }
    })
  }

  return (
    <>
      <GamemasterOnly user={user}>
        <FormControlLabel label="Active" name="active" control={<Switch checked={juncture.active} />} onChange={handleCheck} />
      </GamemasterOnly>
      <Stack spacing={2} direction="row">
        <Stack spacing={1} sx={{width: 550, maxWidth: 550}}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              sx={{width: 600}}
              required
              autoFocus
              value={juncture?.name || ""}
              name="name"
              label="Name"
              onChange={handleChange}
              // disabled={loading}
            />
          </Stack>
          <Editor name="description" value={juncture?.description || ""} onChange={handleChange} />
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelButton disabled={loading} onClick={cancelForm} />
            <SaveButton disabled={loading} onClick={updateJuncture}>{ juncture?.id ? "Save" : "Add" }</SaveButton>
          </Stack>
        </Stack>
        { juncture?.id && <ImageManager name="juncture" entity={juncture} updateEntity={updateJuncture} deleteImage={deleteImage} apiEndpoint="junctures" /> }
      </Stack>
    </>
  )
}
