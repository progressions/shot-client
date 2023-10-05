import { Tooltip, IconButton } from "@mui/material"
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import CS from 
import { useState } from "react"

export default function SyncCharacter() {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { state:characterState, dispatch:dispatchCharacter, syncCharacter } = useCharacter()
  const { character } = characterState
  const [saving, setSaving] = useState(false)

  const notionLink = CS.notionLink(character)

  async function handleClick(): Promise<void> {
    setSaving(true)
    await syncCharacter()
    setSaving(false)
  }

  if (!notionLink) return null

  return (
    <>
      <Tooltip title="Sync Character from Notion" placement="top">
        <IconButton onClick={handleClick} disabled={saving}>
          <SystemUpdateAltIcon fontSize="large" sx={{color: "black"}} />
        </IconButton>
      </Tooltip>
    </>
  )
}
