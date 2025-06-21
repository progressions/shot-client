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
  const { character, dispatch, syncCharacter, updateCharacter, reloadCharacter } = useCharacter()
  const { user, client } = useClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [userId, setUserId] = useState(character?.user_id || "")
  const [saving, setSaving] = useState(false)

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

  async function handleSync(): Promise<void> {
    setSaving(true)
    await syncCharacter()
    setSaving(false)
  }

  function handleLink() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function onSubmit() {
    dispatch({ type: CharacterActions.UPDATE, name: "user_id", value: userId as string})
    setOpen(false)
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

  return (
    <>
      <GamemasterOnly user={user}>
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
                value={character?.user || null}
                disabled={loading}
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
      </GamemasterOnly>
    </>
  )
}
