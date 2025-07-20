import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import LaunchIcon from '@mui/icons-material/Launch'
import { Link, ButtonGroup, Tooltip, IconButton, Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useCharacter } from "@/contexts/CharacterContext"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { StyledAutocomplete, StyledSelect, StyledDialog, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { useState, useEffect } from "react"
import type { Character, InputParamsType } from '@/types/types'
import { CharacterActions } from "@/reducers/characterState"
import CS from "@/services/CharacterService"
import { FormActions, useForm } from '@/reducers/formState'

interface NotionLinkProps {
  open: boolean
  onClose: () => void
}

type FormData = {
  pages: any[]
  pageId: string
}

export default function NotionLink({ open, onClose }: NotionLinkProps) {
  const { character, dispatch } = useCharacter()
  const { user, client } = useClient()

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ pages: [], pageId: character?.notion_page_id || "" })
  const { loading, edited, saving, disabled, formData } = formState
  const { pages, pageId } = formData

  useEffect(() => {
    if (open) {
      const data = client.getNotionCharacters({ name: character?.name }).then(data => {
        dispatchForm({ type: FormActions.UPDATE, name: "pages", value: data })

        return data
      })
    }
  }, [open, client, character?.name])

  function filterData(data: any[]) {
    return data.filter((item: any) => {
      return item.properties.Name?.title?.[0]?.plain_text
    })
  }

  function onSubmit() {
    dispatch({ type: CharacterActions.UPDATE, name: "notion_page_id", value: pageId as string})
    onClose()
  }

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: any) {
    dispatchForm({ type: FormActions.UPDATE, name: "pageId", value: newValue?.id || "" })
  }

  function getOptionLabel(page: any) {
    return page?.properties?.Name?.title?.[0]?.plain_text || ""
  }

  const helperText = (pages?.length) ? "": "There are no available pages."
  const notionLink = CS.notionLink(character)

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        onSubmit={onSubmit}
        title="Link Character"
      >
        <DialogContent>
          <Stack spacing={2}>
            <StyledAutocomplete
              value={(pages || []).find((page: any) => page.id === pageId) || null}
              disabled={loading}
              options={pages || []}
              sx={{ width: 250 }}
              onChange={handleSelect}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
              renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Notion Page" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton disabled={loading} onClick={onClose} />
          <Button variant="contained" color="primary" onClick={onSubmit}>Save</Button>
        </DialogActions>
      </StyledDialog>
    </>
  )
}
