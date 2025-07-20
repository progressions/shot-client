import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { Link, ButtonGroup, Tooltip, IconButton, Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useCharacter, useClient, useToast } from "@/contexts"
import { StyledAutocomplete, StyledSelect, StyledDialog, StyledTextField, SaveCancelButtons } from "@/components/StyledFields"
import { useReducer, useState, useEffect } from "react"
import type { User, Character, InputParamsType } from '@/types/types'
import { CharacterActions } from "@/reducers/characterState"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"
import { FormActions, useForm } from '@/reducers/formState'

interface AssignUserProps {
  open: boolean
  onClose: () => void
}

type FormData = {
  users: User[]
  userId: string
}

export default function AssignUser({ open = false, onClose }: AssignUserProps) {
  const { character, state, dispatch, syncCharacter, updateCharacter, reloadCharacter } = useCharacter()

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ users: [], userId: character?.user_id || "" })
  const { loading, edited, saving, disabled, formData } = formState
  const { users, userId } = formData

  const { client } = useClient()

  useEffect(() => {
    dispatchForm({ type: FormActions.DISABLE, payload: !userId })
  }, [userId])

  useEffect(() => {
    if (open) {
      const data = client.getUsers().then(data => {
        const usersList = [{email: "None", id: ""}, ...data]
        dispatchForm({ type: FormActions.UPDATE, name: "users", value: usersList })

        return data
      })
    }
  }, [open, client, character?.name])

  function handleClose() {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
    dispatch({ type: CharacterActions.RESET })
    onClose()
  }

  async function handleSubmit() {
    dispatchForm({ type: FormActions.SUBMIT })
    const updatedCharacter = await client.updateCharacter({ ...character, user_id: userId })
    dispatch({ type: CharacterActions.CHARACTER, payload: updatedCharacter })
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
    onClose()
  }

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: any) {
    dispatchForm({ type: FormActions.UPDATE, name: "userId", value: newValue?.id || "" })
  }

  function getOptionLabel(user: any) {
    const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ")
    const name = (user?.first_name || user?.last_name) ? ` (${userName})` : ""
    return `${user?.email}${name}`
  }

  const helperText = (users?.length) ? "": "There are no available users."

  if (!CS.isPC(character)) {
    return <></>
  }

  if (saving) {
    return <Typography variant="h6">Saving...</Typography>
  }
  return (
    <>
      <StyledDialog
        open={open}
        disabled={saving || disabled}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Assign User"
      >
        <DialogContent>
          <Stack spacing={2}>
            <StyledAutocomplete
              value={character?.user}
              disabled={saving}
              options={users || []}
              sx={{ width: 250 }}
              onChange={handleSelect}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
              renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="User" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <SaveCancelButtons
            disabled={saving || disabled}
            onSave={handleSubmit}
            onCancel={handleClose}
          />
        </DialogActions>
      </StyledDialog>
    </>
  )
}
