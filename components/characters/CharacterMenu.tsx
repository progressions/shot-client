import { useState } from "react"
import { colors, Link, Menu, MenuItem, IconButton } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { useToast, useCharacter, useClient } from "@/contexts"
import AssignUser from "@/components/characters/edit/AssignUser"
import NotionLink from "@/components/notion/NotionLink"
import { FormActions, useForm } from '@/reducers/formState'
import { useRouter } from "next/router"
import CharacterModal from "@/components/characters/CharacterModal"
import VehicleModal from "@/components/vehicles/VehicleModal"
import { defaultCharacter, defaultVehicle } from "@/types/types"
import type { Character, Vehicle } from "@/types/types"

type FormData = {
  newCharacter: Character | null
  newVehicle: Vehicle | null
  anchorEl: null | HTMLElement
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

  const initialFormData: FormData = { anchorEl: null, newCharacter: null, newVehicle: null, isSyncing: false, isLinking: false, isDownloading: false, isDeleting: false }
  const { formState, dispatchForm, initialFormState } = useForm<FormData>(initialFormData)
  const { formData } = formState
  const { anchorEl, newCharacter, newVehicle, isSyncing, isLinking, isDownloading, isDeleting } = formData

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "anchorEl", value: event.currentTarget })
  }
  const handleClose = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "anchorEl", value: null })
  }
  const openCharacterModal = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "newCharacter", value: { ...defaultCharacter, new: true } })
  }
  const openVehicleModal = () => {
    dispatchForm({ type: FormActions.UPDATE, name: "newVehicle", value: { ...defaultVehicle, new: true } })
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

  return (<>
    <IconButton onClick={handleClick} sx={{backgroundColor: colors.blueGrey[200], color: "black"}}>
      <MoreHorizIcon />
    </IconButton>
    <Menu
      id="character-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={openCharacterModal}>
        Create Character
      </MenuItem>
      <MenuItem onClick={openVehicleModal}>
        Create Vehicle
      </MenuItem>
      <MenuItem>
        <Link underline="none" color="inherit" href='/characters/upload'>
          Import Characters
        </Link>
      </MenuItem>
      <MenuItem>
        <Link underline="none" color="inherit" href='/characters/generate'>
          Generate GMCs
        </Link>
      </MenuItem>
    </Menu>
    <CharacterModal character={newCharacter} />
    <VehicleModal character={newVehicle} />
  </>)
}

