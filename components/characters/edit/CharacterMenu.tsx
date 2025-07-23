import { useState } from "react"
import { colors, Menu, MenuItem, IconButton } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { useToast, useCharacter, useClient } from "@/contexts"
import AssignUser from "@/components/characters/edit/AssignUser"
import NotionLink from "@/components/notion/NotionLink"
import { FormActions, useForm } from '@/reducers/formState'
import { useRouter } from "next/router"

type FormData = {
  assignUserOpen: boolean
  notionOpen: boolean
  anchorEl: null | HTMLElement
  isAssigning: boolean
  isSyncing: boolean
  isLinking: boolean
  isDownloading: boolean
  isDeleting: boolean
}

export default function CharacterMenu() {
  const { character, syncCharacter } = useCharacter()
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const router = useRouter()

  const initialFormData: FormData = { anchorEl: null, assignUserOpen: false, notionOpen: false, isAssigning: false, isSyncing: false, isLinking: false, isDownloading: false, isDeleting: false }
  const { formState, dispatchForm, initialFormState } = useForm<FormData>(initialFormData)
  const { formData } = formState
  const { anchorEl, assignUserOpen, notionOpen, isAssigning, isSyncing, isLinking, isDownloading, isDeleting } = formData

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "anchorEl", value: event.currentTarget })
  }
  const handleClose = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "anchorEl", value: null })
  }
  const openAssignUser = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "assignUserOpen", value: true })
    dispatchForm({ type: FormActions.UPDATE, name: "isAssigning", value: true })
  }
  const closeAssignUser = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "assignUserOpen", value: false })
    dispatchForm({ type: FormActions.UPDATE, name: "isAssigning", value: false })
  }
  const openNotionLink = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "notionOpen", value: true })
    dispatchForm({ type: FormActions.UPDATE, name: "isLinking", value: true })
  }
  const closeLink = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "notionOpen", value: false })
    dispatchForm({ type: FormActions.UPDATE, name: "isLinking", value: false })
  }

  async function handleSync(): Promise<void> {
    dispatchForm({ type: FormActions.UPDATE, name: "isSyncing", value: true })
    await syncCharacter()
    dispatchForm({ type: FormActions.UPDATE, name: "isSyncing", value: false })
  }

  async function downloadPdf() {
    dispatchForm({ type: FormActions.UPDATE, name: "isDownloading", value: true })
    try {
      const filename = `${character.name.replace(/\s+/g, "_")}.pdf`

      const data = await client.getCharacterPdf(character)
      const pdfBlob = new Blob([data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toastSuccess("PDF downloaded successfully")
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toastError("Error downloading PDF")
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this character? This action cannot be undone.")) {
      dispatchForm({ type: FormActions.UPDATE, name: "isDeleting", value: true })
      try {
        await client.deleteCharacter(character)
        toastSuccess("Character deleted successfully")
        router.push("/characters")
      } catch (error) {
        console.error('Error deleting character:', error)
        toastError("Error deleting character")
      }
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  return (<>
    <IconButton onClick={handleClick} sx={{backgroundColor: colors.blueGrey[800], color: "text.primary"}}>
      <MoreHorizIcon />
    </IconButton>
    <Menu
      id="character-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      { isAssigning && <MenuItem>Assigning...</MenuItem> }
      { !isAssigning && <MenuItem onClick={openAssignUser}>Assign User</MenuItem> }
      { isLinking && <MenuItem>Linking...</MenuItem> }
      { !isLinking && <MenuItem onClick={openNotionLink}>Link Notion Page</MenuItem> }
      { !isSyncing && <MenuItem onClick={handleSync}>Sync From Notion</MenuItem> }
      { isSyncing && <MenuItem>Syncing...</MenuItem> }
      { !isDownloading && <MenuItem onClick={downloadPdf}>Download PDF</MenuItem> }
      { isDownloading && <MenuItem>Downloading...</MenuItem> }
      { isDeleting && <MenuItem>Deleting...</MenuItem> }
      { !isDeleting && <MenuItem onClick={handleDelete}>Delete Character</MenuItem> }
    </Menu>

    <AssignUser open={assignUserOpen} onClose={closeAssignUser} />
    <NotionLink open={notionOpen} onClose={closeLink} />
  </>)
}
