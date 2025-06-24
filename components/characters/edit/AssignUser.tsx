import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { Link, ButtonGroup, Tooltip, IconButton, Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useCharacter } from "@/contexts/CharacterContext"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { StyledAutocomplete, StyledSelect, StyledDialog, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { useState, useEffect } from "react"
import type { User, Character, InputParamsType } from '@/types/types'
import { CharacterActions } from "@/reducers/characterState"
import CS from "@/services/CharacterService"
import GamemasterOnly from "@/components/GamemasterOnly"

export default function AssignUser() {
  const { character, state, dispatch, syncCharacter, updateCharacter, reloadCharacter } = useCharacter()
  const { client } = useClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [userId, setUserId] = useState(character?.user_id || "")
  const { edited, saving } = state

  useEffect(() => {
    if (open) {
      const data = client.getUsers().then(data => {
        const usersList = [{email: "None", id: ""}, ...data]
        setUsers(usersList as User[])
        setLoading(false)

        return data
      })
    }
  }, [open, client, character?.name])

  function handleLink() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    dispatch({ type: CharacterActions.RESET })
  }

  async function onSubmit() {
    setOpen(false)
    dispatch({ type: CharacterActions.UPDATE, name: "user_id", value: userId as string})
  }

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: any) {
    setUserId(newValue?.id || "")
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

  console.log("AssignUser character.user", character.user.first_name)

  return (
    <>
      <Tooltip title="Assign User" arrow>
        <Button variant="contained" onClick={handleLink} disabled={saving}>
          <PersonAddAlt1Icon />
        </Button>
      </Tooltip>
      <StyledDialog
        open={open}
        onClose={handleClose}
        onSubmit={onSubmit}
        title="Assign User"
      >
        <DialogContent>
          <Stack spacing={2}>
            <StyledAutocomplete
              value={character?.user}
              disabled={loading || saving}
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
          <CancelButton disabled={loading} onClick={handleClose} />
          <Button variant="contained" color="primary" onClick={onSubmit}>Save</Button>
        </DialogActions>
      </StyledDialog>
    </>
  )
}
