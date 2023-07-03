import { IconButton, Stack, Typography } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import { useCharacter } from "../../../../contexts/CharacterContext"
import { useClient } from "../../../../contexts/ClientContext"
import { useToast } from "../../../../contexts/ToastContext"
import type { Site } from "../../../../types/types"

interface SiteProps {
  site: Site
}

export default function Site({ site }: SiteProps) {
  const { client } = useClient()
  const { toastError } = useToast()
  const { character, reloadCharacter } = useCharacter()

  async function deleteSite() {
    try {
      await client.removeSite(character, site)
      await reloadCharacter()
    } catch(error) {
      toastError()
    }
  }

  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Typography>{site.name}</Typography>
      <IconButton onClick={deleteSite}>
        <ClearIcon />
      </IconButton>
    </Stack>
  )
}
