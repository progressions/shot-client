import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { IconButton, Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useCharacter } from "@/contexts/CharacterContext"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { StyledSelect, StyledDialog, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { useState, useEffect } from "react"
import type { Character } from '@/types/types'
import { CharacterActions } from "@/reducers/characterState"

interface LinkCharacterProps {
  pageId: string | null
}

export default function LinkCharacter({ pageId }: LinkCharacterProps) {
  const { character, dispatch:dispatchCharacter, updateCharacter, reloadCharacter } = useCharacter()
  const { user, client } = useClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])
  const [notionPageId, setNotionPageId] = useState(pageId)

  useEffect(() => {
    if (open) {
      const data = client.getNotionCharacters({ name: character?.name }).then(data => {
        setPages(data as any)
        setLoading(false)

        return data
      })
    }
  }, [open, client, character?.name])

  function handleClick() {
    setNotionPageId(pageId)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  async function onSubmit() {
    dispatchCharacter({ type: CharacterActions.UPDATE, name: "notion_page_id", value: notionPageId as string})
    setOpen(false)
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <LibraryAddIcon fontSize="large" color="inherit" />
      </IconButton>
      <StyledDialog
        open={open}
        onClose={handleClose}
        onSubmit={onSubmit}
        title="Link Character"
      >
        <DialogContent>
          <Stack spacing={2}>
            { pages && pages?.map((page: any) => (
              <Stack direction="row" key={page.id} spacing={1} divider={<Box sx={{ height: 1 }} />}>
                <Box sx={{width: 90}}>
                  { notionPageId === page.id ? (
                    <Button variant="contained" color="primary" onClick={() => setNotionPageId("")}>Unlink</Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => setNotionPageId(page.id)}>Link</Button>
                  )}
                </Box>
                <Box>
                  <Typography variant="h6">{page?.properties?.Name?.title?.[0]?.plain_text}</Typography>
                  <Typography variant="body1">{page?.properties?.Description?.rich_text?.[0]?.plain_text}</Typography>
                </Box>
              </Stack>
            ))}
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
