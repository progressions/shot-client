import { IconButton, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import ClearIcon from '@mui/icons-material/Clear'

import type { Site } from "../../types/types"

interface SiteProps {
  site: Site
}

export default function Site({ site }: SiteProps) {
  const { client } = useClient()
  const { toastError } = useToast()
  const { character, reloadCharacter } = useCharacter()

  async function deleteSite() {
    const response = await client.deleteSite(character, site)
    if (response.status === 200) {
      await reloadCharacter()
    } else {
      toastError()
    }
  }

  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Typography>{site.description}</Typography>
      <IconButton onClick={deleteSite}>
        <ClearIcon />
      </IconButton>
    </Stack>
  )
}
