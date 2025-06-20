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

export default function NotionLink() {
  const { character, dispatch, syncCharacter, updateCharacter, reloadCharacter } = useCharacter()
  const { user, client } = useClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])
  const [pageId, setPageId] = useState(character?.notion_page_id || "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      const data = client.getNotionCharacters({ name: character?.name }).then(data => {
        setPages(data as any)
        setLoading(false)

        return data
      })
    }
  }, [open, client, character?.name])

  function filterData(data: any[]) {
    return data.filter((item: any) => {
      return item.properties.Name?.title?.[0]?.plain_text
    })
  }

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
    dispatch({ type: CharacterActions.UPDATE, name: "notion_page_id", value: pageId as string})
    setOpen(false)
  }

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: any) {
    setPageId(newValue?.id || "")
  }

  function getOptionLabel(page: any) {
    return page?.properties?.Name?.title?.[0]?.plain_text || ""
  }

  const helperText = (pages?.length) ? "": "There are no available pages."
  const notionLink = CS.notionLink(character)

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <ButtonGroup variant="contained">
          <Tooltip title="Link to Notion Page" arrow>
            <Button onClick={handleLink}>
              <LibraryAddIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Sync from Notion" arrow>
            <Button onClick={handleSync} disabled={saving}>
              <SystemUpdateAltIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
        { notionLink &&
          <Tooltip title="Open Notion Page" arrow>
            <Link color="inherit" href={notionLink} target="_blank">
              <LaunchIcon fontSize="large" />
            </Link>
          </Tooltip>
         }
      </Stack>
      <StyledDialog
        open={open}
        onClose={handleClose}
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
          <CancelButton disabled={loading} onClick={handleClose} />
          <Button variant="contained" color="primary" onClick={onSubmit}>Save</Button>
        </DialogActions>
      </StyledDialog>
    </>
  )
}
